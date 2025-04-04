
import { MarketCondition } from "./enums";
import { calculateMA, calculateEMA } from "./movingAverages";
import { calculateRSI } from "./indicators/rsi";
import { calculateVolatility } from "./volatility";
import { calculateMACD } from "./indicators/macd";

// Determine market condition based on multiple indicators with enhanced accuracy
export const determineMarketCondition = (
  prices: number[],
  volume: number[] = []
): MarketCondition => {
  if (prices.length < 50) return MarketCondition.UNKNOWN;
  
  // Calculate multiple timeframe moving averages for better trend detection
  const shortMA = calculateMA(prices, 8);
  const mediumMA = calculateMA(prices, 21);
  const longMA = calculateMA(prices, 50);
  const veryLongMA = calculateMA(prices, 100);
  
  // Calculate EMAs for smoother signals
  const ema9 = calculateEMA(prices, 9);
  const ema21 = calculateEMA(prices, 21);
  
  // Technical indicators
  const rsi = calculateRSI(prices);
  const volatility = calculateVolatility(prices);
  const macd = calculateMACD(prices);
  const averagePrice = calculateMA(prices, 20);
  const volatilityRatio = volatility / averagePrice;
  
  // Current price
  const currentPrice = prices[prices.length - 1];
  
  // Advanced trend analysis using multiple confirmations
  const shortTrendUp = shortMA > mediumMA;
  const mediumTrendUp = mediumMA > longMA;
  const longTrendUp = longMA > veryLongMA;
  
  const shortTrendDown = shortMA < mediumMA;
  const mediumTrendDown = mediumMA < longMA;
  const longTrendDown = longMA < veryLongMA;
  
  // MACD analysis
  const macdPositive = macd.histogram > 0;
  const macdNegative = macd.histogram < 0;
  const macdCrossUp = macd.macdLine > macd.signalLine && macd.histogram > 0;
  const macdCrossDown = macd.macdLine < macd.signalLine && macd.histogram < 0;
  
  // Enhanced EMA analysis
  const emaUptrend = ema9 > ema21;
  const emaDowntrend = ema9 < ema21;
  
  // Volume analysis (if available)
  let volumeIncreasing = false;
  if (volume.length > 5) {
    const recentVolume = volume.slice(-5);
    const avgVolume = recentVolume.reduce((sum, vol) => sum + vol, 0) / 5;
    volumeIncreasing = volume[volume.length - 1] > avgVolume * 1.2;
  }
  
  // Check for strong uptrends with multiple confirmations
  if ((shortTrendUp && mediumTrendUp && rsi > 60) || 
      (shortTrendUp && macdCrossUp && rsi > 55) ||
      (emaUptrend && macdPositive && rsi > 60 && volumeIncreasing)) {
    return MarketCondition.STRONG_TREND_UP;
  }
  
  // Check for strong downtrends with multiple confirmations
  if ((shortTrendDown && mediumTrendDown && rsi < 40) || 
      (shortTrendDown && macdCrossDown && rsi < 45) ||
      (emaDowntrend && macdNegative && rsi < 40 && volumeIncreasing)) {
    return MarketCondition.STRONG_TREND_DOWN;
  }
  
  // Check for moderate uptrends
  if ((shortTrendUp && (rsi > 50 || macdPositive)) || 
      (emaUptrend && currentPrice > mediumMA)) {
    return MarketCondition.TREND_UP;
  }
  
  // Check for moderate downtrends
  if ((shortTrendDown && (rsi < 50 || macdNegative)) || 
      (emaDowntrend && currentPrice < mediumMA)) {
    return MarketCondition.TREND_DOWN;
  }
  
  // Check for high volatility - reduce volatile market detection threshold
  if (volatilityRatio > 0.018) {
    return MarketCondition.VOLATILE;
  }
  
  // Price is within small range of EMAs - sideways market
  const priceNearEMAs = 
    Math.abs(currentPrice - ema21) / ema21 < 0.005 && 
    Math.abs(rsi - 50) < 10;
    
  if (priceNearEMAs || (Math.abs(shortMA - mediumMA) / mediumMA < 0.005)) {
    return MarketCondition.SIDEWAYS;
  }
  
  // Default to sideways if no clear pattern
  return MarketCondition.SIDEWAYS;
};
