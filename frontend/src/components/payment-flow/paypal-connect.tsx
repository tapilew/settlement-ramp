import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/components/wagmi-provider";
import { PayPalLogo } from "@/components/ui/paypal-logo";
import { z } from "zod";

// A helper for joining class names conditionally
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface PayPalConnectProps {
  email: string;
  onEmailChange: (email: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function PayPalConnect({
  email,
  onEmailChange,
  onBack,
  onNext,
}: PayPalConnectProps) {
  const { isPayPalConnected, setIsPayPalConnected } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const emailSchema = z.string().email("Please enter a valid email address");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEmailChange(e.target.value);
    setEmailError("");
  };

  const handleConnect = () => {
    try {
      emailSchema.parse(email);
      setEmailError("");
      setIsConnecting(true);

      // Simulate PayPal connection
      setTimeout(() => {
        setIsConnecting(false);
        setIsPayPalConnected(true);
      }, 1500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
    }
  };

  const handleDisconnect = () => {
    setIsPayPalConnected(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-2">
        <PayPalLogo className="h-8 w-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Connect your PayPal account to continue
        </p>
      </div>

      {!isPayPalConnected ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">PayPal Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="pl-9"
                placeholder="name@example.com"
              />
            </div>
            {emailError && (
              <p className="text-xs text-destructive">{emailError}</p>
            )}
          </div>

          <Button
            className={cn("w-full", isConnecting && "opacity-60")}
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <span>Connect PayPal</span>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">{email}</p>
              <p className="text-xs text-muted-foreground">
                PayPal account connected
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>

          <Button className="w-full" onClick={onNext}>
            <span>Continue</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="flex justify-center w-full">
        <Button variant="ghost" onClick={onBack} className="w-full">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Back</span>
        </Button>
      </div>
    </div>
  );
}
