
import { MarketCondition } from '@/utils/technicalAnalysis';
import { MARKET_CONDITION_STRATEGIES, ADVANCED_STRATEGIES } from '@/constants/tradingStrategies';
import { findSupportResistanceLevels, calculateTrendStrength } from '@/utils/technicalAnalysis';
import { analyzeHistoricalPerformance } from './strategyHistoricalAnalyzer';

/**
 * Selects the optimal trading strategy based on current market conditions and indicators
 * with enhanced historical performance analysis
 */
export const selectStrategy = (
  marketCondition: MarketCondition, 
  prices: number[], 
  volume: number[],
  rsiValue: number, 
  macdData: any,
  bbands: any,
  volatility: number
) => {
  // Get compatible strategies for current market condition
  const compatibleStrategies = MARKET_CONDITION_STRATEGIES[marketCondition] || 
    MARKET_CONDITION_STRATEGIES.SIDEWAYS; // Default to sideways if condition not found
  
  // Calculate scores for each compatible strategy with enhanced algorithm
  const strategyScores = compatibleStrategies.map(strategyKey => {
    const strategy = ADVANCED_STRATEGIES[strategyKey as keyof typeof ADVANCED_STRATEGIES];
    let score = 0;
    
    // RSI-based scoring with improved logic
    if (strategyKey === "RSI_DIVERGENCE") {
      if (rsiValue < 30 || rsiValue > 70) {
        // Extreme RSI values get higher score
        score += Math.abs(rsiValue - 50) * 3; 
      } else {
        // Medium RSI values get lower score
        score += Math.abs(rsiValue - 50) * 1.5;
      }
    }
    
    // MACD-based scoring with trend confirmation
    if (strategyKey === "MACD_CROSSOVER") {
      score += Math.abs(macdData.histogram) * 15;
      
      // Add bonus for increasing histogram momentum
      if (macdData.previousHistogram && 
          Math.abs(macdData.histogram) > Math.abs(macdData.previousHistogram)) {
        score += 10;
      }
      
      // Add bonus for MACD line and signal line alignment
      const macdSignalDiff = macdData.macdLine - macdData.signalLine;
      if (Math.abs(macdSignalDiff) < 0.0005) { // Very close to crossing
        score += 15;
      }
    }
    
    // Bollinger Bands scoring with volatility context
    if (strategyKey === "BOLLINGER_BREAKOUT") {
      const currentPrice = prices[prices.length - 1];
      const bandWidth = bbands.upper - bbands.lower;
      const normalizedBandWidth = bandWidth / bbands.middle;
      
      // Bollinger band width scoring - higher score for narrower bands before breakout
      if (normalizedBandWidth < 0.03) {
        score += 25; // Tight bands - potential breakout setup
      } else if (normalizedBandWidth < 0.05) {
        score += 15; // Medium bands
      }
      
      // Price relative to bands
      const distanceToUpper = Math.abs(currentPrice - bbands.upper);
      const distanceToLower = Math.abs(currentPrice - bbands.lower);
      const distanceToMiddle = Math.abs(currentPrice - bbands.middle);
      
      // Higher score when price is near bands
      if (distanceToUpper < volatility || distanceToLower < volatility) {
        score += 50;
      } else if (distanceToMiddle < volatility / 2) {
        score += 20;
      }
    }
    
    // Support/Resistance scoring with improved price reaction detection
    if (strategyKey === "SUPPORT_RESISTANCE") {
      const supportResistance = findSupportResistanceLevels(prices);
      const currentPrice = prices[prices.length - 1];
      const previousPrice = prices[prices.length - 2] || currentPrice;
      
      const distanceToSupport = Math.abs(currentPrice - supportResistance.support);
      const distanceToResistance = Math.abs(currentPrice - supportResistance.resistance);
      
      // Higher score when price is near support or resistance
      if (distanceToSupport < volatility || distanceToResistance < volatility) {
        score += 50;
        
        // Bonus for price bouncing off support/resistance
        if (distanceToSupport < volatility && currentPrice > previousPrice) {
          score += 15; // Price bouncing up from support
        } else if (distanceToResistance < volatility && currentPrice < previousPrice) {
          score += 15; // Price bouncing down from resistance
        }
      }
      
      // Detect multiple tests of support/resistance for higher probability
      const recentPrices = prices.slice(-10);
      let supportTests = 0;
      let resistanceTests = 0;
      
      recentPrices.forEach(price => {
        if (Math.abs(price - supportResistance.support) < volatility) supportTests++;
        if (Math.abs(price - supportResistance.resistance) < volatility) resistanceTests++;
      });
      
      if (supportTests > 1 || resistanceTests > 1) {
        score += 15; // Multiple tests increase reliability
      }
    }
    
    // Trend following scoring with momentum confirmation
    if (strategyKey === "TREND_FOLLOWING") {
      const { value: trendStrength, direction } = calculateTrendStrength(prices, volume);
      
      // Base score from trend strength
      score += trendStrength / 2;
      
      // Analyze price momentum to confirm trend
      const recentPrices = prices.slice(-5);
      let consistentDirection = true;
      
      for (let i = 1; i < recentPrices.length; i++) {
        if (direction === 'bullish' && recentPrices[i] < recentPrices[i-1]) {
          consistentDirection = false;
          break;
        } else if (direction === 'bearish' && recentPrices[i] > recentPrices[i-1]) {
          consistentDirection = false;
          break;
        }
      }
      
      if (consistentDirection) {
        score += 20; // Bonus for consistent price direction
      }
      
      // Volume confirmation for trend
      const recentVolume = volume.slice(-5);
      let volumeIncreasing = true;
      
      for (let i = 1; i < recentVolume.length; i++) {
        if (recentVolume[i] < recentVolume[i-1] * 0.8) {
          volumeIncreasing = false;
          break;
        }
      }
      
      if (volumeIncreasing) {
        score += 15; // Bonus for increasing volume
      }
    }
    
    // Fibonacci retracement enhanced scoring
    if (strategyKey === "FIBONACCI_RETRACEMENT") {
      // Find local extremes
      const windowSize = 10;
      let localHigh = -Infinity;
      let localLow = Infinity;
      
      for (let i = prices.length - windowSize; i < prices.length; i++) {
        if (i >= 0) {
          localHigh = Math.max(localHigh, prices[i]);
          localLow = Math.min(localLow, prices[i]);
        }
      }
      
      const range = localHigh - localLow;
      const currentPrice = prices[prices.length - 1];
      
      // Check if price is near key Fibonacci levels
      const fibLevels = [0.236, 0.382, 0.5, 0.618, 0.786];
      let nearFibLevel = false;
      
      for (const level of fibLevels) {
        const fibPrice = localLow + (range * level);
        if (Math.abs(currentPrice - fibPrice) / currentPrice < 0.01) {
          nearFibLevel = true;
          break;
        }
      }
      
      if (nearFibLevel) {
        score += 40;
      }
    }
    
    // Ichimoku Cloud enhanced scoring
    if (strategyKey === "ICHIMOKU_CLOUD") {
      // Simplified Ichimoku calculation
      const tenkanPeriod = 9;
      const kijunPeriod = 26;
      
      // Calculate Tenkan-sen (Conversion Line)
      let highestHigh = -Infinity;
      let lowestLow = Infinity;
      
      for (let i = prices.length - tenkanPeriod; i < prices.length; i++) {
        if (i >= 0) {
          highestHigh = Math.max(highestHigh, prices[i]);
          lowestLow = Math.min(lowestLow, prices[i]);
        }
      }
      
      const tenkanSen = (highestHigh + lowestLow) / 2;
      
      // Calculate Kijun-sen (Base Line)
      highestHigh = -Infinity;
      lowestLow = Infinity;
      
      for (let i = prices.length - kijunPeriod; i < prices.length; i++) {
        if (i >= 0) {
          highestHigh = Math.max(highestHigh, prices[i]);
          lowestLow = Math.min(lowestLow, prices[i]);
        }
      }
      
      const kijunSen = (highestHigh + lowestLow) / 2;
      
      // Check Tenkan/Kijun Cross
      const currentPrice = prices[prices.length - 1];
      
      if (Math.abs(tenkanSen - kijunSen) / kijunSen < 0.005) {
        score += 30; // Near crossing
      }
      
      // Price relative to Tenkan/Kijun
      if ((tenkanSen > kijunSen && currentPrice > tenkanSen) || 
          (tenkanSen < kijunSen && currentPrice < tenkanSen)) {
        score += 25; // Strong trend confirmation
      }
    }
    
    // Analyze historical performance for additional scoring
    const historicalPerformance = analyzeHistoricalPerformance(strategyKey, prices, volume);
    score += historicalPerformance.performanceBonus;
    
    // Add base score for all strategies
    score += 50;
    
    return { 
      key: strategyKey, 
      score, 
      strategy: {
        ...strategy,
        historicalPerformance: historicalPerformance
      }
    };
  });
  
  // Select the highest scoring strategy
  strategyScores.sort((a, b) => b.score - a.score);
  return strategyScores[0].strategy;
};
