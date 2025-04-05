
import { useEffect, useState, useCallback } from 'react';
import { useAIAnalysis } from '@/context/AIAnalysisContext';

/**
 * Hook para usar os insights de IA na aplicação
 * Agora usa o AIAnalysisContext centralizado para evitar duplicação
 * Com suporte a atualizações em tempo real mais confiáveis
 */
export function useAIInsights(symbol: string) {
  const { 
    insights, 
    isLoadingInsights, 
    generateInsights: contextGenerateInsights
  } = useAIAnalysis();
  
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  
  // Função de callback para garantir que estamos chamando a função do contexto
  // com o símbolo mais recente e rastreando o tempo de atualização
  const generateInsights = useCallback(() => {
    if (symbol) {
      contextGenerateInsights(symbol);
      setLastRefreshTime(new Date());
    }
  }, [symbol, contextGenerateInsights]);

  // Gerar insights automaticamente quando o símbolo mudar
  useEffect(() => {
    if (symbol) {
      generateInsights();
    }
  }, [symbol, generateInsights]);

  // Configurar atualização automática a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (symbol) {
        generateInsights();
      }
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [symbol, generateInsights]);
  
  return {
    insights,
    isLoading: isLoadingInsights,
    generateInsights,
    lastRefreshTime
  };
}
