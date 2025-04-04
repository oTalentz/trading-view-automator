
import { cacheService } from '@/utils/cacheSystem';
import { StrategyWithDetails } from '../types';
import { MarketCondition } from '@/utils/technicalAnalysis';
import { SentimentAnalysisResult } from '@/utils/sentiment/sentimentAnalyzer';
import { getStrategyWithDetails } from '../utils/strategyDetailsUtils';

/**
 * Attempts to retrieve a cached strategy based on market conditions
 */
export const getCachedStrategy = (
  marketCondition: MarketCondition,
  rsiValue: number,
  macdData: any,
  volatility: number,
  sentimentData: SentimentAnalysisResult | null
): StrategyWithDetails | null => {
  // Generate cache key from input parameters
  const cacheKey = cacheService.generateKey('strategy-selection', { 
    marketCondition, 
    rsiValue: Math.round(rsiValue), 
    macdHistogram: Math.round(macdData.histogram * 1000) / 1000,
    volatility: Math.round(volatility * 1000) / 1000,
    hasSentiment: sentimentData !== null,
    sentimentScore: sentimentData ? Math.round(sentimentData.overallScore / 5) * 5 : null
  });
  
  const cachedStrategy = cacheService.get(cacheKey);
  
  // Ensure the cached object is valid
  if (cachedStrategy && typeof cachedStrategy === 'object' && cachedStrategy !== null) {
    // Ensure the cached object has the required properties
    const strategyWithDetails = cachedStrategy as StrategyWithDetails;
    if (strategyWithDetails.key) {
      return strategyWithDetails;
    }
  }
  
  return null;
};

/**
 * Caches a strategy
 */
export const cacheStrategy = (
  cacheKey: string,
  strategy: StrategyWithDetails,
  ttlSeconds: number = 300
): void => {
  cacheService.set(cacheKey, strategy, ttlSeconds);
};

/**
 * Generates the cache key for strategy selection
 */
export const generateStrategySelectionCacheKey = (
  marketCondition: MarketCondition,
  rsiValue: number,
  macdData: any,
  volatility: number,
  sentimentData: SentimentAnalysisResult | null
): string => {
  return cacheService.generateKey('strategy-selection', { 
    marketCondition, 
    rsiValue: Math.round(rsiValue), 
    macdHistogram: Math.round(macdData.histogram * 1000) / 1000,
    volatility: Math.round(volatility * 1000) / 1000,
    hasSentiment: sentimentData !== null,
    sentimentScore: sentimentData ? Math.round(sentimentData.overallScore / 5) * 5 : null
  });
};
