
import { 
  MarketCondition, 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  findSupportResistanceLevels,
  determineMarketCondition,
  calculateTrendStrength,
  generateSimulatedMarketData,
  calculateVolatility,
  calculateSignalQuality,
  MACDData
} from '@/utils/technicalAnalysis';
import { selectStrategy } from '@/utils/strategy/strategySelector';
import { determineSignalDirection } from '@/utils/signals/signalDirectionUtils';
import { calculateTechnicalScores } from '@/utils/analysis/technicalScoreUtils';
import { calculateOptimalEntryTiming, calculateExpiryMinutes } from '@/utils/timing/entryTimingUtils';
import { MarketAnalysisResult } from '@/types/marketAnalysis';

/**
 * Comprehensive market analysis function that combines all technical indicators
 * and strategies to provide trading signals
 */
export const analyzeMarket = (symbol: string, interval: string): MarketAnalysisResult => {
  // Get simulated market data
  const { prices, volume } = generateSimulatedMarketData(symbol, 100);
  
  // Comprehensive market analysis
  const marketCondition = determineMarketCondition(prices, volume);
  const { value: trendStrengthValue } = calculateTrendStrength(prices, volume);
  const supportResistance = findSupportResistanceLevels(prices);
  const rsiValue = calculateRSI(prices);
  
  // Calculate MACD for current data point
  const currentMacd = calculateMACD(prices);
  
  // Calculate MACD for previous data point using prices without the last element
  const previousMacd = calculateMACD(prices.slice(0, -1));
  
  // Create an extended MACD data object that includes the previous histogram
  const macdData: MACDData = {
    macdLine: currentMacd.macdLine,
    signalLine: currentMacd.signalLine,
    histogram: currentMacd.histogram,
    previousHistogram: previousMacd.histogram
  };
  
  const bbands = calculateBollingerBands(prices);
  const volatility = calculateVolatility(prices);
  
  // Select optimal strategy based on current market conditions
  const selectedStrategy = selectStrategy(
    marketCondition, 
    prices, 
    volume,
    rsiValue, 
    macdData, 
    bbands,
    volatility
  );
  
  // Determine signal direction with enhanced analysis
  const direction = determineSignalDirection(
    marketCondition,
    prices,
    volume,
    bbands,
    rsiValue,
    macdData,
    trendStrengthValue
  );
  
  // Enhanced technical scores calculation
  const technicalScores = calculateTechnicalScores(
    rsiValue,
    macdData,
    bbands,
    prices,
    volume,
    trendStrengthValue
  );
  
  // Signal quality assessment
  const signalQuality = calculateSignalQuality(prices, direction, marketCondition, trendStrengthValue);
  
  // Confidence calculation with more factors
  const baseConfidence = (selectedStrategy.minConfidence + selectedStrategy.maxConfidence) / 2;
  const confidenceAdjustment = (signalQuality - 60) / 2;
  const technicalAdjustment = (technicalScores.overallScore - 50) / 4;
  const confidence = Math.round(
    Math.min(Math.max(baseConfidence + confidenceAdjustment + technicalAdjustment, 70), 98)
  );
  
  // Calculate optimal entry timing
  const secondsToNextMinute = calculateOptimalEntryTiming();
  const now = new Date();
  const entryTimeMillis = now.getTime() + (secondsToNextMinute * 1000);
  const entryTime = new Date(entryTimeMillis);
  
  // Calculate expiry time
  const expiryMinutes = calculateExpiryMinutes(interval);
  const expiryTimeMillis = entryTimeMillis + (expiryMinutes * 60 * 1000);
  const expiryTime = new Date(expiryTimeMillis);
  
  // Build and return the analysis result
  return {
    direction,
    confidence,
    timestamp: now.toISOString(),
    entryTime: entryTime.toISOString(),
    expiryTime: expiryTime.toISOString(),
    strategy: selectedStrategy.name,
    indicators: selectedStrategy.indicators,
    trendStrength: trendStrengthValue,
    marketCondition,
    supportResistance: {
      support: Math.round(supportResistance.support * 100) / 100,
      resistance: Math.round(supportResistance.resistance * 100) / 100
    },
    technicalScores,
    countdownSeconds: secondsToNextMinute
  };
};
