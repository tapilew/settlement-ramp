// Buffer polyfill for browser
// biome-ignore lint: Use browser polyfill for Buffer, not node:buffer
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
import { config } from "./wagmi.ts";

import "./index.css";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}
