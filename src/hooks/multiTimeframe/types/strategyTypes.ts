
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
  performanceByTimeframe?: Record<string, number>;
  winRateHistory?: { date: string; rate: number }[];
}

export interface TimeframePerformance {
  timeframe: string;
  winRate: number;
  sampleSize: number;
  confidence?: number;
}

export interface UseAIStrategyOptimizerReturn {
  optimizeStrategy: (symbol: string) => StrategyOptimizationResult | null;
  enhanceAnalysisWithAI: (analysis: MultiTimeframeAnalysisResult | null) => MultiTimeframeAnalysisResult | null;
  isOptimizing: boolean;
  optimizationResult: StrategyOptimizationResult | null;
}
