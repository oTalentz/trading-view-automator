
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
    score += 20; // Strong alignment with uptrend
  } else if (direction === 'PUT' && 
             (marketCondition === MarketCondition.TREND_DOWN || 
              marketCondition === MarketCondition.STRONG_TREND_DOWN)) {
    score += 20; // Strong alignment with downtrend
  } else if (marketCondition === MarketCondition.VOLATILE) {
    score -= 18; // Higher penalty for volatile markets
  } else if (marketCondition === MarketCondition.SIDEWAYS && (rsi > 68 || rsi < 32)) {
    // In sideways markets, only take extreme RSI values
    score += 12;
  } else if (marketCondition === MarketCondition.SIDEWAYS) {
    score -= 12; // Reduce confidence in sideways markets without clear signals
  }
  
  // Factor 2: RSI confirmation with more nuanced ranges
  if (direction === 'CALL') {
    if (rsi > 50 && rsi < 68) {
      score += 12; // Bullish RSI zone
    } else if (rsi >= 32 && rsi <= 50) {
      // Potential reversal zone for CALL
      score += 6;
    } else if (rsi < 32) {
      // Oversold, potential strong reversal
      score += 17;
    } else if (rsi > 78) {
      // Extremely overbought, reduce confidence
      score -= 12;
    }
  } else if (direction === 'PUT') {
    if (rsi < 50 && rsi > 32) {
      score += 12; // Bearish RSI zone
    } else if (rsi >= 50 && rsi <= 68) {
      // Potential reversal zone for PUT
      score += 6;
    } else if (rsi > 68) {
      // Overbought, potential strong reversal
      score += 17;
    } else if (rsi < 22) {
      // Extremely oversold, reduce confidence
      score -= 12;
    }
  }
  
  // Factor 3: MACD confirmation with histogram strength
  if (direction === 'CALL') {
    if (histogram > 0 && macdLine > signalLine) {
      score += 12 + Math.min(Math.abs(histogram) * 25, 6); // Add strength factor
    } else if (histogram < 0 && histogram > -0.04 && macdLine > macdLine * 0.97) {
      // About to cross, potential setup
      score += 7;
    } else if (histogram < -0.08) {
      // Strong negative histogram, reduce confidence
      score -= 8;
    }
  } else if (direction === 'PUT') {
    if (histogram < 0 && macdLine < signalLine) {
      score += 12 + Math.min(Math.abs(histogram) * 25, 6); // Add strength factor
    } else if (histogram > 0 && histogram < 0.04 && macdLine < macdLine * 1.03) {
      // About to cross, potential setup
      score += 7;
    } else if (histogram > 0.08) {
      // Strong positive histogram, reduce confidence
      score -= 8;
    }
  }
  
  // Factor 4: Bollinger Bands position with more precise thresholds
  if (direction === 'CALL') {
    if (currentPrice < bollingerBands.lower * 1.005) {
      score += 18; // Strong bounce potential from lower band
    } else if (currentPrice < bollingerBands.middle * 0.985) {
      score += 10; // Potential bounce up from below the middle band
    } else if (currentPrice > bollingerBands.upper * 0.995) {
      score -= 18; // Reduce score if price is near upper band for CALL
    }
  } else if (direction === 'PUT') {
    if (currentPrice > bollingerBands.upper * 0.995) {
      score += 18; // Strong drop potential from upper band
    } else if (currentPrice > bollingerBands.middle * 1.015) {
      score += 10; // Potential drop from above the middle band
    } else if (currentPrice < bollingerBands.lower * 1.005) {
      score -= 18; // Reduce score if price is near lower band for PUT
    }
  }
  
  // Factor 5: Trend strength adjustment with more weight for strong trends
  if (trendStrength > 75) {
    score += (trendStrength - 75) / 2.5; // Extra boost for very strong trends
  } else {
    score += (trendStrength - 50) / 4; // Regular adjustment
  }
  
  // Factor 6: Volatility filter with more precise thresholds
  if (volatility > 0.014) { // High volatility threshold
    const volatilityPenalty = Math.min(volatility * 450, 22);
    score -= volatilityPenalty; // Penalize high volatility more aggressively
  } else if (volatility < 0.004) { // Low volatility, more predictable
    score += 7; // Reward low volatility more
  }
  
  // Factor 7: Price position relative to recent prices with shorter lookback
  const last3Prices = prices.slice(-3);
  const avgPrice = last3Prices.reduce((sum, p) => sum + p, 0) / 3;
  if (direction === 'CALL' && currentPrice < avgPrice * 0.997) {
    score += 7; // Price pulled back, good entry
  } else if (direction === 'PUT' && currentPrice > avgPrice * 1.003) {
    score += 7; // Price pushed up, good entry
  }
  
  // Ensure score is within 0-100 range
  return Math.min(Math.max(score, 25), 95);
};
