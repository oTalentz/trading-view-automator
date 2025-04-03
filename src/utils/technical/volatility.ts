
// Volatility-related calculations

// Standard deviation calculation for volatility
export const calculateVolatility = (prices: number[], period: number = 14): number => {
  if (prices.length < period) return 0;
  
  const recentPrices = prices.slice(-period);
  const mean = recentPrices.reduce((sum, price) => sum + price, 0) / period;
  
  const squaredDifferences = recentPrices.map(price => Math.pow(price - mean, 2));
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / period;
  
  return Math.sqrt(variance); // Standard deviation
};
