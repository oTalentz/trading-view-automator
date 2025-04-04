
// Service for accessing candle data for backtesting and analysis
export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Get candle data for a specific symbol and timeframe
 * In a real system, this would fetch from an API or database
 * For now, we simulate the data
 */
export const getCandleData = (
  symbol: string,
  timeframe: string,
  lookback: number = 100
): Candle[] => {
  // Generate deterministic but different data for different symbols and timeframes
  const seed = stringToSeed(`${symbol}_${timeframe}`);
  const candles: Candle[] = [];
  const now = Date.now();
  
  // Base values that differ by symbol
  const basePrice = (seed % 1000) + 100; // Between 100 and 1100
  const volatility = (seed % 10) / 100 + 0.01; // Between 0.01 and 0.11
  
  let currentPrice = basePrice;
  
  // Generate candles
  for (let i = 0; i < lookback; i++) {
    // Convert timeframe to milliseconds
    const msPerCandle = timeframeToMilliseconds(timeframe);
    const timestamp = now - (lookback - i) * msPerCandle;
    
    // Generate price movement with some trend and mean reversion
    const trend = Math.sin(i / 20) * volatility * 0.5;
    const random = (Math.random() * 2 - 1) * volatility;
    const movementPercent = trend + random;
    
    const movement = currentPrice * movementPercent;
    const open = currentPrice;
    currentPrice = currentPrice + movement;
    
    // Calculate high, low based on open and close
    const highLowRange = currentPrice * volatility * 0.8;
    const high = Math.max(open, currentPrice) + (Math.random() * highLowRange);
    const low = Math.min(open, currentPrice) - (Math.random() * highLowRange);
    
    // Generate volume that correlates somewhat with price movement
    const volumeBase = 1000 + (seed % 5000);
    const volumeVariation = Math.abs(movement) / currentPrice * 1.5;
    const volume = volumeBase * (1 + volumeVariation);
    
    candles.push({
      timestamp,
      open,
      high,
      low,
      close: currentPrice,
      volume
    });
  }
  
  return candles;
};

/**
 * Convert timeframe string (e.g., "5m", "1h") to milliseconds
 */
function timeframeToMilliseconds(timeframe: string): number {
  const numericPart = parseInt(timeframe);
  
  if (timeframe.endsWith('m') || !isNaN(numericPart)) {
    return numericPart * 60 * 1000; // Minutes to ms
  } else if (timeframe.endsWith('h')) {
    return numericPart * 60 * 60 * 1000; // Hours to ms
  } else if (timeframe === 'D' || timeframe === 'd') {
    return 24 * 60 * 60 * 1000; // Day to ms
  }
  
  return 60 * 1000; // Default to 1 minute
}

/**
 * Convert a string to a deterministic numeric seed
 */
function stringToSeed(str: string): number {
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed = ((seed << 5) - seed) + str.charCodeAt(i);
    seed = seed & seed; // Convert to 32bit integer
  }
  return Math.abs(seed);
}
