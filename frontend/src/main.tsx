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
import { ThemeProvider } from "./components/theme-provider";

import "./index.css";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" disableTransitionOnChange>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}
