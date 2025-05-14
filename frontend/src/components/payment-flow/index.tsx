import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Steps } from "@/components/payment-flow/steps";
import { AmountInput } from "@/components/payment-flow/amount-input";
import { PayPalConnect } from "@/components/payment-flow/paypal-connect";
import { WalletInput } from "@/components/payment-flow/wallet-input";
import { Confirmation } from "@/components/payment-flow/confirmation";

interface PaymentDetails {
  amount: string;
  walletAddress: string;
  email: string;
}

interface PaymentFlowProps {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  paymentDetails: PaymentDetails;
  setPaymentDetails: Dispatch<SetStateAction<PaymentDetails>>;
}

const PaymentFlow = ({
  currentStep,
  setCurrentStep,
  paymentDetails,
  setPaymentDetails,
}: PaymentFlowProps) => {
  const steps = [
    { number: 1, label: "Amount" },
    { number: 2, label: "PayPal" },
    { number: 3, label: "Wallet" },
    { number: 4, label: "Confirm" },
  ];

  const handleAmountChange = (amount: string) => {
    setPaymentDetails((prev) => ({ ...prev, amount }));
  };

  const handleWalletAddressChange = (walletAddress: string) => {
    setPaymentDetails((prev) => ({ ...prev, walletAddress }));
  };

  const handleEmailChange = (email: string) => {
    setPaymentDetails((prev) => ({ ...prev, email }));
  };

  return (
    <div className="flex justify-center w-full px-4 py-8 md:py-12">
      <Card className="w-full max-w-xl shadow-2xl border border-border/40 rounded-2xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Bridge PayPal to USDC
              </h2>
              <p className="text-muted-foreground">
                Secure and fast conversion on Base Network
              </p>
            </div>

            <Steps steps={steps} currentStep={currentStep} />

            <div className="mt-8 space-y-6">
              {currentStep === 1 && (
                <AmountInput
                  value={paymentDetails.amount}
                  onChange={handleAmountChange}
                  onNext={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <PayPalConnect
                  email={paymentDetails.email}
                  onEmailChange={handleEmailChange}
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 3 && (
                <WalletInput
                  value={paymentDetails.walletAddress}
                  onChange={handleWalletAddressChange}
                  onBack={() => setCurrentStep(2)}
                  onNext={() => setCurrentStep(4)}
                />
              )}

              {currentStep === 4 && (
                <Confirmation
                  paymentDetails={paymentDetails}
                  onBack={() => setCurrentStep(3)}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFlow;
