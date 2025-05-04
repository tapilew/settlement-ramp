import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              View your connected wallet details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge
                  variant={
                    account.status === "connected" ? "default" : "secondary"
                  }
                >
                  {account.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Addresses:</span>
                <span className="font-mono text-sm">
                  {account.addresses?.join(", ") || "Not connected"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Chain ID:</span>
                <span className="font-mono text-sm">
                  {account.chainId || "Not connected"}
                </span>
              </div>
            </div>

            {account.status === "connected" && (
              <Button variant="destructive" onClick={() => disconnect()}>
                Disconnect Wallet
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Choose a wallet provider to connect
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  variant="outline"
                  className="flex-1 min-w-[200px]"
                >
                  {connector.name}
                </Button>
              ))}
            </div>

            {status && (
              <div className="text-sm text-muted-foreground">
                Status: {status}
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive">
                Error: {error.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
