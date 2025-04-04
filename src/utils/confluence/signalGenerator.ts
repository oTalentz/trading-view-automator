
import { TimeframeAnalysis } from '@/types/timeframeAnalysis';
import { 
  findSupportResistanceLevels, 
  generateSimulatedMarketData, 
  calculateVolatility,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands
} from '@/utils/technicalAnalysis';
import { calculateOptimalEntryTiming, calculateOptimalExpiryTime } from '@/utils/technical/entryTiming';
import { calculateEnhancedTechnicalScores } from './technicalScores';
import { calculateExpiryMinutes } from './timeframeAnalyzer';

// Enhanced utility function to generate signal details consistently
export const generateSignalDetails = (
  symbol: string,
  direction: 'CALL' | 'PUT' | 'NEUTRAL',
  interval: string,
  overallConfluence: number,
  selectedAnalysis: TimeframeAnalysis,
  timeframeAnalyses: TimeframeAnalysis[]
) => {
  const { prices, volume } = generateSimulatedMarketData(symbol, 200);
  const supportResistance = findSupportResistanceLevels(prices);
  const volatility = calculateVolatility(prices);
  const now = new Date();
  
  // More nuanced confidence adjustment
  let adjustedConfidence = selectedAnalysis.confidence;
  
  if (selectedAnalysis.direction === direction) {
    adjustedConfidence = Math.min(adjustedConfidence + (overallConfluence / 8), 96);
  } else {
    adjustedConfidence = Math.max(adjustedConfidence - (overallConfluence / 4), 60);
  }
  
  // Apply volatility filter
  if (volatility > 0.015) {
    adjustedConfidence -= Math.min(Math.round(volatility * 400), 15);
  }
  
  // Optimal entry timing
  const secondsToNextMinute = calculateOptimalEntryTiming();
  const entryTimeMillis = now.getTime() + (secondsToNextMinute * 1000);
  const entryTime = new Date(entryTimeMillis);
  
  // Optimal expiry time based on volatility and trend
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
  
  return {
    direction,
    confidence: Math.round(adjustedConfidence),
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
  };
};
