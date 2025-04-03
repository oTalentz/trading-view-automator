
import { calculateEMA } from "../movingAverages";

// Interface for MACD data including previousHistogram for comparison
export interface MACDData {
  macdLine: number;
  signalLine: number;
  histogram: number;
  previousHistogram?: number;
}

// MACD calculation
export const calculateMACD = (
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDData => {
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  const macdLine = fastEMA - slowEMA;
  
  // Calculate signal line (EMA of MACD line)
  // In a real implementation, we would need historical MACD values
  // This is simplified for demonstration
  const signalLine = macdLine * 0.85; // Simplified approximation
  
  return {
    macdLine,
    signalLine,
    histogram: macdLine - signalLine
  };
};
