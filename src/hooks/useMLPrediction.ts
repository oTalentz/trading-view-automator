
import { useEffect } from 'react';
import { useAIAnalysis } from '@/context/AIAnalysisContext';

/**
 * Hook para usar previsões de ML na aplicação
 * Usa o AIAnalysisContext centralizado
 */
export function useMLPrediction(symbol: string, interval: string = '1') {
  const { 
    mlPrediction, 
    isLoadingPrediction, 
    generatePrediction 
  } = useAIAnalysis();

  // Gerar previsão automaticamente quando o símbolo ou intervalo mudar
  useEffect(() => {
    if (symbol && interval) {
      generatePrediction(symbol, interval);
    }
  }, [symbol, interval, generatePrediction]);
  
  return {
    prediction: mlPrediction,
    isLoading: isLoadingPrediction,
    generatePrediction: () => generatePrediction(symbol, interval)
  };
}
