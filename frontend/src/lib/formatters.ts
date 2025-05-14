/**
 * Formats a number or string as USD input (removes non-numeric characters)
 */
export function formatUSDInput(value: string): string {
  if (!value) return "";
  
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, "");
  
  // Split by decimal point
  const parts = numericValue.split(".");
  
  // Format the integer part with commas
  let integerPart = parts[0];
  
  if (integerPart.length > 3) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Add decimal part if it exists
  if (parts.length > 1) {
    // Limit to 2 decimal places
    const decimalPart = parts[1].slice(0, 2);
    return `${integerPart}.${decimalPart}`;
  }
  
  return integerPart;
}

/**
 * Formats a number as USD currency for display
 */
export function formatUSDDisplay(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}