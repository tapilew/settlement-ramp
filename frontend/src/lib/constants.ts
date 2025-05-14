// Fee percentage for PayPal to USDC bridge
export const BASE_BRIDGE_FEE_PERCENTAGE = 1.0; // 1%

// Transaction status options
export const TRANSACTION_STATUS = {
  IDLE: "idle",
  PROCESSING: "processing",
  SUCCESS: "success",
  ERROR: "error",
} as const;