import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="relative">
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-border/50 via-border to-border/50"
        aria-hidden="true"
      />

      <ol className="relative z-10 flex justify-between">
        {steps.map((step) => (
          <li key={step.number} className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ring-4 ring-background transition-all duration-200",
                step.number < currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : step.number === currentStep
                    ? "border-primary bg-background text-primary animate-pulse"
                    : "border-muted bg-background text-muted-foreground"
              )}
            >
              {step.number < currentStep ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                step.number
              )}
            </div>

            <span
              className={cn(
                "mt-3 text-sm font-medium transition-colors duration-200",
                step.number <= currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
