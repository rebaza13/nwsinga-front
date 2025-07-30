/**
 * Utility functions for formatting data
 */

/**
 * Format a number as currency with commas
 * @param price - The price number to format
 * @param currency - The currency symbol (default: '$')
 * @returns Formatted price string (e.g., "$50,000")
 */
export function formatPrice(price: number | string, currency: string = '$'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return `${currency}0`;
  }
  
  // Format number with commas
  const formattedNumber = numPrice.toLocaleString('en-US');
  
  return `${currency}${formattedNumber}`;
}

/**
 * Format a number with commas (without currency symbol)
 * @param num - The number to format
 * @returns Formatted number string (e.g., "50,000")
 */
export function formatNumber(num: number | string): string {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numValue)) {
    return '0';
  }
  
  return numValue.toLocaleString('en-US');
}