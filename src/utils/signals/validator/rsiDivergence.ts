
/**
 * Verifies if there is divergence between price and RSI
 */
export const checkRsiDivergence = (
  prices: number[], 
  rsiValue: number, 
  direction: 'CALL' | 'PUT'
): boolean => {
  if (prices.length < 10) return false;
  
  const recentPrices = prices.slice(-10);
  const priceHigh = Math.max(...recentPrices);
  const priceLow = Math.min(...recentPrices);
  const currentPrice = prices[prices.length - 1];
  
  // Divergência altista: preço faz mínimas mais baixas, mas RSI não
  if (direction === 'CALL' && 
      currentPrice <= priceLow * 1.005 && 
      rsiValue > 30 && rsiValue <= 45) {
    return true;
  }
  
  // Divergência baixista: preço faz máximas mais altas, mas RSI não
  if (direction === 'PUT' && 
      currentPrice >= priceHigh * 0.995 && 
      rsiValue < 70 && rsiValue >= 55) {
    return true;
  }
  
  return false;
};
