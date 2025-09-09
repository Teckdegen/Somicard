import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { LogOut, Copy, User } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [topUpLoading, setTopUpLoading] = useState(false);

  useEffect(() => {
    if (address) {
      loadUserData();
    }
  }, [address]);

  const loadUserData = async () => {
    if (!address) return;

    try {
      setLoading(true);
      
      // Set current wallet address for RLS
      await supabase.rpc('set_current_wallet_address', { 
        wallet_addr: address 
      });

      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', address)
        .single();

      if (userError) {
        console.error('User fetch error:', userError);
        toast({
          title: "Access Denied",
          description: "Contact support to register your wallet address.",
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

  const handleTopUp = async (amount: number) => {
    if (!user) return;

    try {
      setTopUpLoading(true);
      
      // Generate a mock transaction hash for demo purposes
      const mockTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      // Insert transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          tx_hash: mockTxHash,
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

      // Refresh data
      await loadUserData();
      
      toast({
        title: "Top-up Successful!",
        description: `Added ${amount.toLocaleString()} PEPU to your balance.`,
      });
    } catch (error) {
      console.error('Top-up error:', error);
      toast({
        title: "Top-up Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setTopUpLoading(false);
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
      <div className="min-h-screen bg-purple-bg bg-cover bg-center bg-no-repeat">
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
      <div className="min-h-screen bg-purple-bg bg-cover bg-center bg-no-repeat flex items-center justify-center">
        <div className="text-center space-y-4 p-8 bg-card rounded-lg shadow-elevated">
          <h2 className="text-xl font-bold text-destructive">Access Denied</h2>
          <p className="text-muted-foreground">
            Your wallet address is not registered. Please contact support.
          </p>
          <Button onClick={handleDisconnect} variant="outline">
            Disconnect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-bg bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-6 h-6 text-primary" />
                  <div>
                    <h1 className="text-lg font-bold text-card-foreground">
                      {user.full_name}
                    </h1>
                    <button
                      onClick={() => copyToClipboard(address!)}
                      className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-card-foreground transition-colors"
                    >
                      <span className="font-mono">{truncateAddress(address!)}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
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
            />
          </section>

          {/* Top Up Form */}
          <section>
            <TopUpForm
              onTopUp={handleTopUp}
              isLoading={topUpLoading}
            />
          </section>

          {/* Transaction History */}
          <section>
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