
import { useEffect, useState, useCallback } from 'react';
import { useAIAnalysis } from '@/context/AIAnalysisContext';

/**
 * Hook para usar os insights de IA na aplicação
 * Agora usa o AIAnalysisContext centralizado para evitar duplicação
 */
export function useAIInsights(symbol: string) {
  const { 
    insights, 
    isLoadingInsights, 
    generateInsights: contextGenerateInsights
  } = useAIAnalysis();
  
  // Função de callback para garantir que estamos chamando a função do contexto
  // com o símbolo mais recente
  const generateInsights = useCallback(() => {
    if (symbol) {
      contextGenerateInsights(symbol);
    }
  }, [symbol, contextGenerateInsights]);

  // Gerar insights automaticamente quando o símbolo mudar
  useEffect(() => {
    if (symbol) {
      generateInsights();
    }
  }, [symbol, generateInsights]);
  
  return {
    insights,
    isLoading: isLoadingInsights,
    generateInsights
  };
}
