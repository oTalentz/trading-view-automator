
import { MarketCondition } from "./enums";
import { calculateRSI } from "./indicators/rsi";
import { calculateMACD } from "./indicators/macd";
import { calculateBollingerBands } from "./indicators/bollingerBands";
import { calculateTrendStrength } from "./trendStrength";
import { calculateVolatility } from "./volatility";

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
  const volatility = calculateVolatility(prices);
  
  let score = 50; // Start with neutral score
  
  // Factor 1: Check if signal aligns with market condition with higher precision
  if (direction === 'CALL' && 
      (marketCondition === MarketCondition.TREND_UP || 
       marketCondition === MarketCondition.STRONG_TREND_UP)) {
    score += 20; // Increased from 15 for stronger alignment
  } else if (direction === 'PUT' && 
             (marketCondition === MarketCondition.TREND_DOWN || 
              marketCondition === MarketCondition.STRONG_TREND_DOWN)) {
    score += 20; // Increased from 15 for stronger alignment
  } else if (marketCondition === MarketCondition.VOLATILE) {
    score -= 15; // Increased penalty for volatile markets to reduce noise
  } else if (marketCondition === MarketCondition.SIDEWAYS && (rsi > 65 || rsi < 35)) {
    // In sideways markets, only take extreme RSI values
    score += 10;
  } else if (marketCondition === MarketCondition.SIDEWAYS) {
    score -= 10; // Reduce confidence in sideways markets without clear signals
  }
  
  // Factor 2: RSI confirmation with more nuanced ranges
  if (direction === 'CALL') {
    if (rsi > 50 && rsi < 70) {
      score += 10;
    } else if (rsi >= 30 && rsi <= 50) {
      // Potential reversal zone for CALL
      score += 5;
    } else if (rsi < 30) {
      // Oversold, potential strong reversal
      score += 15;
    } else if (rsi > 75) {
      // Extremely overbought, reduce confidence
      score -= 10;
    }
  } else if (direction === 'PUT') {
    if (rsi < 50 && rsi > 30) {
      score += 10;
    } else if (rsi >= 50 && rsi <= 70) {
      // Potential reversal zone for PUT
      score += 5;
    } else if (rsi > 70) {
      // Overbought, potential strong reversal
      score += 15;
    } else if (rsi < 25) {
      // Extremely oversold, reduce confidence
      score -= 10;
    }
  }
  
  // Factor 3: MACD confirmation with histogram strength
  if (direction === 'CALL') {
    if (histogram > 0 && macdLine > signalLine) {
      score += 10 + Math.min(Math.abs(histogram) * 20, 5); // Add strength factor
    } else if (histogram < 0 && histogram > -0.05 && macdLine > macdLine * 0.95) {
      // About to cross, potential setup
      score += 5;
    } else if (histogram < -0.1) {
      // Strong negative histogram, reduce confidence
      score -= 5;
    }
  } else if (direction === 'PUT') {
    if (histogram < 0 && macdLine < signalLine) {
      score += 10 + Math.min(Math.abs(histogram) * 20, 5); // Add strength factor
    } else if (histogram > 0 && histogram < 0.05 && macdLine < macdLine * 1.05) {
      // About to cross, potential setup
      score += 5;
    } else if (histogram > 0.1) {
      // Strong positive histogram, reduce confidence
      score -= 5;
    }
  }
  
  // Factor 4: Bollinger Bands position with increased weight
  if (direction === 'CALL') {
    if (currentPrice < bollingerBands.lower * 1.01) {
      score += 15; // Strong bounce potential from lower band
    } else if (currentPrice < bollingerBands.middle) {
      score += 8; // Potential bounce up from below the middle band
    } else if (currentPrice > bollingerBands.upper * 0.99) {
      score -= 15; // Reduce score if price is near upper band for CALL
    }
  } else if (direction === 'PUT') {
    if (currentPrice > bollingerBands.upper * 0.99) {
      score += 15; // Strong drop potential from upper band
    } else if (currentPrice > bollingerBands.middle) {
      score += 8; // Potential drop from above the middle band
    } else if (currentPrice < bollingerBands.lower * 1.01) {
      score -= 15; // Reduce score if price is near lower band for PUT
    }
  }
  
  // Factor 5: Trend strength adjustment with more weight
  score += (trendStrength - 50) / 4;
  
  // Factor 6: Volatility filter to reduce false signals
  if (volatility > 0.015) { // High volatility threshold
    const volatilityPenalty = Math.min(volatility * 400, 20);
    score -= volatilityPenalty; // Penalize high volatility
  } else if (volatility < 0.005) { // Low volatility, more predictable
    score += 5;
  }
  
  // Factor 7: Price position relative to recent prices
  const last5Prices = prices.slice(-5);
  const avgPrice = last5Prices.reduce((sum, p) => sum + p, 0) / 5;
  if (direction === 'CALL' && currentPrice < avgPrice * 0.995) {
    score += 5; // Price pulled back, good entry
  } else if (direction === 'PUT' && currentPrice > avgPrice * 1.005) {
    score += 5; // Price pushed up, good entry
  }
  
  // Ensure score is within 0-100 range with a more moderate cap
  return Math.min(Math.max(score, 25), 95); // Cap between 25-95 for realism
};
