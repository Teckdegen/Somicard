import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Loader2 } from 'lucide-react';

const Pending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />

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
      <div className="flex-1 flex items-center justify-center p-4 pt-32 relative z-10">
        <Card className="w-full max-w-2xl bg-zinc-950/90 backdrop-blur-xl border-green-500/20 p-8 md:p-12">
          <div className="space-y-8 text-center">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-full flex items-center justify-center border border-green-500/30 animate-pulse">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
              </div>
              <div className="absolute inset-0 w-24 h-24 mx-auto bg-green-500/20 rounded-full blur-xl animate-pulse" />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-emerald-500">
                Card Being Created
              </h1>
              <p className="text-xl text-gray-400">
                Your Unchained Card is being processed
              </p>
            </div>

            {/* Status Steps */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg border border-green-500/20">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-white font-semibold">Application Received</p>
                  <p className="text-sm text-gray-400">Your registration has been submitted</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg border border-green-500/20">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-white font-semibold">Payment Confirmed</p>
                  <p className="text-sm text-gray-400">$30 USD payment received</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg border border-yellow-500/20">
                <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0 animate-pulse" />
                <div className="text-left">
                  <p className="text-white font-semibold">Card Creation in Progress</p>
                  <p className="text-sm text-gray-400">Your card is being generated</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 opacity-50">
                <div className="w-6 h-6 rounded-full border-2 border-zinc-700 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-gray-500 font-semibold">Card Ready</p>
                  <p className="text-sm text-gray-600">You'll be notified when ready</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded-lg">
              <p className="text-gray-300 leading-relaxed">
                <span className="text-green-500 font-semibold">⏱️ Estimated Time:</span> 24-48 hours
                <br />
                <span className="text-green-500 font-semibold">📧 Notification:</span> You'll receive an email when your card is ready
                <br />
                <span className="text-green-500 font-semibold">💬 Support:</span> Contact us on Telegram @teck_degen
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => navigate('/')}
              className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold border border-zinc-700 hover:border-green-500/50 transition-all duration-200"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Pending;
