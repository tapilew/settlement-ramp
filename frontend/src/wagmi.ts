import { createConfig, http } from "wagmi";
import { base, mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

// Get the WalletConnect project ID from environment variables
const projectId = import.meta.env.VITE_WC_PROJECT_ID;

if (!projectId) {
  console.warn(
    "Missing VITE_WC_PROJECT_ID environment variable. WalletConnect will not work properly.",
  );
}

// Configure the injected connector (MetaMask)
const metamaskConnector = injected({
  target: "metaMask",
});

export const config = createConfig({
  chains: [mainnet, sepolia, base],
  connectors: [
    metamaskConnector,
    coinbaseWallet({
      appName: "Settlement Ramp",
    }),
    // Only add WalletConnect if we have a project ID
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
