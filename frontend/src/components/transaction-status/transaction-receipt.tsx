import { DownloadIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatUSDDisplay } from "@/lib/formatters";

const TransactionReceipt = () => {
  const mockTransactionData = {
    id: `TX-20250517-${Math.floor(Math.random() * 1000000)}`,
    date: new Date().toLocaleString(),
    amount: 250,
    fee: 2.5,
    received: 247.5,
    wallet: "0x1234...5678",
    email: "user@example.com",
    status: "Completed",
  };

  return (
    <Card className="w-full p-4 border bg-muted/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Transaction Receipt</h3>
        <Button variant="ghost" size="sm">
          <DownloadIcon className="h-4 w-4" />
          <span className="text-xs">Download</span>
        </Button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transaction ID</span>
          <span className="font-mono">{mockTransactionData.id}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Date & Time</span>
          <span>{mockTransactionData.date}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className="text-primary font-medium">
            {mockTransactionData.status}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="text-muted-foreground">From PayPal</span>
          <span>{mockTransactionData.email}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">To Wallet</span>
          <span className="font-mono">{mockTransactionData.wallet}</span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span>{formatUSDDisplay(mockTransactionData.amount)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Fee</span>
          <span>{formatUSDDisplay(mockTransactionData.fee)}</span>
        </div>

        <div className="flex justify-between font-medium">
          <span>Total Received (USDC)</span>
          <span>{formatUSDDisplay(mockTransactionData.received)}</span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionReceipt;
