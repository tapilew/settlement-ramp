import { useState } from "react";
import Header from "@/components/ui/header";
import PaymentFlow from "@/components/payment-flow";
import TransactionStatus from "@/components/transaction-status";
import { useWallet } from "@/components/wagmi-provider";

const SettlementRamp = () => {
  const { transactionStatus } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    walletAddress: "",
    email: "",
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center mb-2 text-primary">
            PayPal to USDC Bridge
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-xl">
            Convert your PayPal balance to USDC on Base network with low fees and
            fast settlement
          </p>

          {transactionStatus === "idle" || transactionStatus === "processing" ? (
            <PaymentFlow
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              paymentDetails={paymentDetails}
              setPaymentDetails={setPaymentDetails}
            />
          ) : (
            <TransactionStatus />
          )}
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Settlement Ramp. Powered by Circle USDC
          on Base.
        </div>
      </footer>
    </div>
  );
};

export default SettlementRamp;