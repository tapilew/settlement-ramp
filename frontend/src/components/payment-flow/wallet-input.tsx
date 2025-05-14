import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAccount } from "wagmi";
import { isAddress } from "viem";

// A helper for joining class names conditionally
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface WalletInputProps {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function WalletInput({
  value,
  onChange,
  onBack,
  onNext,
}: WalletInputProps) {
  const { address, isConnected } = useAccount();
  const [isResolvingENS, setIsResolvingENS] = useState(false);
  const [addressError, setAddressError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setAddressError("");
  };

  const handleUseConnectedWallet = () => {
    if (address) {
      onChange(address);
    }
  };

  const handleResolveENS = () => {
    if (!value.endsWith(".eth")) {
      setAddressError("This doesn't appear to be an ENS name (.eth)");
      return;
    }

    setIsResolvingENS(true);

    // Simulate ENS resolution
    setTimeout(() => {
      setIsResolvingENS(false);
      // For demonstration, we're generating a fake address
      const mockResolvedAddress = `0x${Array(40)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`;
      onChange(mockResolvedAddress);
    }, 1500);
  };

  const validateAddress = () => {
    if (!value) {
      setAddressError("Please enter a wallet address");
      return false;
    }

    if (!isAddress(value)) {
      setAddressError("Please enter a valid Ethereum address");
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateAddress()) {
      onNext();
    }
  };

  const isENSName = value.endsWith(".eth");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="wallet-address">Recipient Wallet Address</Label>
        <div className="relative">
          <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="wallet-address"
            value={value}
            onChange={handleInputChange}
            className="pl-9 font-mono text-sm"
            placeholder="0x... or yourname.eth"
          />
        </div>
        {addressError && (
          <p className="text-xs text-destructive">{addressError}</p>
        )}
      </div>

      <div className="flex gap-3">
        {isConnected && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleUseConnectedWallet}
          >
            Use Connected Wallet
          </Button>
        )}

        {isENSName && (
          <Button
            variant="outline"
            className={cn("flex-1", isResolvingENS && "opacity-60")}
            onClick={handleResolveENS}
            disabled={isResolvingENS}
          >
            {isResolvingENS ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Resolving...</span>
              </>
            ) : (
              <span>Resolve ENS</span>
            )}
          </Button>
        )}
      </div>

      <Button className="w-full" onClick={handleContinue}>
        <span>Continue</span>
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <div className="flex justify-center w-full">
        <Button variant="ghost" onClick={onBack} className="w-full">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Back</span>
        </Button>
      </div>

      <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
        <p className="mb-1 font-medium text-foreground">💡 Tip</p>
        <p>
          Make sure you enter a wallet address on the Base network. Sending to
          the wrong network may result in lost funds.
        </p>
      </div>
    </div>
  );
}
