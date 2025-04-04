
import { TimeframeAnalysis, MultiTimeframeAnalysisResult, CONFLUENCE_TIMEFRAMES } from '@/types/timeframeAnalysis';
import { analyzeTimeframe } from '@/utils/timeframeAnalysisUtils';
import { 
  findSupportResistanceLevels, 
  generateSimulatedMarketData, 
  calculateVolatility
} from '@/utils/technicalAnalysis';
import { calculateOptimalEntryTiming, calculateOptimalExpiryTime } from '@/utils/technical/entryTiming';
import { generateSignalDetails } from './signalGenerator';
import { calculateEnhancedTechnicalScores } from './technicalScores';
import { calculateExpiryMinutes } from './expiryCalculator';
import { calculateConfluenceDirection } from './confluenceCalculator';
import { adjustConfidence } from './signalConfidence';
import { cacheService } from '@/utils/cacheSystem';

export { calculateExpiryMinutes } from './expiryCalculator';

export const analyzeAllTimeframes = (
  symbol: string, 
  interval: string,
  realtimeUpdate: boolean = false
): MultiTimeframeAnalysisResult => {
  // Verificar cache para atualizações em tempo real
  if (realtimeUpdate) {
    const cacheKey = cacheService.generateKey('realtime-analysis', { symbol, interval });
    const cachedResult = cacheService.get<MultiTimeframeAnalysisResult>(cacheKey);
    
    if (cachedResult) {
      return cachedResult;
    }
  }
  
  // Para análises completas, usar cache com validade menor
  const cacheKey = cacheService.generateKey('full-analysis', { symbol, interval });
  const cachedResult = cacheService.get<MultiTimeframeAnalysisResult>(cacheKey);
  
  if (cachedResult && !realtimeUpdate) {
    return cachedResult;
  }
  
  // Analyze each timeframe with improved accuracy
  const timeframeAnalyses = CONFLUENCE_TIMEFRAMES.map(tf => 
    analyzeTimeframe(symbol, tf.value, tf.label)
  );
  
  // Select the analysis for the current timeframe as the primary signal
  const selectedTimeframeIndex = timeframeAnalyses.findIndex(tf => tf.timeframe === interval);
  const selectedAnalysis = timeframeAnalyses[selectedTimeframeIndex >= 0 ? selectedTimeframeIndex : 0];
  
  // Calculate confluence using optimized function
  const { 
    confluenceDirection, 
    overallConfluence 
  } = calculateConfluenceDirection(timeframeAnalyses, interval);
  
  // For realtime updates, just return the updated confluence data
  if (realtimeUpdate) {
    const result = {
      primarySignal: selectedAnalysis.direction === 'CALL' 
        ? generateSignalDetails(symbol, 'CALL', interval, overallConfluence, selectedAnalysis, timeframeAnalyses)
        : generateSignalDetails(symbol, 'PUT', interval, overallConfluence, selectedAnalysis, timeframeAnalyses),
      timeframes: timeframeAnalyses,
      overallConfluence,
      confluenceDirection,
      countdown: 0 // Don't change the countdown
    };
    
    // Cache por 10 segundos para atualizações em tempo real
    cacheService.set(cacheKey, result, 10);
    
    return result;
  }
  
  // Generate the primary signal with enhanced precision
  const { prices, volume } = generateSimulatedMarketData(symbol, 200); // More data points
  const supportResistance = findSupportResistanceLevels(prices);
  const volatility = calculateVolatility(prices);
  const now = new Date();
  
  // Calculate optimal entry timing based on enhanced algorithm
  const secondsToNextMinute = calculateOptimalEntryTiming();
  const entryTimeMillis = now.getTime() + (secondsToNextMinute * 1000);
  const entryTime = new Date(entryTimeMillis);
  
  // Calculate optimal expiry time based on volatility and trend strength
  const baseExpiryMinutes = calculateExpiryMinutes(interval);
  const optimalExpiryMinutes = calculateOptimalExpiryTime(
    interval, 
    volatility, 
    selectedAnalysis.strength
  );
  
  // Use optimal or default expiry time
  const expiryMinutes = optimalExpiryMinutes || baseExpiryMinutes;
  
  // Calculate exact expiry time
  const expiryTimeMillis = entryTimeMillis + (expiryMinutes * 60 * 1000);
  const expiryTime = new Date(expiryTimeMillis);
  
  // Calculate confidence using centralized function
  const currentPrice = prices[prices.length - 1];
  
  const adjustedConfidence = adjustConfidence(
    selectedAnalysis.confidence,
    selectedAnalysis,
    confluenceDirection,
    overallConfluence,
    volatility,
    currentPrice,
    supportResistance.support,
    supportResistance.resistance,
    prices
  );
  
  // Final result with enhanced multi-timeframe confluence
  const result = {
    primarySignal: {
      direction: selectedAnalysis.direction,
      confidence: adjustedConfidence,
      timestamp: now.toISOString(),
      entryTime: entryTime.toISOString(),
      expiryTime: expiryTime.toISOString(),
      strategy: "Multi-Timeframe Confluence",
      indicators: [
        "RSI", "MACD", "Bollinger Bands", 
        "Multi-Timeframe Confluence", "Trend Analysis",
        "Support/Resistance", "Volatility Filter"
      ],
      trendStrength: selectedAnalysis.strength,
      marketCondition: selectedAnalysis.marketCondition,
      supportResistance: {
        support: Math.round(supportResistance.support * 100) / 100,
        resistance: Math.round(supportResistance.resistance * 100) / 100
      },
      technicalScores: calculateEnhancedTechnicalScores(prices, volume, selectedAnalysis, adjustedConfidence)
    },
    timeframes: timeframeAnalyses,
    overallConfluence,
    confluenceDirection,
    countdown: secondsToNextMinute
  };
  
  // Cache resultado por 3 minutos
  cacheService.set(cacheKey, result, 180);
  
  return result;
};
