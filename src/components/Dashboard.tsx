import { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { LogOut, Copy, User } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CONFIG, getTreasuryAddress, isTelegramConfigured } from '@/lib/config';
import DebitCard from './DebitCard';
import TopUpForm from './TopUpForm';
import TransactionHistory from './TransactionHistory';

interface User {
  id: string;
  wallet_address: string;
  full_name: string;
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
  billing_address?: string;
  balance: number;
}

interface Transaction {
  id: string;
  tx_hash: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

const Dashboard = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  
  // Transaction hooks
  const { sendTransaction, data: hash, isPending, error: sendError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingTopUp, setPendingTopUp] = useState<{ amount: number; hash: string } | null>(null);

  useEffect(() => {
    if (address) {
      loadUserData();
    }
  }, [address]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash && pendingTopUp) {
      handleTransactionConfirmed(hash, pendingTopUp.amount);
    }
  }, [isConfirmed, hash, pendingTopUp]);

  // Handle transaction errors
  useEffect(() => {
    if (sendError) {
      console.error('Send transaction error:', sendError);
      toast({
        title: "Transaction Failed",
        description: sendError.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
      setPendingTopUp(null);
    }
  }, [sendError, toast]);

  const loadUserData = async () => {
    if (!address) return;

    try {
      setLoading(true);
      
      console.log('Loading user data for wallet:', address);
      
      // Try a different approach - use maybeSingle() which handles 0 rows gracefully
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', address)
        .maybeSingle();

      console.log('Direct query result:', { userData, userError });

      if (userError) {
        console.error('User fetch error:', userError);
        toast({
          title: "Database Error",
          description: "Failed to access user data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!userData) {
        console.error('No user found for wallet:', address);
        toast({
          title: "User Not Found",
          description: "Wallet address not registered. Contact support.",
          variant: "destructive",
        });
        return;
      }

      setUser(userData);

      // Fetch transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (transactionError) {
        console.error('Transactions fetch error:', transactionError);
      } else {
        setTransactions((transactionData || []) as Transaction[]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionConfirmed = async (txHash: string, amount: number) => {
    if (!user || !address) return;

    try {
      // Insert real transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          tx_hash: txHash,
          amount: amount,
          status: 'confirmed'
        });

      if (transactionError) {
        throw transactionError;
      }

      // Update user balance
      const newBalance = user.balance + amount;
      const { error: balanceError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.id);

      if (balanceError) {
        throw balanceError;
      }

      // Send Telegram notification
      await sendTelegramNotification({
        name: user.full_name,
        amount: amount,
        wallet: address,
        txHash: txHash
      });

      // Refresh data
      await loadUserData();
      setPendingTopUp(null);
      
      toast({
        title: "Top-up Successful!",
        description: `Added ${amount.toLocaleString()} PEPU to your balance.`,
      });
    } catch (error) {
      console.error('Transaction confirmation error:', error);
      toast({
        title: "Processing Error",
        description: "Transaction completed but processing failed. Contact support.",
        variant: "destructive",
      });
    }
  };

  const sendTelegramNotification = async (data: {
    name: string;
    amount: number;
    wallet: string;
    txHash: string;
  }) => {
    // Check if Telegram is configured
    if (!isTelegramConfigured()) {
      console.warn('⚠️  Telegram not configured. Skipping notification.');
      return;
    }

    try {
      const message = `🚀 New Top-up Transaction\n\n` +
        `👤 Name: ${data.name}\n` +
        `💰 Amount: ${data.amount.toLocaleString()} PEPU\n` +
        `🔗 Wallet: ${data.wallet}\n` +
        `📋 TX Hash: ${data.txHash}\n` +
        `⏰ Time: ${new Date().toLocaleString()}`;

      const response = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CONFIG.TELEGRAM.CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send Telegram notification');
      }

      console.log('✅ Telegram notification sent successfully');
    } catch (error) {
      console.error('❌ Telegram notification error:', error);
      // Don't throw - notification failure shouldn't break the flow
    }
  };

  const handleTopUp = async (amount: number) => {
    if (!user || !address) return;

    try {
      // SOMI is the native gas token, so we send SOMI directly (no conversion needed)
      const somiAmount = parseEther(amount.toString());
      
      console.log(`🚀 Sending ${amount.toLocaleString()} SOMI to treasury`);
      
      // Send SOMI transaction to treasury address
      sendTransaction({
        to: getTreasuryAddress(),
        value: somiAmount,
      });
      
      // Store pending transaction info
      setPendingTopUp({ amount, hash: '' });
      
      toast({
        title: "Transaction Initiated",
        description: "Please confirm the transaction in your wallet.",
      });
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction Failed",
        description: "Failed to initiate transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = () => {
    disconnect();
    setUser(null);
    setTransactions([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="min-h-screen bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-16 bg-muted rounded-lg"></div>
              <div className="h-56 bg-muted rounded-lg max-w-md mx-auto"></div>
              <div className="h-64 bg-muted rounded-lg max-w-md mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 p-8 bg-card rounded-lg shadow-elevated max-w-md mx-auto border border-border">
          <h2 className="text-xl font-bold text-destructive">Access Denied</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Your wallet address is not on the approved list.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-foreground font-medium mb-2">
                Want to get early access?
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Contact us on Telegram to join the waitlist:
              </p>
              <a 
                href="https://t.me/teck_degen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                @teck_degen
              </a>
            </div>
          </div>
          <Button onClick={handleDisconnect} variant="outline" className="border-green-500/50 text-green-500 hover:bg-green-500/10">
            Disconnect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden selection:bg-green-600/30 selection:text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse motion-safe:animate-[pulse_5s_ease-in-out_infinite]" />
      
      <div className="min-h-screen relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-green-500/10 shadow-lg shadow-green-500/5">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 flex items-center justify-center shadow-inner">
                    <User className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white tracking-tight">
                      {user.full_name}
                    </h1>
                    <button
                      onClick={() => copyToClipboard(address!)}
                      className="flex items-center space-x-1.5 text-sm text-gray-400 hover:text-green-500 transition-all group hover:-translate-y-0.5"
                    >
                      <span className="font-mono">{truncateAddress(address!)}</span>
                      <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
                className="border-green-500/50 text-green-500 hover:bg-green-500/10 hover:border-green-500 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Debit Card */}
          <section>
            <DebitCard
              cardNumber={user.card_number}
              expiryDate={user.expiry_date}
              cvv={user.cvv}
              billingAddress={user.billing_address}
              balance={user.balance}
              fullName={user.full_name}
              hasCard={!!user.card_number}
              walletAddress={address}
              onBalanceReload={loadUserData}
            />
          </section>

          {/* Top Up Form */}
          <section className="transition-all duration-300">
            <TopUpForm
              onTopUp={handleTopUp}
              isLoading={isPending || isConfirming}
            />
          </section>

          {/* Transaction History */}
          <section className="transition-all duration-300">
            <TransactionHistory
              transactions={transactions}
              loading={false}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
