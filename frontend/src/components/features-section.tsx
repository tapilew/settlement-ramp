import { ShieldCheck, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure",
    description: "Verified by ChainSettle oracle",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Zap,
    title: "Fast",
    description: "Automated USDC minting",
    color:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    icon: Globe,
    title: "Global",
    description: "Available in LATAM",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-card rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-border transition-transform hover:-translate-y-1 hover:shadow-xl group"
          >
            <div
              className={`mb-4 rounded-full p-3 ${f.color} flex items-center justify-center`}
            >
              <f.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              {f.title}
            </h3>
            <p className="text-muted-foreground text-base font-medium">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
