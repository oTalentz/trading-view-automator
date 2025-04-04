
import { useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAIStrategyOptimizer } from './multiTimeframe/useAIStrategyOptimizer';

// Define os tipos para os insights
export interface AIInsight {
  key: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

/**
 * Hook para gerar insights de IA para análise de mercado
 */
export function useAIInsights(symbol: string) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();
  const { optimizeStrategy } = useAIStrategyOptimizer();
  
  // Função para gerar insights baseados em IA
  const generateInsights = useCallback(() => {
    setIsLoading(true);
    setInsights([]);
    
    // Simula uma requisição de insights de IA
    setTimeout(() => {
      try {
        // Obter otimizações de estratégia
        const optimization = optimizeStrategy(symbol);
        
        // Gerar insights com base nas otimizações e no idioma atual
        const newInsights = generateInsightsForLanguage(symbol, language);
        setInsights(newInsights);
      } catch (error) {
        console.error('Error generating insights:', error);
        
        // Fallback para insights genéricos em caso de erro
        const fallbackInsights = generateFallbackInsights();
        setInsights(fallbackInsights);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  }, [symbol, language]);
  
  // Função para gerar insights específicos para o idioma atual
  const generateInsightsForLanguage = (symbol: string, language: string) => {
    // Obter o ticker (parte após o :)
    const ticker = symbol.split(':')[1] || symbol;
    
    // Conjunto de insights disponíveis em cada idioma
    const insightsByLanguage = {
      'pt-br': [
        {
          key: 'trend',
          title: t("trendAnalysis"),
          description: `${ticker} apresenta tendência de médio prazo de alta com momentum crescente nos últimos períodos.`,
          type: 'success' as const
        },
        {
          key: 'volume',
          title: t("volumePattern"),
          description: 'Volume acima da média nas últimas 3 sessões sugere forte interesse de compradores.',
          type: 'info' as const
        },
        {
          key: 'resistance',
          title: t("nearbyResistanceLevel"),
          description: 'Atenção para possível resistência forte nos próximos 2%. Considere tomar lucros parciais.',
          type: 'warning' as const
        },
        {
          key: 'volatility',
          title: t("volatilityAlert"),
          description: 'Volatilidade excessiva detectada. Redução do tamanho da posição é recomendada para este ativo.',
          type: 'error' as const
        }
      ],
      'en': [
        {
          key: 'trend',
          title: t("trendAnalysis"),
          description: `${ticker} shows medium-term uptrend with increasing momentum in recent periods.`,
          type: 'success' as const
        },
        {
          key: 'volume',
          title: t("volumePattern"),
          description: 'Above-average volume in the last 3 sessions suggests strong buyer interest.',
          type: 'info' as const
        },
        {
          key: 'resistance',
          title: t("nearbyResistanceLevel"),
          description: 'Be aware of potential strong resistance within the next 2%. Consider taking partial profits.',
          type: 'warning' as const
        },
        {
          key: 'volatility',
          title: t("volatilityAlert"),
          description: 'Excessive volatility detected. Position size reduction is recommended for this asset.',
          type: 'error' as const
        }
      ]
    };
    
    // Selecionar o conjunto de insights baseado no idioma
    const insightsSet = language === 'pt-br' ? insightsByLanguage['pt-br'] : insightsByLanguage['en'];
    
    // Retornar insights com um pouco de aleatoriedade para variar o conteúdo
    const randomIndex = Math.floor(Math.random() * insightsSet.length);
    const shuffledInsights = [...insightsSet].sort(() => (Math.random() > 0.3 ? 1 : -1));

    return shuffledInsights.slice(0, 2 + randomIndex);
  };
  
  // Função para gerar insights de fallback em caso de erro
  const generateFallbackInsights = (): AIInsight[] => {
    return [
      {
        key: 'error-recovery',
        title: language === 'pt-br' ? 'Análise Limitada' : 'Limited Analysis',
        description: language === 'pt-br' 
          ? 'Não foi possível gerar análises detalhadas no momento. Tente novamente mais tarde.' 
          : 'Detailed analysis could not be generated at this time. Please try again later.',
        type: 'warning'
      }
    ];
  };
  
  return {
    insights,
    isLoading,
    generateInsights
  };
}
