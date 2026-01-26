// Currency configuration for the expense tracker
// Change these values to switch to a different currency

export const CURRENCY_CONFIG = {
  symbol: '₹',           // Rupee symbol
  code: 'INR',           // ISO currency code
  name: 'Indian Rupee',
  decimals: 2,           // Number of decimal places
  position: 'before'     // 'before' or 'after' the amount
} as const;

// Alternative: For Dollar, use this configuration:
// export const CURRENCY_CONFIG = {
//   symbol: '$',
//   code: 'USD',
//   name: 'US Dollar',
//   decimals: 2,
//   position: 'before'
// } as const;

// Format currency with proper symbol placement
export function formatCurrency(amount: number): string {
  const formattedAmount = amount.toFixed(CURRENCY_CONFIG.decimals);
  
  if (CURRENCY_CONFIG.position === 'before') {
    return `${CURRENCY_CONFIG.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount}${CURRENCY_CONFIG.symbol}`;
  }
}

// Format currency for Indian locale with commas (e.g., ₹1,23,456.78)
export function formatCurrencyIndian(amount: number): string {
  const parts = amount.toFixed(CURRENCY_CONFIG.decimals).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Indian numbering system: last 3 digits, then groups of 2
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  const formattedAmount = `${formattedInteger}.${decimalPart}`;
  
  if (CURRENCY_CONFIG.position === 'before') {
    return `${CURRENCY_CONFIG.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount}${CURRENCY_CONFIG.symbol}`;
  }
}

// Use this if you want Indian number formatting, otherwise use formatCurrency
export const formatAmount = CURRENCY_CONFIG.code === 'INR' 
  ? formatCurrencyIndian 
  : formatCurrency;