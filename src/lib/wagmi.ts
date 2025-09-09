import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { defineChain } from 'viem';

// Pepe Unchained V2 chain configuration
export const pepuChain = defineChain({
  id: 11155111,
  name: 'Pepe Unchained V2',
  network: 'pepu',
  nativeCurrency: {
    decimals: 18,
    name: 'PEPU',
    symbol: 'PEPU',
  },
  rpcUrls: {
    default: { http: ['https://sepolia.drpc.org'] },
    public: { http: ['https://sepolia.drpc.org'] },
  },
  blockExplorers: {
    default: { name: 'PEPU Scan', url: 'https://pepuscan.com/' },
  },
});

export const config = getDefaultConfig({
  appName: 'PEPUNS X PENK DEBIT CARDS',
  projectId: 'your-project-id', // Replace with your actual WalletConnect project ID
  chains: [pepuChain],
  transports: {
    [pepuChain.id]: http(),
  },
});
