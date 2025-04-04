
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';

export interface UseMultiTimeframeAnalysisReturn {
  analysis: MultiTimeframeAnalysisResult | null;
  countdown: number;
  isLoading: boolean;
  analyzeMarket: () => void;
}

// Re-export types from timeframeAnalysis
export type { MultiTimeframeAnalysisResult, TimeframeAnalysis } from '@/types/timeframeAnalysis';
