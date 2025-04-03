
// Moving averages calculations

// Moving average calculation
export const calculateMA = (prices: number[], period: number): number => {
  if (prices.length < period) return 0;
  const recentPrices = prices.slice(-period);
  return recentPrices.reduce((sum, price) => sum + price, 0) / period;
};

// Exponential moving average
export const calculateEMA = (prices: number[], period: number): number => {
  if (prices.length < period) return 0;
  
  const k = 2 / (period + 1); // Smoothing factor
  
  // First EMA is SMA
  let ema = calculateMA(prices.slice(0, period), period);
  
  // Calculate EMA for remaining prices
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] * k) + (ema * (1 - k));
  }
  
  return ema;
};
