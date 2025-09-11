import { Card } from './ui/card';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DebitCardProps {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  billingAddress?: string;
  balance: number;
  fullName: string;
  hasCard: boolean;
}

const DebitCard = ({ 
  cardNumber, 
  expiryDate, 
  cvv, 
  billingAddress, 
  balance, 
  fullName,
  hasCard 
}: DebitCardProps) => {
  const [showSensitive, setShowSensitive] = useState(false);
  const { toast } = useToast();

  const formatCardNumber = (number?: string) => {
    if (!number) return '**** **** **** ****';
    if (showSensitive) return number.replace(/(.{4})/g, '$1 ').trim();
    return `**** **** **** ${number.slice(-4)}`;
  };

  const formatCVV = (cvv?: string) => {
    if (!cvv) return '***';
    return showSensitive ? cvv : '***';
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  if (!hasCard) {
    return (
      <Card className="relative w-full max-w-md mx-auto h-56 bg-gradient-card border-2 border-dashed border-muted flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <div className="text-6xl">🐸</div>
          <div className="space-y-2">
            <p className="text-muted-foreground font-medium">
              Top up PEPU to activate your card
            </p>
            <p className="text-2xl font-bold text-card-foreground">
              {formatBalance(balance)}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative w-full max-w-md mx-auto h-56 bg-gradient-primary text-primary-foreground shadow-elevated overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-primary-foreground/30"></div>
        <div className="absolute top-8 right-8 w-8 h-8 rounded-full border-2 border-primary-foreground/20"></div>
      </div>
      
      {/* Card Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs font-medium opacity-80">PEPUNS X PENK</h3>
            <p className="text-lg font-bold mt-1">{formatBalance(balance)}</p>
          </div>
          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            {showSensitive ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Card Number */}
        <div className="space-y-4">
          <div 
            className="cursor-pointer group"
            onClick={() => cardNumber && copyToClipboard(cardNumber, 'Card number')}
          >
            <p className="text-xs opacity-60 mb-1">CARD NUMBER</p>
            <p className="text-lg font-mono tracking-wider group-hover:opacity-80 transition-opacity">
              {formatCardNumber(cardNumber)}
              {cardNumber && <Copy className="inline ml-2 w-4 h-4 opacity-60" />}
            </p>
          </div>

          {/* Bottom Row */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-60 mb-1">CARDHOLDER</p>
              <p className="text-sm font-medium uppercase">{fullName}</p>
            </div>
            
            <div className="text-right space-x-4 flex">
              <div>
                <p className="text-xs opacity-60 mb-1">EXPIRES</p>
                <p className="text-sm font-mono">{expiryDate || 'MM/YY'}</p>
              </div>
              
              <div 
                className="cursor-pointer group"
                onClick={() => cvv && copyToClipboard(cvv, 'CVV')}
              >
                <p className="text-xs opacity-60 mb-1">CVV</p>
                <p className="text-sm font-mono group-hover:opacity-80 transition-opacity">
                  {formatCVV(cvv)}
                  {cvv && <Copy className="inline ml-1 w-3 h-3 opacity-60" />}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DebitCard;