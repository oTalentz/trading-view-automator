
// Relative Strength Index calculation

// Relative Strength Index
export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length <= period) return 50; // Default neutral value
  
  let gains = 0;
  let losses = 0;
  
  // Calculate initial gains and losses
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change; // Convert to positive value
    }
  }
  
  // Initialize average gain and loss
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // Calculate subsequent values
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    
    if (change >= 0) {
      avgGain = ((avgGain * (period - 1)) + change) / period;
      avgLoss = ((avgLoss * (period - 1))) / period;
    } else {
      avgGain = ((avgGain * (period - 1))) / period;
      avgLoss = ((avgLoss * (period - 1)) - change) / period;
    }
  }
  
  if (avgLoss === 0) return 100; // Prevent division by zero
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};
