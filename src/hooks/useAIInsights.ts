
import { useEffect } from 'react';
import { useAIAnalysis } from '@/context/AIAnalysisContext';

/**
 * Hook para usar os insights de IA na aplicação
 * Agora usa o AIAnalysisContext centralizado para evitar duplicação
 */
export function useAIInsights(symbol: string) {
  const { 
    insights, 
    isLoadingInsights, 
    generateInsights 
  } = useAIAnalysis();

  // Gerar insights automaticamente quando o símbolo mudar
  useEffect(() => {
    if (symbol) {
      generateInsights(symbol);
    }
  }, [symbol, generateInsights]);
  
  return {
    insights,
    isLoading: isLoadingInsights,
    generateInsights: () => generateInsights(symbol)
  };
}
