import { Card } from './ui/card';
import { Button } from './ui/button';
import { Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CONFIG } from '@/lib/config';

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

  const handleReloadBalance = async () => {
    if (!onBalanceReload) return;
    
    setIsLoading(true);
    try {
      await onBalanceReload();
      toast({
        title: 'Balance updated',
        description: 'Your card balance has been refreshed.',
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

  return (
    <div className="space-y-6">
      {/* Card Preview */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl -z-10" />
        <Card className="bg-gradient-to-br from-card to-card/90 border-border/50 overflow-hidden shadow-lg">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Balance</div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleReloadBalance}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            <div className="text-3xl font-bold">
              {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Card Number</div>
                <div className="font-mono tracking-wider">
                  {showDetails ? cardNumber : '•••• •••• •••• ••••'}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={toggleDetails}
              >
                {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Expires</div>
                <div className="font-mono">{showDetails ? expiryDate : '••/••'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">CVV</div>
                <div className="font-mono">{showDetails ? cvv : '•••'}</div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-1">Cardholder</div>
              <div className="font-medium">{fullName}</div>
            </div>
          </div>
          
          <div className="bg-card/80 border-t border-border/50 p-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {hasCard ? 'Active' : 'Inactive'}
            </div>
            <div className="flex space-x-2">
              {walletAddress && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
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
                  className="text-xs h-8"
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
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
