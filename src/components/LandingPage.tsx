import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card } from './ui/card';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg p-8 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Somi Cards
              <br />
              <span className="text-foreground">DEBIT CARDS</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Premium blockchain-powered debit cards
            </p>
          </div>
          
          <div className="pt-4">
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
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg px-6 py-3 transition-colors duration-200"
                          >
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium rounded-lg px-6 py-3 transition-colors duration-200"
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div className="space-y-2">
                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="w-full bg-card border border-border hover:bg-accent/50 text-foreground font-medium rounded-lg px-6 py-3 transition-colors duration-200"
                          >
                            {account.displayName}
                            {account.displayBalance ? ` (${account.displayBalance})` : ''}
                          </button>
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
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
          
          <div className="pt-4">
            <p className="text-xs text-muted-foreground">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
