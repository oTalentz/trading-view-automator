
import { MarketCondition } from "./enums";
import { calculateRSI } from "./indicators/rsi";
import { calculateMACD } from "./indicators/macd";
import { calculateBollingerBands } from "./indicators/bollingerBands";

// Score a signal's quality based on multiple factors (0-100)
export const calculateSignalQuality = (
  prices: number[],
  direction: 'CALL' | 'PUT',
  marketCondition: MarketCondition,
  trendStrength: number
): number => {
  if (prices.length < 50) return 60; // Default moderate confidence
  
  const rsi = calculateRSI(prices);
  const { macdLine, signalLine, histogram } = calculateMACD(prices);
  const bollingerBands = calculateBollingerBands(prices);
  const currentPrice = prices[prices.length - 1];
  
  let score = 50; // Start with neutral score
  
  // Factor 1: Check if signal aligns with market condition
  if (direction === 'CALL' && 
      (marketCondition === MarketCondition.TREND_UP || 
       marketCondition === MarketCondition.STRONG_TREND_UP)) {
    score += 15;
  } else if (direction === 'PUT' && 
             (marketCondition === MarketCondition.TREND_DOWN || 
              marketCondition === MarketCondition.STRONG_TREND_DOWN)) {
    score += 15;
  } else if (marketCondition === MarketCondition.VOLATILE) {
    score -= 10; // Reduce confidence in volatile markets
  }
  
  // Factor 2: RSI confirmation
  if (direction === 'CALL' && rsi > 50 && rsi < 70) {
    score += 10;
  } else if (direction === 'PUT' && rsi < 50 && rsi > 30) {
    score += 10;
  }
  
  // Factor 3: MACD confirmation
  if (direction === 'CALL' && histogram > 0 && macdLine > signalLine) {
    score += 10;
  } else if (direction === 'PUT' && histogram < 0 && macdLine < signalLine) {
    score += 10;
  }
  
  // Factor 4: Bollinger Bands position
  if (direction === 'CALL' && currentPrice < bollingerBands.middle) {
    score += 5; // Potential bounce up from below the middle band
  } else if (direction === 'PUT' && currentPrice > bollingerBands.middle) {
    score += 5; // Potential drop from above the middle band
  }
  
  // Factor 5: Trend strength adjustment
  score += (trendStrength - 50) / 5;
  
  // Ensure score is within 0-100 range
  return Math.min(Math.max(score, 30), 97); // Cap between 30-97 for realism
};
