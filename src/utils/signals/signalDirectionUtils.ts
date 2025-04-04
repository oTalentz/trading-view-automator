
import { MarketCondition } from '@/utils/technicalAnalysis';
import { MACDData } from '@/utils/technicalAnalysis';
import { calculateVolatility } from '@/utils/technical/volatility';
import { calculateBollingerBands } from '@/utils/technical/indicators/bollingerBands';

/**
 * Determines the optimal signal direction (CALL or PUT) based on enhanced technical analysis
 * with improved precision and reduced false signals
 */
export const determineSignalDirection = (
  marketCondition: MarketCondition,
  prices: number[],
  volume: number[],
  bbands: any,
  rsiValue: number,
  macdData: { macdLine: number; signalLine: number; histogram: number; previousHistogram?: number },
  trendStrengthValue: number
): 'CALL' | 'PUT' => {
  let bullishFactors = 0;
  let bearishFactors = 0;
  
  // Use more recent prices for better analysis
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2];
  const priceChange = (currentPrice - previousPrice) / previousPrice;
  
  // Calculate volatility for signal filtering
  const volatility = calculateVolatility(prices);
  
  // Skip signals during extremely high volatility
  if (volatility > 0.025 && marketCondition === MarketCondition.VOLATILE) {
    // Default to the prevailing trend direction in highly volatile markets
    return trendStrengthValue > 60 ? 'CALL' : 'PUT';
  }
  
  // Recalculate Bollinger Bands with multiple periods for confirmation
  const bbandsShort = calculateBollingerBands(prices, 14);
  const bbandsStandard = bbands;
  const bbandsLong = calculateBollingerBands(prices, 30);
  
  // Enhanced market condition analysis with higher weights
  if ([MarketCondition.STRONG_TREND_UP, MarketCondition.TREND_UP].includes(marketCondition)) {
    bullishFactors += marketCondition === MarketCondition.STRONG_TREND_UP ? 3 : 2;
  } else if ([MarketCondition.STRONG_TREND_DOWN, MarketCondition.TREND_DOWN].includes(marketCondition)) {
    bearishFactors += marketCondition === MarketCondition.STRONG_TREND_DOWN ? 3 : 2;
  }
  
  // Enhanced RSI analysis with dynamic thresholds
  if (rsiValue < 30) {
    bullishFactors += 2; // Stronger signal for oversold
  } else if (rsiValue < 40) {
    bullishFactors += 1; // Mild oversold
  } else if (rsiValue > 70) {
    bearishFactors += 2; // Stronger signal for overbought
  } else if (rsiValue > 60) {
    bearishFactors += 1; // Mild overbought
  } else if (rsiValue > 55) {
    bullishFactors += 0.5; // Bullish bias
  } else if (rsiValue < 45) {
    bearishFactors += 0.5; // Bearish bias
  }
  
  // Enhanced MACD analysis with histogram momentum
  if (macdData.histogram > 0) {
    if (macdData.previousHistogram !== undefined && macdData.histogram > macdData.previousHistogram) {
      bullishFactors += 1.5; // Increasing positive histogram - strong bullish
    } else {
      bullishFactors += 0.8; // Positive but not increasing
    }
  } else if (macdData.histogram < 0) {
    if (macdData.previousHistogram !== undefined && macdData.histogram < macdData.previousHistogram) {
      bearishFactors += 1.5; // Decreasing negative histogram - strong bearish
    } else {
      bearishFactors += 0.8; // Negative but not decreasing
    }
  }
  
  // Enhanced Bollinger Bands analysis with multi-timeframe confirmation
  if (currentPrice < bbandsShort.lower && currentPrice < bbandsStandard.lower) {
    bullishFactors += 2; // Strong oversold signal confirmed on multiple timeframes
  } else if (currentPrice < bbandsStandard.lower) {
    bullishFactors += 1; // Price below lower band (potential bounce)
  } else if (currentPrice > bbandsShort.upper && currentPrice > bbandsStandard.upper) {
    bearishFactors += 2; // Strong overbought signal confirmed on multiple timeframes
  } else if (currentPrice > bbandsStandard.upper) {
    bearishFactors += 1; // Price above upper band (potential fall)
  }
  
  // Enhanced volume analysis with more nuance
  if (volume.length >= 5) {
    const avgVolume = volume.slice(-5).reduce((sum, vol) => sum + vol, 0) / 5;
    const currentVolume = volume[volume.length - 1];
    const volumeRatio = currentVolume / avgVolume;
    
    if (currentPrice > previousPrice && volumeRatio > 1.3) {
      bullishFactors += 1.5; // Strong volume confirmation of upward move
    } else if (currentPrice < previousPrice && volumeRatio > 1.3) {
      bearishFactors += 1.5; // Strong volume confirmation of downward move
    } else if (currentPrice > previousPrice && volumeRatio > 1.1) {
      bullishFactors += 0.8; // Moderate volume confirmation of upward move
    } else if (currentPrice < previousPrice && volumeRatio > 1.1) {
      bearishFactors += 0.8; // Moderate volume confirmation of downward move
    }
  }
  
  // Enhanced trend strength analysis with more precision
  if (trendStrengthValue > 75) {
    if (marketCondition === MarketCondition.STRONG_TREND_UP || marketCondition === MarketCondition.TREND_UP) {
      bullishFactors += 2;
    } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || marketCondition === MarketCondition.TREND_DOWN) {
      bearishFactors += 2;
    }
  } else if (trendStrengthValue > 60) {
    if (marketCondition === MarketCondition.STRONG_TREND_UP || marketCondition === MarketCondition.TREND_UP) {
      bullishFactors += 1;
    } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || marketCondition === MarketCondition.TREND_DOWN) {
      bearishFactors += 1;
    }
  }
  
  // Price action analysis
  if (Math.abs(priceChange) > volatility * 2) {
    // Significant price move relative to volatility
    if (priceChange > 0) {
      // Large upward move might mean exhaustion (for new PUT signals)
      // or continuation (for existing CALL signals)
      if (rsiValue > 65 || currentPrice > bbandsStandard.upper) {
        bearishFactors += 1; // Potential exhaustion
      } else {
        bullishFactors += 0.5; // Potential continuation
      }
    } else {
      // Large downward move might mean exhaustion (for new CALL signals)
      // or continuation (for existing PUT signals)
      if (rsiValue < 35 || currentPrice < bbandsStandard.lower) {
        bullishFactors += 1; // Potential exhaustion
      } else {
        bearishFactors += 0.5; // Potential continuation
      }
    }
  }
  
  // Enhanced decision making with confidence margin
  const bullishConfidence = bullishFactors;
  const bearishConfidence = bearishFactors;
  
  // Require a minimum difference for more decisive signals
  if (Math.abs(bullishConfidence - bearishConfidence) < 1.0) {
    // No clear signal, rely on trend and momentum
    if (trendStrengthValue > 60 && marketCondition === MarketCondition.STRONG_TREND_UP) {
      return 'CALL';
    } else if (trendStrengthValue > 60 && marketCondition === MarketCondition.STRONG_TREND_DOWN) {
      return 'PUT';
    } else if (macdData.histogram > 0 && macdData.histogram > macdData.previousHistogram!) {
      return 'CALL';
    } else if (macdData.histogram < 0 && macdData.histogram < macdData.previousHistogram!) {
      return 'PUT';
    }
  }
  
  // Make final decision based on accumulated factors
  return bullishConfidence > bearishConfidence ? 'CALL' : 'PUT';
};
