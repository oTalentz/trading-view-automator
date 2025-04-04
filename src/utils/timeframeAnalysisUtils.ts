
import { 
  MarketCondition, 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  determineMarketCondition,
  calculateTrendStrength,
  generateSimulatedMarketData,
  calculateVolatility
} from '@/utils/technicalAnalysis';
import { TimeframeAnalysis } from '@/types/timeframeAnalysis';

// Enhanced function to analyze a timeframe with improved precision and less volatility
export const analyzeTimeframe = (symbol: string, timeframe: string, label: string): TimeframeAnalysis => {
  const { prices, volume } = generateSimulatedMarketData(
    symbol + "_" + timeframe, // Add timeframe to symbol for different data sets
    200 // Use more data points for better analysis
  );
  
  // Enhanced technical analysis for this timeframe
  const marketCondition = determineMarketCondition(prices, volume);
  const { value: trendStrengthValue } = calculateTrendStrength(prices, volume);
  const volatility = calculateVolatility(prices);
  
  // Apply smoothing to RSI for less noise
  const rsiValue = calculateRSI(prices);
  const smoothedRSI = calculateSmoothedRSI(prices);
  
  const macdData = calculateMACD(prices);
  const bbands = calculateBollingerBands(prices);
  
  // Determine direction with enhanced analysis to reduce volatility
  let direction: 'CALL' | 'PUT';
  
  // Use market condition as primary signal with additional confirmations
  if (marketCondition === MarketCondition.STRONG_TREND_UP || 
      marketCondition === MarketCondition.TREND_UP) {
    
    // Confirm uptrend with additional indicators
    if (smoothedRSI < 30) {
      direction = 'CALL'; // Oversold in uptrend - strong buy signal
    } else if (macdData.histogram > 0 && macdData.macdLine > macdData.signalLine) {
      direction = 'CALL'; // MACD confirmation of uptrend
    } else if (smoothedRSI > 70 && trendStrengthValue < 60) {
      direction = 'PUT'; // Overbought in weak uptrend - potential reversal
    } else {
      direction = 'CALL'; // Default to uptrend
    }
    
  } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || 
            marketCondition === MarketCondition.TREND_DOWN) {
    
    // Confirm downtrend with additional indicators
    if (smoothedRSI > 70) {
      direction = 'PUT'; // Overbought in downtrend - strong sell signal
    } else if (macdData.histogram < 0 && macdData.macdLine < macdData.signalLine) {
      direction = 'PUT'; // MACD confirmation of downtrend
    } else if (smoothedRSI < 30 && trendStrengthValue < 60) {
      direction = 'CALL'; // Oversold in weak downtrend - potential reversal
    } else {
      direction = 'PUT'; // Default to downtrend
    }
    
  } else {
    // For sideways or volatile markets, use more indicators for precision
    const currentPrice = prices[prices.length - 1];
    
    if (volatility > 0.02) {
      // In high volatility, use mean reversion strategy
      if (currentPrice < bbands.lower * 1.01 && smoothedRSI < 35) {
        direction = 'CALL'; // Strong oversold signal
      } else if (currentPrice > bbands.upper * 0.99 && smoothedRSI > 65) {
        direction = 'PUT'; // Strong overbought signal
      } else {
        // No clear signal in volatile market - use trend bias
        direction = trendStrengthValue > 55 ? 'CALL' : 'PUT';
      }
    } else {
      // In normal volatility sideways markets
      if (smoothedRSI < 30 && currentPrice < bbands.lower * 1.02) {
        direction = 'CALL'; // Confirmed oversold
      } else if (smoothedRSI > 70 && currentPrice > bbands.upper * 0.98) {
        direction = 'PUT'; // Confirmed overbought
      } else if (macdData.histogram > 0 && macdData.histogram > (macdData.previousHistogram || 0) * 1.1) {
        direction = 'CALL'; // Strong positive momentum
      } else if (macdData.histogram < 0 && macdData.histogram < (macdData.previousHistogram || 0) * 1.1) {
        direction = 'PUT'; // Strong negative momentum
      } else {
        // No clear signal - use longer term bias
        direction = trendStrengthValue > 50 ? 'CALL' : 'PUT';
      }
    }
  }
  
  // Calculate confidence based on multiple factors with noise reduction
  let confidence = 65; // Start with a moderate base confidence
  
  // Factor 1: Market condition alignment
  if ((marketCondition === MarketCondition.STRONG_TREND_UP && direction === 'CALL') ||
      (marketCondition === MarketCondition.STRONG_TREND_DOWN && direction === 'PUT')) {
    confidence += 15;
  } else if ((marketCondition === MarketCondition.TREND_UP && direction === 'CALL') ||
      (marketCondition === MarketCondition.TREND_DOWN && direction === 'PUT')) {
    confidence += 10;
  } else if (marketCondition === MarketCondition.VOLATILE) {
    confidence -= 10; // Reduce confidence in volatile markets
  } else if (marketCondition === MarketCondition.SIDEWAYS && direction !== getDefaultSidewaysDirection(smoothedRSI)) {
    confidence -= 5; // Slight penalty for signals against the RSI bias in sideways markets
  }
  
  // Factor 2: RSI extremes
  if ((direction === 'CALL' && smoothedRSI < 30) || 
      (direction === 'PUT' && smoothedRSI > 70)) {
    confidence += 10; // Strong reversal signal
  } else if ((direction === 'CALL' && smoothedRSI > 70) || 
             (direction === 'PUT' && smoothedRSI < 30)) {
    confidence -= 15; // Signal against RSI extreme
  }
  
  // Factor 3: MACD confirmation
  if ((direction === 'CALL' && macdData.histogram > 0 && macdData.macdLine > macdData.signalLine) || 
      (direction === 'PUT' && macdData.histogram < 0 && macdData.macdLine < macdData.signalLine)) {
    confidence += 10;
  }
  
  // Factor 4: Bollinger Bands
  const currentPrice = prices[prices.length - 1];
  if ((direction === 'CALL' && currentPrice < bbands.lower * 1.02) || 
      (direction === 'PUT' && currentPrice > bbands.upper * 0.98)) {
    confidence += 10;
  } else if ((direction === 'CALL' && currentPrice > bbands.upper * 0.98) || 
             (direction === 'PUT' && currentPrice < bbands.lower * 1.02)) {
    confidence -= 10;
  }
  
  // Factor 5: Trend strength with higher impact
  if (trendStrengthValue > 75) {
    if ((direction === 'CALL' && marketCondition === MarketCondition.STRONG_TREND_UP) || 
        (direction === 'PUT' && marketCondition === MarketCondition.STRONG_TREND_DOWN)) {
      confidence += 12;
    }
  } else if (trendStrengthValue < 40) {
    confidence -= 8; // Weak trend reduces confidence
  }
  
  // Factor 6: Volatility adjustment
  if (volatility > 0.015) {
    confidence -= Math.min(Math.round(volatility * 500), 15); // Up to -15 for high volatility
  } else if (volatility < 0.005) {
    confidence += 5; // Bonus for low volatility
  }
  
  // Ensure reasonable confidence range
  confidence = Math.min(Math.max(confidence, 55), 95);
  
  return {
    direction,
    confidence,
    strength: trendStrengthValue,
    timeframe,
    label,
    marketCondition
  };
};

// Helper function to determine default direction in sideways markets based on RSI
const getDefaultSidewaysDirection = (rsi: number): 'CALL' | 'PUT' => {
  if (rsi > 60) return 'PUT'; // Overbought bias
  if (rsi < 40) return 'CALL'; // Oversold bias
  return rsi >= 50 ? 'CALL' : 'PUT'; // Neutral with slight bias
};

// Calculate a smoothed RSI to reduce noise
const calculateSmoothedRSI = (prices: number[], period: number = 14, smoothing: number = 2): number => {
  if (prices.length < period + 5) return calculateRSI(prices, period);
  
  // Calculate RSI for multiple lookback periods
  const rsi1 = calculateRSI(prices, period);
  const rsi2 = calculateRSI(prices, period + 2);
  const rsi3 = calculateRSI(prices, period + 4);
  
  // Apply weighted smoothing
  const smoothedRSI = (rsi1 * 3 + rsi2 * 2 + rsi3 * 1) / 6;
  
  // Round to reduce noise
  return Math.round(smoothedRSI);
};
