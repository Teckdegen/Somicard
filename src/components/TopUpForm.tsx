import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, TrendingUp, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CONFIG } from '@/lib/config';

interface TopUpFormProps {
  onTopUp: (amount: number) => Promise<void>;
  isLoading: boolean;
}

const TopUpForm = ({ onTopUp, isLoading }: TopUpFormProps) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const MIN_AMOUNT = CONFIG.TOP_UP.MIN_AMOUNT;
  const MAX_AMOUNT = CONFIG.TOP_UP.MAX_AMOUNT;

  const validateAmount = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'Please enter a valid number';
    }
    if (numValue < MIN_AMOUNT) {
      return `Minimum amount is ${MIN_AMOUNT.toLocaleString()} PEPU`;
    }
    if (numValue > MAX_AMOUNT) {
      return `Maximum amount is ${MAX_AMOUNT.toLocaleString()} PEPU`;
    }
    return '';
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const validationError = validateAmount(value);
    setError(validationError);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onTopUp(parseFloat(amount));
      setAmount('');
      setError('');
      toast({
        title: "Top-up initiated",
        description: "Your transaction is being processed...",
      });
    } catch (err) {
      toast({
        title: "Transaction failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };



  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-card shadow-elevated">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Top Up PEPU</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Add funds to your debit card balance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (PEPU)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-center text-lg font-mono"
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step="1000"
            />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <p className="text-xs text-muted-foreground text-center">
              Min: {MIN_AMOUNT.toLocaleString()} • Max: {MAX_AMOUNT.toLocaleString()} PEPU
            </p>
          </div>

          {/* Manual input only - no quick amounts */}

          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs text-blue-800 font-medium">Important Information:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Balance updates may take a few minutes to reflect</li>
                  <li>• Your funds are secure and protected during processing</li>
                  <li>• We charge a 5% fee on all top-ups</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!!error || !amount || isLoading}
            className="w-full bg-gradient-primary text-primary-foreground font-semibold py-3 shadow-glow hover:shadow-elevated transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Top Up Now'
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default TopUpForm;
