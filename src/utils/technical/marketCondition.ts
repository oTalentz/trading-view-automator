
import { MarketCondition } from "./enums";
import { calculateMA } from "./movingAverages";
import { calculateRSI } from "./indicators/rsi";
import { calculateVolatility } from "./volatility";

// Determine market condition based on multiple indicators
export const determineMarketCondition = (
  prices: number[],
  volume: number[] = []
): MarketCondition => {
  if (prices.length < 50) return MarketCondition.UNKNOWN;
  
  const shortMA = calculateMA(prices, 10);
  const longMA = calculateMA(prices, 50);
  const rsi = calculateRSI(prices);
  const volatility = calculateVolatility(prices);
  const averagePrice = calculateMA(prices, 20);
  const volatilityRatio = volatility / averagePrice;
  
  // Check for strong trends
  if (shortMA > longMA * 1.05 && rsi > 70) {
    return MarketCondition.STRONG_TREND_UP;
  }
  if (shortMA < longMA * 0.95 && rsi < 30) {
    return MarketCondition.STRONG_TREND_DOWN;
  }
  
  // Check for moderate trends
  if (shortMA > longMA && rsi > 55) {
    return MarketCondition.TREND_UP;
  }
  if (shortMA < longMA && rsi < 45) {
    return MarketCondition.TREND_DOWN;
  }
  
  // Check for high volatility
  if (volatilityRatio > 0.02) {
    return MarketCondition.VOLATILE;
  }
  
  // Default to sideways
  return MarketCondition.SIDEWAYS;
};
