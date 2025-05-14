import React from "react";

export default function HeroSection() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center">
      <div className="w-full text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-primary/90 leading-tight">
          Bridge <span className="text-primary">PayPal</span> to{" "}
          <span className="text-primary">USDC</span>
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground mb-8 font-medium">
          Secure, automated conversion from PayPal to USDC on Base.
          <br className="hidden md:inline" /> Fast, global, and verified by{" "}
          <span className="font-semibold text-primary">ChainSettle oracle</span>
          .
        </p>
      </div>
    </section>
  );
}
