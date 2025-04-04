
import { SignalHistoryEntry } from '@/utils/signalHistoryUtils';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';

export interface StrategyOptimizationResult {
  confidenceAdjustment: number;
  recommendedTimeframes: string[];
  volatilityThreshold: number;
  entryTimingAdjustment: number;
  expiryMinutesAdjustment: number;
  preferredMarketConditions: string[];
  avoidedMarketConditions: string[];
  lastUpdated: string;
}

export interface TimeframePerformance {
  timeframe: string;
  winRate: number;
  sampleSize: number;
}

export interface UseAIStrategyOptimizerReturn {
  optimizeStrategy: (symbol: string, minSampleSize?: number) => StrategyOptimizationResult | null;
  enhanceAnalysisWithAI: (analysis: MultiTimeframeAnalysisResult | null) => MultiTimeframeAnalysisResult | null;
  isOptimizing: boolean;
  optimizationResult: StrategyOptimizationResult | null;
}
