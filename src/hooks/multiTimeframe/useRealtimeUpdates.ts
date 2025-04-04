
import { cacheService } from '@/utils/cacheSystem';
import { analyzeAllTimeframes } from '@/utils/confluence';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { useAIStrategyOptimizer } from './useAIStrategyOptimizer';

/**
 * Hook to handle realtime updates of signals and analysis data
 * with AI-enhanced strategy optimization
 */
export function useRealtimeUpdates() {
  const { enhanceAnalysisWithAI, optimizeStrategy } = useAIStrategyOptimizer();
  
  /**
   * Updates analysis data in realtime for more precision
   * @param symbol The trading symbol (e.g. EUR/USD)
   * @param interval The timeframe interval
   * @param analysis The current analysis to update
   * @returns Updated analysis or null if update failed
   */
  const updateAnalysisInRealtime = (
    symbol: string, 
    interval: string, 
    analysis: MultiTimeframeAnalysisResult | null
  ): MultiTimeframeAnalysisResult | null => {
    // If no analysis provided, we can't update
    if (!analysis) return null;
    
    // Check cache for realtime updates first
    const cacheKey = cacheService.generateKey('realtime-update', { symbol, interval });
    const cachedUpdate = cacheService.get<MultiTimeframeAnalysisResult>(cacheKey);
    
    // If cached data exists, use it to update the analysis
    if (cachedUpdate) {
      // Get AI optimization data
      const optimizationResult = optimizeStrategy(symbol);
      
      // Apply AI optimization to the cached update if available
      if (optimizationResult) {
        return enhanceAnalysisWithAI(
          {
            ...analysis,
            overallConfluence: cachedUpdate.overallConfluence,
            confluenceDirection: cachedUpdate.confluenceDirection,
            timeframes: cachedUpdate.timeframes,
          },
          optimizationResult
        );
      }
      
      // Return regular update if no AI optimization
      return {
        ...analysis,
        overallConfluence: cachedUpdate.overallConfluence,
        confluenceDirection: cachedUpdate.confluenceDirection,
        timeframes: cachedUpdate.timeframes,
      };
    }
    
    try {
      // Get fresh analysis data without changing the primary signal
      const updatedResult = analyzeAllTimeframes(symbol, interval, true);
      if (updatedResult) {
        // Get AI optimization data
        const optimizationResult = optimizeStrategy(symbol);
        
        // Create base updated analysis
        const baseNewAnalysis = {
          ...analysis,
          overallConfluence: updatedResult.overallConfluence,
          confluenceDirection: updatedResult.confluenceDirection,
          timeframes: updatedResult.timeframes,
        };
        
        // Cache the updated result for 5 seconds to reduce API calls
        cacheService.set(cacheKey, updatedResult, 5);
        
        // Apply AI optimization if available
        if (optimizationResult) {
          return enhanceAnalysisWithAI(baseNewAnalysis, optimizationResult);
        }
        
        return baseNewAnalysis;
      }
    } catch (error) {
      console.error('Error updating analysis:', error);
    }
    
    // Return original analysis if update failed
    return analysis;
  };
  
  return {
    updateAnalysisInRealtime
  };
}
