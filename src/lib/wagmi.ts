import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { defineChain } from 'viem';

// Pepe Unchained V2 chain configuration
export const pepuChain = defineChain({
  id: 5031,
  name: 'Somnia Network',
  network: 'Somi',
  nativeCurrency: {
    decimals: 18,
    name: 'PEPU',
    symbol: 'PEPU',
  },
  rpcUrls: {
    default: { http: ['https://api.infra.mainnet.somnia.network/'] },
    public: { http: ['https://api.infra.mainnet.somnia.network/'] },
  },
  blockExplorers: {
    default: { name: 'PEPU Scan', url: 'https://explorer.somnia.network' },
  },
});

export const config = getDefaultConfig({
  appName: 'SOMI CARDS',
  projectId: 'your-project-id', // Replace with your actual WalletConnect project ID
  chains: [pepuChain],
  transports: {
    [pepuChain.id]: http(),
  },
});
