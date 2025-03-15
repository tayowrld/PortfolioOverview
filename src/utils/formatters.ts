// Format number with commas for thousands separators
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Format price as USD with 2 decimal places
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Format crypto amount - showing exact decimal places for small numbers
export const formatCryptoAmount = (amount: number): string => {
  if (amount < 0.001) {
    return amount.toFixed(8);
  } else if (amount < 1) {
    return amount.toFixed(4);
  } else {
    return amount.toFixed(2);
  }
};

// Format percentage with + or - sign and 2 decimal places
export const formatPercentage = (percent: number): string => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

// Return CSS class based on positive/negative change
export const getChangeColorClass = (value: number): string => {
  return value > 0 ? 'positive-change' : value < 0 ? 'negative-change' : 'neutral-change';
}; 