import { Button } from "@/components/ui/button";
import { NetworkStatus } from "@/components/ui/network-status";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { injected } from "wagmi/connectors";

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [hasError, setHasError] = useState(false);

  const handleConnect = async () => {
    try {
      setHasError(false);
      await connect({ connector: injected({ target: "metaMask" }) });
    } catch (err) {
      console.error("Connection error:", err);
      setHasError(true);
    }
  };

  return (
    <header className="border-b">
      <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-foreground">Settlement Ramp</span>
          <NetworkStatus />
        </div>

        {isConnected ? (
          <Button variant="outline" onClick={() => disconnect()}>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={handleConnect}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        )}

        {error || hasError ? (
          <div className="absolute top-20 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm">
            Failed to connect. Please make sure MetaMask is installed and
            unlocked.
          </div>
        ) : null}
      </div>
    </header>
  );
}
