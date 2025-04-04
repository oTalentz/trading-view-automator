
import { useState, useEffect } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { useCountdown } from './multiTimeframe/useCountdown';
import { useAnalysisGenerator } from './multiTimeframe/useAnalysisGenerator';
import { useRealtimeUpdates } from './multiTimeframe/useRealtimeUpdates';
import { UseMultiTimeframeAnalysisReturn } from './multiTimeframe/types';

// Re-export types
export type { MultiTimeframeAnalysisResult, TimeframeAnalysis } from './multiTimeframe/types';

export function useMultiTimeframeAnalysis(symbol: string, interval: string = '1'): UseMultiTimeframeAnalysisReturn {
  const [analysis, setAnalysis] = useState<MultiTimeframeAnalysisResult | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  
  const { generateAnalysis, isLoading } = useAnalysisGenerator(symbol, interval);
  const { updateAnalysisInRealtime } = useRealtimeUpdates();
  
  // Function to update analysis state with realtime data
  const updateRealtimeData = () => {
    const updatedAnalysis = updateAnalysisInRealtime(symbol, interval, analysis);
    if (updatedAnalysis) {
      setAnalysis(updatedAnalysis);
    }
  };
  
  // Use countdown hook for timer management
  useCountdown(countdown, setCountdown, analysis, symbol, updateRealtimeData);
  
  // Function to generate analysis and update state
  const analyzeMarket = () => {
    const result = generateAnalysis();
    if (result) {
      setAnalysis(result);
      setCountdown(result.countdown);
    }
  };
  
  // Gera análise inicial e a cada 5 minutos
  useEffect(() => {
    analyzeMarket(); // Análise inicial
    
    const analysisInterval = setInterval(() => {
      analyzeMarket();
    }, 5 * 60 * 1000); // A cada 5 minutos
    
    return () => clearInterval(analysisInterval);
  }, [symbol, interval]);
  
  return {
    analysis,
    countdown,
    isLoading,
    analyzeMarket
  };
}
