import { useState } from "react";
import { ArrowRight, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatUSDInput, formatUSDDisplay } from "@/lib/formatters";
import { BASE_BRIDGE_FEE_PERCENTAGE } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function AmountInput({ value, onChange, onNext }: AmountInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, "");
    onChange(rawValue);
  };

  const numericValue = Number(value) || 0;
  const feePercentage = BASE_BRIDGE_FEE_PERCENTAGE;
  const feeAmount = numericValue * (feePercentage / 100);
  const receiveAmount = numericValue - feeAmount;

  const isValidAmount = Number(value) >= 10 && Number(value) <= 10000;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="amount" className="text-base">
          Enter Amount
        </Label>
        <div className="relative group">
          <DollarSign
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200",
              isFocused ? "text-primary" : "text-muted-foreground"
            )}
          />
          <Input
            id="amount"
            type="text"
            value={formatUSDInput(value)}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "pl-10 h-12 text-lg transition-shadow duration-200",
              isFocused ? "ring-2 ring-primary/20" : "hover:border-primary/50"
            )}
            placeholder="0.00"
          />
        </div>
        <p
          className={cn(
            "text-sm transition-colors duration-200",
            isValidAmount ? "text-muted-foreground" : "text-destructive"
          )}
        >
          Min: $10.00 - Max: $10,000.00
        </p>
      </div>

      <Card className="border-none bg-card/40">
        <CardContent className="space-y-4 p-6">
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">You pay</span>
              <span className="font-medium">
                {formatUSDDisplay(numericValue)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <span className="text-muted-foreground">Network fee</span>
                <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {feePercentage}%
                </span>
              </div>
              <span className="font-medium">{formatUSDDisplay(feeAmount)}</span>
            </div>

            <div className="pt-3 border-t flex justify-between items-center">
              <span className="font-medium">You receive</span>
              <div className="text-right">
                <div className="font-bold text-primary text-lg">
                  {formatUSDDisplay(receiveAmount)}
                </div>
                <div className="text-xs text-muted-foreground">
                  USDC on Base
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button
          className={cn("w-full", !isValidAmount && "opacity-60")}
          onClick={onNext}
          disabled={!isValidAmount}
        >
          <span>Continue</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {Number(value) > 0 && !isValidAmount && (
          <p className="text-sm text-destructive text-center animate-pulse">
            Please enter an amount between $10.00 and $10,000.00
          </p>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
