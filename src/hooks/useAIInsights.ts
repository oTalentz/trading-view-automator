
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
  const { language } = useLanguage();
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
        
        // Gerar insights com base nas otimizações
        const newInsights = generateRandomInsights(symbol, language, optimization);
        setInsights(newInsights);
      } catch (error) {
        console.error('Error generating insights:', error);
        
        // Fallback para insights genéricos em caso de erro
        const fallbackInsights = generateFallbackInsights(language);
        setInsights(fallbackInsights);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  }, [symbol, language]);
  
  return {
    insights,
    isLoading,
    generateInsights
  };
}

// Função auxiliar para gerar insights aleatórios
function generateRandomInsights(symbol: string, language: string, optimization: any): AIInsight[] {
  // Definir os insights em português e inglês
  const insightsPtBr = [
    {
      key: 'trend',
      title: 'Análise de Tendência',
      description: `${symbol.split(':')[1]} apresenta tendência de médio prazo de alta com momentum crescente nos últimos períodos.`,
      type: 'success' as const
    },
    {
      key: 'volume',
      title: 'Padrão de Volume',
      description: 'Volume acima da média nas últimas 3 sessões sugere forte interesse de compradores.',
      type: 'info' as const
    },
    {
      key: 'resistance',
      title: 'Nível de Resistência Próximo',
      description: 'Atenção para possível resistência forte nos próximos 2%. Considere tomar lucros parciais.',
      type: 'warning' as const
    },
    {
      key: 'volatility',
      title: 'Alerta de Volatilidade',
      description: 'Volatilidade excessiva detectada. Redução do tamanho da posição é recomendada para este ativo.',
      type: 'error' as const
    }
  ];

  const insightsEn = [
    {
      key: 'trend',
      title: 'Trend Analysis',
      description: `${symbol.split(':')[1]} shows medium-term uptrend with increasing momentum in recent periods.`,
      type: 'success' as const
    },
    {
      key: 'volume',
      title: 'Volume Pattern',
      description: 'Above-average volume in the last 3 sessions suggests strong buyer interest.',
      type: 'info' as const
    },
    {
      key: 'resistance',
      title: 'Nearby Resistance Level',
      description: 'Be aware of potential strong resistance within the next 2%. Consider taking partial profits.',
      type: 'warning' as const
    },
    {
      key: 'volatility',
      title: 'Volatility Alert',
      description: 'Excessive volatility detected. Position size reduction is recommended for this asset.',
      type: 'error' as const
    }
  ];

  // Selecionar o conjunto de insights baseado no idioma
  const insightsSet = language === 'pt-br' ? insightsPtBr : insightsEn;
  
  // Retornar insights com um pouco de aleatoriedade para variar o conteúdo
  const randomIndex = Math.floor(Math.random() * insightsSet.length);
  const shuffledInsights = [...insightsSet].sort(() => (Math.random() > 0.3 ? 1 : -1));

  return shuffledInsights.slice(0, 2 + randomIndex);
}

// Função para gerar insights de fallback em caso de erro
function generateFallbackInsights(language: string): AIInsight[] {
  if (language === 'pt-br') {
    return [
      {
        key: 'error-recovery',
        title: 'Análise Limitada',
        description: 'Não foi possível gerar análises detalhadas no momento. Tente novamente mais tarde.',
        type: 'warning'
      }
    ];
  } else {
    return [
      {
        key: 'error-recovery',
        title: 'Limited Analysis',
        description: 'Detailed analysis could not be generated at this time. Please try again later.',
        type: 'warning'
      }
    ];
  }
}
