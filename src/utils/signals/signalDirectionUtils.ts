
import { MarketCondition } from '@/utils/technicalAnalysis';
import { MACDData } from '@/utils/technicalAnalysis';

/**
 * Determines the optimal signal direction (CALL or PUT) based on comprehensive technical analysis
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
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2];
  
  // Market condition analysis
  if ([MarketCondition.STRONG_TREND_UP, MarketCondition.TREND_UP].includes(marketCondition)) {
    bullishFactors += 2;
  } else if ([MarketCondition.STRONG_TREND_DOWN, MarketCondition.TREND_DOWN].includes(marketCondition)) {
    bearishFactors += 2;
  }
  
  // RSI analysis
  if (rsiValue < 30) {
    bullishFactors += 1; // Oversold condition
  } else if (rsiValue > 70) {
    bearishFactors += 1; // Overbought condition
  } else if (rsiValue > 50) {
    bullishFactors += 0.5; // Bullish bias
  } else {
    bearishFactors += 0.5; // Bearish bias
  }
  
  // MACD analysis - safely check if previousHistogram exists
  if (macdData.histogram > 0 && macdData.previousHistogram !== undefined && macdData.histogram > macdData.previousHistogram) {
    bullishFactors += 1; // Increasing positive histogram
  } else if (macdData.histogram < 0 && macdData.previousHistogram !== undefined && macdData.histogram < macdData.previousHistogram) {
    bearishFactors += 1; // Decreasing negative histogram
  }
  
  // Bollinger Bands analysis
  if (currentPrice < bbands.lower) {
    bullishFactors += 1; // Price below lower band (potential bounce)
  } else if (currentPrice > bbands.upper) {
    bearishFactors += 1; // Price above upper band (potential fall)
  }
  
  // Volume analysis
  const avgVolume = volume.slice(-5).reduce((sum, vol) => sum + vol, 0) / 5;
  if (currentPrice > previousPrice && volume[volume.length - 1] > avgVolume) {
    bullishFactors += 0.5; // Rising price with above average volume
  } else if (currentPrice < previousPrice && volume[volume.length - 1] > avgVolume) {
    bearishFactors += 0.5; // Falling price with above average volume
  }
  
  // Trend strength analysis
  if (trendStrengthValue > 70) {
    if (marketCondition === MarketCondition.STRONG_TREND_UP || marketCondition === MarketCondition.TREND_UP) {
      bullishFactors += 1.5;
    } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || marketCondition === MarketCondition.TREND_DOWN) {
      bearishFactors += 1.5;
    }
  }
  
  // Make final decision based on accumulated factors
  return bullishFactors > bearishFactors ? 'CALL' : 'PUT';
};
