
import { useEffect, useCallback, useState } from 'react';
import { useAIAnalysis } from '@/context/AIAnalysisContext';

/**
 * Hook para usar previsões de ML na aplicação com suporte a atualizações em tempo real
 * Usa o AIAnalysisContext centralizado
 */
export function useMLPrediction(symbol: string, interval: string = '1') {
  const { 
    mlPrediction, 
    isLoadingPrediction, 
    generatePrediction: contextGeneratePrediction
  } = useAIAnalysis();
  
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  
  // Wrapper for generatePrediction to track last update time
  const generatePrediction = useCallback(() => {
    if (symbol && interval) {
      contextGeneratePrediction(symbol, interval);
      setLastUpdated(new Date());
    }
  }, [symbol, interval, contextGeneratePrediction]);

  // Gerar previsão automaticamente quando o símbolo ou intervalo mudar
  useEffect(() => {
    if (symbol && interval) {
      generatePrediction();
    }
  }, [symbol, interval, generatePrediction]);
  
  // Set up auto-refresh if enabled
  useEffect(() => {
    if (!isAutoRefreshEnabled) return;
    
    const refreshInterval = setInterval(() => {
      if (symbol && interval) {
        generatePrediction();
      }
    }, 60000); // Refresh every minute
    
    return () => clearInterval(refreshInterval);
  }, [symbol, interval, generatePrediction, isAutoRefreshEnabled]);
  
  // Toggle auto-refresh
  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled(prev => !prev);
  }, []);
  
  return {
    prediction: mlPrediction,
    isLoading: isLoadingPrediction,
    generatePrediction,
    lastUpdated,
    isAutoRefreshEnabled,
    toggleAutoRefresh
  };
}
