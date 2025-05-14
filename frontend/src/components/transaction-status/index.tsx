import { useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/components/wagmi-provider";
import TransactionReceipt from "@/components/transaction-status/transaction-receipt";

// Helper for conditional class names
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const TransactionStatus = () => {
  const { transactionStatus, setTransactionStatus, transactionHash } =
    useWallet();

  useEffect(() => {
    if (transactionStatus === "processing") {
      // Simulate transaction completion after 5 seconds
      const timer = setTimeout(() => {
        // 90% chance of success, 10% chance of error
        const isSuccess = Math.random() > 0.1;
        setTransactionStatus(isSuccess ? "success" : "error");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [transactionStatus, setTransactionStatus]);

  const resetTransaction = () => {
    setTransactionStatus("idle");
  };

  const handleViewOnExplorer = () => {
    if (transactionHash) {
      window.open(
        `https://basescan.org/tx/${transactionHash}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <Card className="w-full max-w-xl shadow-lg border-none">
      <CardContent className="p-6">
        {transactionStatus === "processing" && (
          <div className="flex flex-col items-center text-center py-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold mb-2">Transaction In Progress</h2>
            <p className="text-muted-foreground mb-6">
              Please wait while we process your payment. This may take a few
              moments.
            </p>

            <div className="w-full max-w-md mb-4">
              <Progress value={45} className="h-2" />
            </div>

            <div className="w-full max-w-md space-y-2">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>Payment authorized</span>
              </div>
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
                <span>Converting USD to USDC</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <div className="h-5 w-5 rounded-full border-2 border-muted mr-2" />
                <span>Sending USDC to your wallet</span>
              </div>
            </div>

            {transactionHash && (
              <div className="mt-6 text-xs text-muted-foreground">
                <span>Transaction Hash: </span>
                <a
                  href={`https://basescan.org/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:text-primary"
                >
                  {`${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}`}
                </a>
              </div>
            )}
          </div>
        )}

        {transactionStatus === "success" && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="relative mb-4">
              <CheckCircle2 className="h-16 w-16 text-primary" />
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
            </div>

            <h2 className="text-xl font-bold mb-2">Transaction Complete!</h2>
            <p className="text-muted-foreground mb-8">
              Your payment has been processed successfully. USDC has been sent
              to your wallet.
            </p>

            <TransactionReceipt />

            <div className="w-full flex flex-col gap-3 mt-6">
              <Button className="w-full" onClick={resetTransaction}>
                <RefreshCw className="mr-2 h-5 w-5" />
                <span>New Transaction</span>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewOnExplorer}
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                <span>View on Explorer</span>
              </Button>
            </div>
          </div>
        )}

        {transactionStatus === "error" && (
          <div className="flex flex-col items-center text-center py-6">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">Transaction Failed</h2>
            <p className="text-muted-foreground mb-4">
              We encountered an error while processing your transaction. Don't
              worry, no funds have been transferred.
            </p>

            <div className="w-full bg-destructive/10 p-4 rounded-lg text-sm mb-6">
              <p className="font-medium text-destructive">Error Details:</p>
              <p className="text-muted-foreground">
                The transaction failed due to network congestion. Please try
                again in a few minutes.
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <Button className="w-full" onClick={resetTransaction}>
                <RefreshCw className="mr-2 h-5 w-5" />
                <span>Try Again</span>
              </Button>
              <Button variant="outline" className="w-full">
                <span>Contact Support</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionStatus;
