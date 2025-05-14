import { useState } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/components/wagmi-provider";
import { formatUSDDisplay } from "@/lib/formatters";
import { BASE_BRIDGE_FEE_PERCENTAGE } from "@/lib/constants";

// A helper for joining class names conditionally
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface PaymentDetails {
  amount: string;
  walletAddress: string;
  email: string;
}

interface ConfirmationProps {
  paymentDetails: PaymentDetails;
  onBack: () => void;
}

export function Confirmation({ paymentDetails, onBack }: ConfirmationProps) {
  const { toast } = useToast();
  const { setTransactionStatus, setTransactionHash } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const { amount, walletAddress, email } = paymentDetails;
  const numericAmount = Number(amount) || 0;
  const feePercentage = BASE_BRIDGE_FEE_PERCENTAGE;
  const feeAmount = numericAmount * (feePercentage / 100);
  const receiveAmount = numericAmount - feeAmount;

  const handleSubmit = () => {
    setIsProcessing(true);

    // Simulate transaction processing
    setTimeout(() => {
      // Generate mock transaction hash
      const mockTxHash = `0x${Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`;

      setTransactionStatus("processing");
      setTransactionHash(mockTxHash);

      toast({
        title: "Transaction submitted",
        description: "Your transaction is now being processed",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center mb-2">
        <h3 className="text-lg font-medium">Confirm Transaction</h3>
        <p className="text-sm text-muted-foreground">
          Review details before proceeding
        </p>
      </div>

      <Card className="p-4 bg-muted/30">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">From PayPal</span>
            <span className="font-medium">{email}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">To Wallet</span>
            <span className="font-mono text-xs">{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="font-medium">
              {formatUSDDisplay(numericAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Fee ({feePercentage}%)
            </span>
            <span className="font-medium">{formatUSDDisplay(feeAmount)}</span>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-medium">You receive (USDC)</span>
            <span className="font-bold text-primary">
              {formatUSDDisplay(receiveAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Network</span>
            <span className="text-sm font-medium">Base</span>
          </div>
        </div>
      </Card>

      <Button
        className={cn("w-full", isProcessing && "opacity-60")}
        onClick={handleSubmit}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Check className="mr-2 h-5 w-5" />
            <span>Confirm and Pay</span>
          </>
        )}
      </Button>

      {!isProcessing && (
        <div className="flex justify-center w-full">
          <Button variant="ghost" onClick={onBack} className="w-full">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back</span>
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center">
        By confirming, you agree to our{" "}
        <a href="/terms" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
