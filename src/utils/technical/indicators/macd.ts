
import { calculateEMA } from "../movingAverages";

// Interface for MACD data including previousHistogram for comparison
export interface MACDData {
  macdLine: number;
  signalLine: number;
  histogram: number;
  previousHistogram?: number;
}

// Enhanced MACD calculation with noise reduction
export const calculateMACD = (
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDData => {
  if (prices.length < Math.max(fastPeriod, slowPeriod) + signalPeriod) {
    // Not enough data for accurate calculation
    return {
      macdLine: 0,
      signalLine: 0,
      histogram: 0
    };
  }
  
  // Calculate fast and slow EMAs
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  const macdLine = fastEMA - slowEMA;
  
  // Calculate MACD line for previous periods to build signal line history
  const macdLineHistory: number[] = [];
  for (let i = 0; i < signalPeriod; i++) {
    const pastPrices = prices.slice(0, prices.length - i);
    if (pastPrices.length >= Math.max(fastPeriod, slowPeriod)) {
      const pastFastEMA = calculateEMA(pastPrices, fastPeriod);
      const pastSlowEMA = calculateEMA(pastPrices, slowPeriod);
      macdLineHistory.unshift(pastFastEMA - pastSlowEMA);
    } else {
      macdLineHistory.unshift(macdLine); // Fallback
    }
  }
  
  // Calculate signal line as EMA of MACD line history
  const signalLine = macdLineHistory.reduce((sum, value) => sum + value, 0) / macdLineHistory.length;
  
  // Calculate histogram
  const histogram = macdLine - signalLine;
  
  // Calculate previous histogram if we have enough data
  let previousHistogram: number | undefined = undefined;
  if (prices.length > Math.max(fastPeriod, slowPeriod) + 1) {
    const previousPrices = prices.slice(0, -1);
    const prevFastEMA = calculateEMA(previousPrices, fastPeriod);
    const prevSlowEMA = calculateEMA(previousPrices, slowPeriod);
    const prevMacdLine = prevFastEMA - prevSlowEMA;
    
    // Simple approximation of previous signal line
    const prevSignalLine = (signalLine * signalPeriod - macdLine + prevMacdLine) / (signalPeriod - 1);
    previousHistogram = prevMacdLine - prevSignalLine;
  }
  
  // Apply noise filter: round to reduce small fluctuations
  return {
    macdLine: Math.round(macdLine * 10000) / 10000,
    signalLine: Math.round(signalLine * 10000) / 10000,
    histogram: Math.round(histogram * 10000) / 10000,
    previousHistogram: previousHistogram !== undefined ? 
      Math.round(previousHistogram * 10000) / 10000 : undefined
  };
};
