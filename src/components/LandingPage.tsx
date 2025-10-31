import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card } from './ui/card';
import { Link2, Zap, CreditCard } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden selection:bg-green-600/30 selection:text-white">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse motion-safe:animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000 motion-safe:animate-[pulse_5s_ease-in-out_infinite]" />
      
      {/* Header with Logo and Connect Button */}
      <header className="absolute top-0 left-0 right-0 p-6 z-10 backdrop-blur-sm border-b border-green-500/10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-500 tracking-tight flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Unchained Card
          </h1>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus || authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-semibold rounded-lg px-6 py-2.5 transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 border border-green-400 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60"
                        >
                          <span className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity" />
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg px-4 py-2 transition-all duration-300 border border-red-500/30 hover:-translate-y-0.5"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="flex space-x-2">
                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-medium rounded-lg px-4 py-2 transition-all duration-300 hover:-translate-y-0.5"
                        >
                          {account.displayName}
                          {account.displayBalance ? ` (${account.displayBalance})` : ''}
                        </button>
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-medium rounded-lg px-4 py-2 transition-all duration-300 hover:-translate-y-0.5"
                        >
                          {chain.name}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-32 relative z-10">
        <div className="w-full max-w-5xl text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
              <span className="text-sm font-mono text-green-500">BLOCKCHAIN POWERED</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 leading-tight drop-shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-colors">
              Unchained Card
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide">
              Fund with <span className="text-green-500 font-semibold">PEPU</span>. Spend Anywhere.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-mono">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>LIVE ON MAINNET</span>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
            {/* Connect Wallet Card */}
            <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50 hover:border-green-500/50 hover:bg-zinc-900/80 transition-all duration-300 p-8 group relative overflow-hidden hover:shadow-xl hover:shadow-green-500/10 ring-1 ring-transparent hover:ring-green-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Link2 className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Connect Wallet
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Link your Pepu wallet in seconds
                </p>
              </div>
            </Card>

            {/* Instant Approval Card */}
            <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50 hover:border-green-500/50 hover:bg-zinc-900/80 transition-all duration-300 p-8 group relative overflow-hidden hover:shadow-xl hover:shadow-green-500/10 ring-1 ring-transparent hover:ring-green-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Zap className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Instant Approval
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Get your virtual card immediately
                </p>
              </div>
            </Card>

            {/* Spend Globally Card */}
            <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50 hover:border-green-500/50 hover:bg-zinc-900/80 transition-all duration-300 p-8 group relative overflow-hidden hover:shadow-xl hover:shadow-green-500/10 ring-1 ring-transparent hover:ring-green-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <CreditCard className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Spend Globally
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Use anywhere Visa is accepted
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;