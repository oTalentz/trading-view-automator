
// Generate simulated market data for testing (in real app, this would be actual market data)
export const generateSimulatedMarketData = (
  symbol: string, 
  periods: number = 100
): { prices: number[]; volume: number[] } => {
  // Start with a base price that varies by symbol
  const symbolHash = symbol.split('').reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);
  
  const basePrice = 100 + Math.abs(symbolHash % 900);
  const volatility = (Math.abs(symbolHash % 10) / 100) + 0.005;
  
  const prices = [];
  const volume = [];
  
  let currentPrice = basePrice;
  let trend = 0;
  
  // Generate price series with some realistic patterns
  for (let i = 0; i < periods; i++) {
    // Occasionally shift the trend
    if (i % 10 === 0) {
      trend = (Math.random() - 0.5) * 0.02;
    }
    
    // Add random noise plus trend
    const change = (Math.random() - 0.5) * volatility * currentPrice + (currentPrice * trend);
    currentPrice += change;
    
    // Ensure price is positive
    currentPrice = Math.max(currentPrice, 0.01);
    
    prices.push(currentPrice);
    
    // Generate corresponding volume
    const baseVolume = currentPrice * 100;
    const volumeNoise = (Math.random() + 0.5) * baseVolume;
    volume.push(volumeNoise);
  }
  
  return { prices, volume };
};
