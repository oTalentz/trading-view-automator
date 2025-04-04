
// Enhanced Relative Strength Index calculation

// Relative Strength Index with improved accuracy
export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length <= period) return 50; // Default neutral value
  
  // Use more recent prices for better accuracy
  const recentPrices = prices.slice(-period * 2);
  
  let gains = 0;
  let losses = 0;
  
  // Calculate initial gains and losses
  for (let i = 1; i <= period; i++) {
    const change = recentPrices[i] - recentPrices[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change; // Convert to positive value
    }
  }
  
  // Initialize average gain and loss
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // Wilder's smoothing method for subsequent values
  for (let i = period + 1; i < recentPrices.length; i++) {
    const change = recentPrices[i] - recentPrices[i - 1];
    
    if (change >= 0) {
      avgGain = ((avgGain * (period - 1)) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = ((avgLoss * (period - 1)) - change) / period;
    }
  }
  
  if (avgLoss === 0) return 100; // Prevent division by zero
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  // Add noise filtering: round to nearest 0.5 to reduce small fluctuations
  return Math.round(rsi * 2) / 2;
};

// Calculate RSI with custom smoothing factor
export const calculateSmoothedRSI = (prices: number[], period: number = 14, smoothing: number = 3): number => {
  if (prices.length <= period) return 50;
  
  // Calculate multiple RSIs with different periods
  const baseRSI = calculateRSI(prices, period);
  const shorterRSI = calculateRSI(prices, Math.max(period - 3, 5));
  const longerRSI = calculateRSI(prices, period + 3);
  
  // Apply weighted average for smoothing
  const smoothedRSI = (
    (baseRSI * smoothing) + 
    (shorterRSI * 1) + 
    (longerRSI * 1)
  ) / (smoothing + 2);
  
  return Math.round(smoothedRSI * 2) / 2;
};
