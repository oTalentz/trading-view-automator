
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { StrategyOptimizationResult } from '../types/strategyTypes';

/**
 * Apply AI optimizations to the current analysis
 * @param analysis The current analysis result
 * @param optimizationResult Optional strategy optimization result
 * @returns Enhanced analysis with AI optimizations
 */
export const enhanceAnalysisWithAI = (
  analysis: MultiTimeframeAnalysisResult,
  optimizationResult?: StrategyOptimizationResult | null
): MultiTimeframeAnalysisResult => {
  if (!analysis) return analysis;

  // Clone the analysis to avoid mutating the original
  const enhancedAnalysis = JSON.parse(JSON.stringify(analysis)) as MultiTimeframeAnalysisResult;
  
  // If no optimization result, just apply minimal enhancements
  if (!optimizationResult) {
    // Add AI optimization indicator if not already present
    if (!enhancedAnalysis.primarySignal.indicators.includes('AI Optimization')) {
      enhancedAnalysis.primarySignal.indicators.push('AI Optimization');
    }
    return enhancedAnalysis;
  }
  
  // Apply confidence adjustment based on AI optimization
  const adjustedConfidence = Math.min(
    Math.max(
      enhancedAnalysis.primarySignal.confidence + optimizationResult.confidenceAdjustment,
      60
    ),
    96
  );
  
  enhancedAnalysis.primarySignal.confidence = Math.round(adjustedConfidence);
  
  // Apply entry timing adjustment (adjust countdown)
  if (optimizationResult.entryTimingAdjustment !== 0) {
    const adjustedCountdown = Math.max(enhancedAnalysis.countdown + optimizationResult.entryTimingAdjustment, 1);
    enhancedAnalysis.countdown = adjustedCountdown;
    
    // Recalculate entry time
    const now = new Date();
    const entryTimeMillis = now.getTime() + (adjustedCountdown * 1000);
    enhancedAnalysis.primarySignal.entryTime = new Date(entryTimeMillis).toISOString();
    
    // Recalculate expiry time with adjustment
    const expiryMinutes = parseInt(enhancedAnalysis.primarySignal.expiryTime) || 5; // Provide a default value
    const expiryAdjustment = optimizationResult.expiryMinutesAdjustment || 0;
    const adjustedExpiryMinutes = expiryMinutes + expiryAdjustment;
    const expiryTimeMillis = entryTimeMillis + (adjustedExpiryMinutes * 60 * 1000);
    enhancedAnalysis.primarySignal.expiryTime = new Date(expiryTimeMillis).toISOString();
  }
  
  // Add AI optimization indicator
  if (!enhancedAnalysis.primarySignal.indicators.includes('AI Optimization')) {
    enhancedAnalysis.primarySignal.indicators.push('AI Optimization');
  }
  
  return enhancedAnalysis;
};
