
// Support and Resistance detection (simplified)
export const findSupportResistanceLevels = (prices: number[], periods: number = 20) => {
  if (prices.length < periods) {
    return { support: 0, resistance: 0 };
  }
  
  const recentPrices = prices.slice(-periods);
  const min = Math.min(...recentPrices);
  const max = Math.max(...recentPrices);
  
  // Find the most recent swing low as support
  let support = min;
  for (let i = recentPrices.length - 2; i >= 0; i--) {
    if (recentPrices[i] < recentPrices[i+1] && recentPrices[i] < recentPrices[i-1]) {
      support = recentPrices[i];
      break;
    }
  }
  
  // Find the most recent swing high as resistance
  let resistance = max;
  for (let i = recentPrices.length - 2; i >= 0; i--) {
    if (recentPrices[i] > recentPrices[i+1] && recentPrices[i] > recentPrices[i-1]) {
      resistance = recentPrices[i];
      break;
    }
  }
  
  return { support, resistance };
};
