import { createContext, useContext, useState } from "react";

// Create a context for wallet-related state
type WalletContextType = {
  isPayPalConnected: boolean;
  setIsPayPalConnected: (connected: boolean) => void;
  transactionStatus: "idle" | "processing" | "success" | "error";
  setTransactionStatus: (
    status: "idle" | "processing" | "success" | "error"
  ) => void;
  transactionHash: string | null;
  setTransactionHash: (hash: string | null) => void;
};

const WalletContext = createContext<WalletContextType>({
  isPayPalConnected: false,
  setIsPayPalConnected: () => {},
  transactionStatus: "idle",
  setTransactionStatus: () => {},
  transactionHash: null,
  setTransactionHash: () => {},
});

export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isPayPalConnected, setIsPayPalConnected] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  return (
    <WalletContext.Provider
      value={{
        isPayPalConnected,
        setIsPayPalConnected,
        transactionStatus,
        setTransactionStatus,
        transactionHash,
        setTransactionHash,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
