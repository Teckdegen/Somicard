import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CONFIG, isTelegramConfigured, calculatePepuAmount, getPepuPrice } from '@/lib/config';
import { Loader2 } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  dateOfBirth: string;
  houseNumber: string;
  homeAddress: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { toast } = useToast();
  const { sendTransaction, data: hash, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+1',
    phoneNumber: '',
    dateOfBirth: '',
    houseNumber: '',
    homeAddress: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pepuAmount, setPepuAmount] = useState<number>(0);
  const [pepuPrice, setPepuPrice] = useState<number>(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);

  // Fetch PEPU price on component mount
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLoadingPrice(true);
        const price = await getPepuPrice();
        setPepuPrice(price);
        const amount = await calculatePepuAmount(CONFIG.CARD_REGISTRATION_FEE);
        setPepuAmount(amount);
      } catch (error) {
        console.error('Error fetching PEPU price:', error);
      } finally {
        setIsLoadingPrice(false);
      }
    };
    fetchPrice();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendTelegramNotification = async (txHash: string) => {
    if (!isTelegramConfigured()) {
      console.warn('⚠️  Telegram not configured. Skipping notification.');
      return;
    }

    try {
      const message = `🎉 New Card Registration\n\n` +
        `👤 Name: ${formData.firstName} ${formData.lastName}\n` +
        `📧 Email: ${formData.email}\n` +
        `📱 Phone: ${formData.phoneCode} ${formData.phoneNumber}\n` +
        `🎂 DOB: ${formData.dateOfBirth}\n` +
        `🏠 Address: ${formData.houseNumber}, ${formData.homeAddress}\n` +
        `🔗 Wallet: ${address}\n` +
        `💰 Payment: $${CONFIG.CARD_REGISTRATION_FEE} USD (${pepuAmount.toLocaleString()} PEPU)\n` +
        `💵 PEPU Price: $${pepuPrice} USD\n` +
        `📋 TX Hash: ${txHash}\n` +
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

      console.log('✅ Card registration notification sent successfully');
    } catch (error) {
      console.error('❌ Telegram notification error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || 
        !formData.dateOfBirth || !formData.houseNumber || !formData.homeAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Fetch latest PEPU price and calculate amount
      const latestPepuAmount = await calculatePepuAmount(CONFIG.CARD_REGISTRATION_FEE);
      setPepuAmount(latestPepuAmount);
      
      toast({
        title: "Payment Required",
        description: `Please confirm payment of ${latestPepuAmount.toLocaleString()} PEPU ($${CONFIG.CARD_REGISTRATION_FEE} USD)`,
      });

      // Send PEPU transaction to treasury wallet
      sendTransaction({
        to: CONFIG.TREASURY_ADDRESS as `0x${string}`,
        value: parseEther(latestPepuAmount.toString()),
      });

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Handle transaction confirmation
  if (isConfirmed && hash) {
    (async () => {
      await sendTelegramNotification(hash);
      toast({
        title: "Registration Successful!",
        description: "Your card application has been submitted.",
      });
      setTimeout(() => navigate('/pending'), 2000);
    })();
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden selection:bg-green-600/30 selection:text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse motion-safe:animate-[pulse_4s_ease-in-out_infinite]" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 z-10 backdrop-blur-sm border-b border-green-500/10">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold text-green-500 tracking-tight flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Unchained Card
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-32 pb-12 relative z-10">
        <Card className="w-full max-w-3xl bg-zinc-950/90 backdrop-blur-xl border-green-500/20 p-8 md:p-12 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 ring-1 ring-transparent hover:ring-green-500/30">
          <div className="space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                Card Application
              </h1>
              <p className="text-gray-400">Fill in your details to apply for your Unchained Card</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-green-500 font-semibold">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500/60 h-12 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-green-500 font-semibold">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500/60 h-12 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-500 font-semibold">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500/60 h-12 transition-all"
                  required
                />
              </div>

              {/* Phone Code & Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneCode" className="text-green-500 font-semibold">Country Code</Label>
                  <select
                    id="phoneCode"
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleInputChange}
                    className="w-full h-12 bg-zinc-900/50 border border-zinc-800 text-white rounded-md px-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                    required
                  >
                    <option value="+1">+1 (US/CA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+234">+234 (NG)</option>
                    <option value="+86">+86 (CN)</option>
                    <option value="+81">+81 (JP)</option>
                    <option value="+49">+49 (DE)</option>
                    <option value="+33">+33 (FR)</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phoneNumber" className="text-green-500 font-semibold">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="1234567890"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500/60 h-12 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-green-500 font-semibold">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  placeholder="dd/mm/yyyy"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500/60 h-12 transition-all"
                  required
                />
              </div>

              {/* House Number & Home Address */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="houseNumber" className="text-green-500 font-semibold">House No.</Label>
                  <Input
                    id="houseNumber"
                    name="houseNumber"
                    placeholder="123"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500/60 h-12 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="homeAddress" className="text-green-500 font-semibold">Home Address</Label>
                  <Input
                    id="homeAddress"
                    name="homeAddress"
                    placeholder="Street Name, City, State"
                    value={formData.homeAddress}
                    onChange={handleInputChange}
                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500/60 h-12 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending || isConfirming || isSubmitting}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold text-lg shadow-lg shadow-green-500/20 hover:shadow-green-500/40 border border-green-400 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </Button>

              <div className="text-center space-y-2">
                {isLoadingPrice ? (
                  <p className="text-sm text-gray-500">Loading PEPU price...</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-400">
                      Registration fee: <span className="text-white font-semibold">${CONFIG.CARD_REGISTRATION_FEE} USD</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      ≈ <span className="text-green-500 font-semibold">{pepuAmount.toLocaleString()} PEPU</span>
                      {' '}(${pepuPrice.toFixed(6)} per PEPU)
                    </p>
                  </>
                )}
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
