import { Card } from './ui/card';
import { Button } from './ui/button';
import { Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CONFIG, isTelegramConfigured } from '@/lib/config';

interface DebitCardProps {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  billingAddress?: string;
  balance: number;
  fullName: string;
  hasCard: boolean;
  walletAddress?: string;
  onBalanceReload?: () => void;
}

const DebitCard = ({ 
  cardNumber = '•••• •••• •••• ••••', 
  expiryDate = '••/••', 
  cvv = '•••', 
  billingAddress = 'Not provided', 
  balance = 0, 
  fullName = 'YOUR NAME',
  hasCard = false,
  walletAddress,
  onBalanceReload
}: DebitCardProps) => {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    if (!hasCard) return;
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copied to clipboard`,
      duration: 2000,
    });
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const sendBalanceRequestNotification = async () => {
    // Check if Telegram is configured
    if (!isTelegramConfigured()) {
      console.warn('⚠️  Telegram not configured. Skipping notification.');
      return;
    }

    try {
      const message = `🔄 Balance Reload Request\n\n` +
        `👤 Name: ${fullName}\n` +
        `💳 Current Balance: ${balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\n` +
        `🔗 Wallet: ${walletAddress || 'N/A'}\n` +
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

      console.log('✅ Balance reload notification sent successfully');
    } catch (error) {
      console.error('❌ Telegram notification error:', error);
      // Don't throw - notification failure shouldn't break the flow
    }
  };

  const handleReloadBalance = async () => {
    if (!onBalanceReload) return;
    
    setIsLoading(true);
    try {
      // Send Telegram notification
      await sendBalanceRequestNotification();
      
      // Reload balance
      await onBalanceReload();
      
      toast({
        title: 'Balance reload requested',
        description: 'Your balance refresh request has been sent.',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update balance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format card number for display (e.g., **** **** **** 1234)
  const formatCardNumber = (number: string) => {
    if (!showDetails) {
      return '•••• •••• •••• ••••';
    }
    return number;
  };

  // Format expiry date for display
  const formatExpiryDate = (date: string) => {
    if (!showDetails) {
      return '••/••';
    }
    return date;
  };

  // Format CVV for display
  const formatCvv = (cvv: string) => {
    if (!showDetails) {
      return '•••';
    }
    return cvv;
  };

  return (
    <div className="space-y-6">
      {/* Card Preview with Image */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl -z-10" />
        <Card className="bg-gradient-to-br from-card to-card/90 border-border/50 overflow-hidden shadow-lg">
          {/* Graphical Card Representation */}
          <div className="relative w-full h-52 rounded-xl overflow-hidden">
            {/* Card Background Image from URL */}
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ax7SBeeNt2ao6E9dhH86Ivy51DaKms.png" 
              alt="Card Template" 
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={(e) => e.currentTarget.previousElementSibling?.remove()}
            />
            
            {/* Card Details Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-90 font-semibold">Balance</div>
                  <div className="text-2xl font-bold mt-1 drop-shadow-lg">
                    {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/50"></div>
                  </div>
                </div>
              </div>
              
              {/* Middle Section - Card Number */}
              <div className="text-center">
                <div className="text-xl tracking-[0.3em] font-mono font-bold drop-shadow-lg">
                  {formatCardNumber(cardNumber)}
                </div>
              </div>
              
              {/* Bottom Section */}
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-90 font-semibold mb-1">Cardholder</div>
                  <div className="font-bold text-base truncate max-w-[180px] drop-shadow-lg">{fullName.toUpperCase()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider opacity-90 font-semibold mb-1">Expires</div>
                  <div className="font-mono font-bold text-base drop-shadow-lg">{formatExpiryDate(expiryDate)}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Controls */}
          <div className="bg-card/80 border-t border-border/50 p-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {hasCard ? 'Active' : 'Inactive'}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 px-3 bg-green-500 hover:bg-green-600 text-black border-green-500 hover:border-green-600 font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-200"
                onClick={handleReloadBalance}
                disabled={isLoading}
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                Reload Balance
              </Button>
              {walletAddress && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7 border-green-500/50 text-green-500 hover:bg-green-500/10"
                  onClick={() => copyToClipboard(walletAddress, 'Wallet address')}
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy Address
                </Button>
              )}
              {hasCard && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="text-xs h-7 bg-green-500 hover:bg-green-600 text-black"
                  onClick={toggleDetails}
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Billing Address */}
      <Card className="bg-card/50 border-border/50 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium mb-1">Billing Address</h3>
            <p className="text-sm text-muted-foreground">
              {hasCard ? (showDetails ? billingAddress : '•••• •••••• •••• ••••') : 'No billing address provided'}
            </p>
          </div>
          {hasCard && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:text-green-500"
              onClick={() => billingAddress && copyToClipboard(billingAddress, 'Billing address')}
              disabled={!billingAddress}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DebitCard;