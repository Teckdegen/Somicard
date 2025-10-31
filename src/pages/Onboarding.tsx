import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
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
        <div className="w-full max-w-2xl text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
              <span className="text-sm font-mono text-green-500">CARD REGISTRATION</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 leading-tight">
              Get Your Card
            </h1>
            <p className="text-xl text-gray-400 font-light">
              Choose your path to get started
            </p>
          </div>

          {/* Options Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 max-w-3xl mx-auto">
            {/* New User Card */}
            <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50 hover:border-green-500/50 hover:bg-zinc-900/80 transition-all duration-300 p-8 group relative overflow-hidden cursor-pointer"
              onClick={() => navigate('/signup')}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                    New to Cards
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Apply for a new Unchained Card and start spending your PEPU globally
                  </p>
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 border border-green-400 transition-all duration-200">
                  Apply Now
                </Button>
              </div>
            </Card>

            {/* Existing User Card */}
            <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50 hover:border-green-500/50 hover:bg-zinc-900/80 transition-all duration-300 p-8 group relative overflow-hidden cursor-pointer"
              onClick={() => navigate('/pending')}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform duration-300">
                  <LogIn className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                    Already Applied
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Check the status of your card application
                  </p>
                </div>
                <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold border border-zinc-700 hover:border-green-500/50 transition-all duration-200">
                  Check Status
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
