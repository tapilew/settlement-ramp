import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useWallet } from "@/components/wagmi-provider";
import Header from "@/components/ui/header";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import PaymentFlow from "@/components/payment-flow";
import TransactionStatus from "@/components/transaction-status";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

// Define the types for PaymentDetails and AppContent props
interface PaymentDetails {
  amount: string;
  walletAddress: string;
  email: string;
}

interface AppContentProps {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  paymentDetails: PaymentDetails;
  setPaymentDetails: Dispatch<SetStateAction<PaymentDetails>>;
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    walletAddress: "",
    email: "",
  });

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen w-full bg-background flex flex-col">
        <div className="flex items-center justify-between p-4">
          <Header />
          <ThemeToggle />
        </div>
        <main className="flex-1">
          <div className="container max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
            <div className="w-full flex flex-col gap-16">
              <div className="w-full flex flex-col gap-16">
                <HeroSection />
                <FeaturesSection />
              </div>
              <div className="w-full max-w-xl mx-auto">
                <AppContent
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  paymentDetails={paymentDetails}
                  setPaymentDetails={setPaymentDetails}
                />
              </div>
            </div>
          </div>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

// Separate component to use the useWallet hook
function AppContent({
  currentStep,
  setCurrentStep,
  paymentDetails,
  setPaymentDetails,
}: AppContentProps) {
  const { transactionStatus } = useWallet();

  return (
    <>
      {transactionStatus === "idle" ? (
        <PaymentFlow
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          paymentDetails={paymentDetails}
          setPaymentDetails={setPaymentDetails}
        />
      ) : (
        <TransactionStatus />
      )}
    </>
  );
}

export default App;
