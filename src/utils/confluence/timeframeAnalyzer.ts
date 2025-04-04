
import { TimeframeAnalysis, MultiTimeframeAnalysisResult, CONFLUENCE_TIMEFRAMES } from '@/types/timeframeAnalysis';
import { analyzeTimeframe } from '@/utils/timeframeAnalysisUtils';
import { 
  findSupportResistanceLevels, 
  generateSimulatedMarketData, 
  calculateVolatility,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands
} from '@/utils/technicalAnalysis';
import { calculateOptimalEntryTiming, calculateOptimalExpiryTime } from '@/utils/technical/entryTiming';
import { generateSignalDetails } from './signalGenerator';
import { calculateEnhancedTechnicalScores } from './technicalScores';

export const calculateExpiryMinutes = (interval: string): number => {
  switch(interval) {
    case '1': return 1; 
    case '5': return 5;
    case '15': return 15;
    case '30': return 30;
    case '60': return 60;
    case '240': return 240;
    case 'D': return 1440; // 24 hours
    case 'W': return 10080; // 7 days
    default: return 1;
  }
};

export const analyzeAllTimeframes = (
  symbol: string, 
  interval: string,
  realtimeUpdate: boolean = false
): MultiTimeframeAnalysisResult => {
  // Analyze each timeframe with improved accuracy
  const timeframeAnalyses = CONFLUENCE_TIMEFRAMES.map(tf => 
    analyzeTimeframe(symbol, tf.value, tf.label)
  );
  
  // Select the analysis for the current timeframe as the primary signal
  const selectedTimeframeIndex = timeframeAnalyses.findIndex(tf => tf.timeframe === interval);
  const selectedAnalysis = timeframeAnalyses[selectedTimeframeIndex >= 0 ? selectedTimeframeIndex : 0];
  
  // Enhanced confluence calculation with weighted voting
  let callVotes = 0;
  let putVotes = 0;
  let totalConfidence = 0;
  
  // Apply dynamic timeframe weighting - higher weight for higher timeframes
  timeframeAnalyses.forEach(tf => {
    // Dynamic weight based on timeframe and selected interval
    let weight = 1.0;
    
    // Selected timeframe gets higher weight
    if (tf.timeframe === interval) {
      weight = 1.8;
    } 
    // Higher timeframes get more weight in general (more reliable signals)
    else if (parseInt(tf.timeframe) > parseInt(interval)) {
      weight = 1.4;
    }
    // Weight by trend strength - stronger trends get more weight
    weight *= (tf.strength / 60);
    
    // Apply weighted voting
    if (tf.direction === 'CALL') {
      callVotes += tf.confidence * weight;
    } else {
      putVotes += tf.confidence * weight;
    }
    totalConfidence += tf.confidence * weight;
  });
  
  // Determine confluence direction with more stringent criteria
  let confluenceDirection: 'CALL' | 'PUT' | 'NEUTRAL';
  const confluenceThreshold = 0.15; // 15% difference threshold (reduced from 20%)
  const callPercentage = callVotes / totalConfidence;
  const putPercentage = putVotes / totalConfidence;
  
  if (callPercentage > putPercentage && callPercentage - putPercentage > confluenceThreshold) {
    confluenceDirection = 'CALL';
  } else if (putPercentage > callPercentage && putPercentage - callPercentage > confluenceThreshold) {
    confluenceDirection = 'PUT';
  } else {
    confluenceDirection = 'NEUTRAL';
  }
  
  // Calculate confluence strength (0-100) with reduced volatility
  let overallConfluence = Math.abs(callVotes - putVotes) / totalConfidence * 100;
  
  // Apply smoothing to reduce volatility in confluence score
  overallConfluence = Math.round(overallConfluence);
  overallConfluence = Math.min(overallConfluence, 95); // Cap at 95 for realism
  
  // For realtime updates, just return the updated confluence data
  if (realtimeUpdate) {
    return {
      primarySignal: selectedAnalysis.direction === 'CALL' 
        ? generateSignalDetails(symbol, 'CALL', interval, overallConfluence, selectedAnalysis, timeframeAnalyses)
        : generateSignalDetails(symbol, 'PUT', interval, overallConfluence, selectedAnalysis, timeframeAnalyses),
      timeframes: timeframeAnalyses,
      overallConfluence,
      confluenceDirection,
      countdown: 0 // Don't change the countdown
    };
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
  
  // Adjust confidence based on confluence with more nuanced scaling
  let adjustedConfidence = selectedAnalysis.confidence;
  
  if (selectedAnalysis.direction === confluenceDirection) {
    // Confluence supports the signal - boost confidence
    adjustedConfidence += Math.min(overallConfluence / 8, 15); // Max +15 boost
  } else if (confluenceDirection === 'NEUTRAL') {
    // Mixed signals - small reduction
    adjustedConfidence -= 5; 
  } else {
    // Confluence opposes the signal - significant reduction
    adjustedConfidence -= Math.min(overallConfluence / 4, 20); // Max -20 reduction
  }
  
  // Additional adjustment factors
  
  // 1. Volatility filter - reduce confidence in high volatility
  if (volatility > 0.015) {
    adjustedConfidence -= Math.min(Math.round(volatility * 400), 15);
  }
  
  // 2. Trend strength bonus for aligned signals
  if (selectedAnalysis.strength > 70 && 
      ((selectedAnalysis.direction === 'CALL' && confluenceDirection === 'CALL') ||
       (selectedAnalysis.direction === 'PUT' && confluenceDirection === 'PUT'))) {
    adjustedConfidence += 5;
  }
  
  // 3. Support/resistance proximity bonus
  const currentPrice = prices[prices.length - 1];
  const distanceToSupport = Math.abs(currentPrice - supportResistance.support) / currentPrice;
  const distanceToResistance = Math.abs(currentPrice - supportResistance.resistance) / currentPrice;
  
  if (selectedAnalysis.direction === 'CALL' && distanceToSupport < 0.01) {
    // Price near support, good for CALL
    adjustedConfidence += 5;
  } else if (selectedAnalysis.direction === 'PUT' && distanceToResistance < 0.01) {
    // Price near resistance, good for PUT
    adjustedConfidence += 5;
  }
  
  // Ensure reasonable confidence range
  adjustedConfidence = Math.round(adjustedConfidence);
  adjustedConfidence = Math.min(Math.max(adjustedConfidence, 60), 96);
  
  // Final result with enhanced multi-timeframe confluence
  return {
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
};
