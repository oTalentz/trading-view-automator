
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { cacheService } from '@/utils/cacheSystem';
import { optimizeStrategy } from '@/utils/ml/aiOptimizer';

// Tipos para os insights
export interface AIInsight {
  key: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Tipos para as previsões de ML
export interface MLPrediction {
  direction: 'CALL' | 'PUT';
  probability: number;
  patterns: { name: string; reliability: number }[];
  timeframes: { timeframe: string; prediction: 'CALL' | 'PUT'; confidence: number }[];
}

// Interface para o contexto
interface AIAnalysisContextType {
  insights: AIInsight[];
  mlPrediction: MLPrediction | null;
  isLoadingInsights: boolean;
  isLoadingPrediction: boolean;
  generateInsights: (symbol: string) => void;
  generatePrediction: (symbol: string, interval: string) => void;
}

// Valor padrão do contexto
const defaultContext: AIAnalysisContextType = {
  insights: [],
  mlPrediction: null,
  isLoadingInsights: false,
  isLoadingPrediction: false,
  generateInsights: () => {},
  generatePrediction: () => {},
};

// Criação do contexto
const AIAnalysisContext = createContext<AIAnalysisContextType>(defaultContext);

// Hook personalizado para usar o contexto
export const useAIAnalysis = () => useContext(AIAnalysisContext);

// Provider do contexto
export const AIAnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [mlPrediction, setMLPrediction] = useState<MLPrediction | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const { language, t } = useLanguage();

  // Função para gerar insights baseados em IA
  const generateInsights = useCallback((symbol: string) => {
    setIsLoadingInsights(true);
    
    // Verificar cache primeiro
    const cacheKey = cacheService.generateKey('ai-insights', { symbol, language });
    const cachedInsights = cacheService.get<AIInsight[]>(cacheKey);
    
    if (cachedInsights) {
      setInsights(cachedInsights);
      setIsLoadingInsights(false);
      return;
    }
    
    // Simular requisição de insights
    setTimeout(() => {
      try {
        // Obter otimizações de estratégia (simulado)
        optimizeStrategy(symbol);
        
        // Gerar insights com base no idioma atual
        const newInsights = generateInsightsForLanguage(symbol, language, t);
        setInsights(newInsights);
        
        // Armazenar no cache por 5 minutos
        cacheService.set(cacheKey, newInsights, 300);
      } catch (error) {
        console.error('Error generating insights:', error);
        
        // Fallback para insights genéricos em caso de erro
        const fallbackInsights = generateFallbackInsights(language, t);
        setInsights(fallbackInsights);
      } finally {
        setIsLoadingInsights(false);
      }
    }, 1200);
  }, [language, t]);

  // Função para gerar previsões de ML
  const generatePrediction = useCallback((symbol: string, interval: string) => {
    setIsLoadingPrediction(true);
    
    // Verificar cache primeiro
    const cacheKey = cacheService.generateKey('ml-prediction', { symbol, interval, language });
    const cachedPrediction = cacheService.get<MLPrediction>(cacheKey);
    
    if (cachedPrediction) {
      setMLPrediction(cachedPrediction);
      setIsLoadingPrediction(false);
      return;
    }
    
    // Simular requisição de previsão
    setTimeout(() => {
      try {
        const probability = 65 + Math.random() * 25;
        const direction = probability > 75 ? 'CALL' as const : 'PUT' as const;
        
        const patterns = [
          { 
            name: Math.random() > 0.5 ? t("hammerPattern") : t("dojiPattern"), 
            reliability: 60 + Math.random() * 30 
          },
          { 
            name: Math.random() > 0.5 ? t("engulfingPattern") : t("morningStar"), 
            reliability: 60 + Math.random() * 30 
          },
          { 
            name: Math.random() > 0.5 ? t("rsiDivergence") : t("macdCrossover"), 
            reliability: 60 + Math.random() * 30 
          }
        ];
        
        const timeframes = [
          { timeframe: '1m', prediction: Math.random() > 0.5 ? 'CALL' as const : 'PUT' as const, confidence: 60 + Math.random() * 30 },
          { timeframe: '5m', prediction: Math.random() > 0.5 ? 'CALL' as const : 'PUT' as const, confidence: 60 + Math.random() * 30 },
          { timeframe: '15m', prediction: Math.random() > 0.5 ? 'CALL' as const : 'PUT' as const, confidence: 60 + Math.random() * 30 }
        ];
        
        const prediction = {
          direction,
          probability,
          patterns,
          timeframes
        };
        
        setMLPrediction(prediction);
        
        // Armazenar no cache por 2 minutos
        cacheService.set(cacheKey, prediction, 120);
      } catch (error) {
        console.error('Error generating ML prediction:', error);
        setMLPrediction(null);
      } finally {
        setIsLoadingPrediction(false);
      }
    }, 1500);
  }, [language, t]);

  return (
    <AIAnalysisContext.Provider 
      value={{ 
        insights, 
        mlPrediction, 
        isLoadingInsights, 
        isLoadingPrediction, 
        generateInsights, 
        generatePrediction 
      }}
    >
      {children}
    </AIAnalysisContext.Provider>
  );
};

// Funções auxiliares para gerar insights
const generateInsightsForLanguage = (symbol: string, language: string, t: (key: string) => string): AIInsight[] => {
  // Obter o ticker (parte após o :)
  const ticker = symbol.split(':')[1] || symbol;
  
  // Conjunto de insights disponíveis
  const insightOptions = [
    {
      key: 'trend',
      title: t("trendAnalysis"),
      description: language === 'pt-br'
        ? `${ticker} apresenta tendência de médio prazo de alta com momentum crescente nos últimos períodos.`
        : `${ticker} shows medium-term uptrend with increasing momentum in recent periods.`,
      type: 'success' as const
    },
    {
      key: 'volume',
      title: t("volumePattern"),
      description: language === 'pt-br'
        ? 'Volume acima da média nas últimas 3 sessões sugere forte interesse de compradores.'
        : 'Above-average volume in the last 3 sessions suggests strong buyer interest.',
      type: 'info' as const
    },
    {
      key: 'resistance',
      title: t("nearbyResistanceLevel"),
      description: language === 'pt-br'
        ? 'Atenção para possível resistência forte nos próximos 2%. Considere tomar lucros parciais.'
        : 'Be aware of potential strong resistance within the next 2%. Consider taking partial profits.',
      type: 'warning' as const
    },
    {
      key: 'volatility',
      title: t("volatilityAlert"),
      description: language === 'pt-br'
        ? 'Volatilidade excessiva detectada. Redução do tamanho da posição é recomendada para este ativo.'
        : 'Excessive volatility detected. Position size reduction is recommended for this asset.',
      type: 'error' as const
    }
  ];
  
  // Retornar insights com um pouco de aleatoriedade
  const randomIndex = Math.floor(Math.random() * insightOptions.length);
  const shuffledInsights = [...insightOptions].sort(() => (Math.random() > 0.3 ? 1 : -1));

  return shuffledInsights.slice(0, 2 + randomIndex);
};

// Função para gerar insights de fallback em caso de erro
const generateFallbackInsights = (language: string, t: (key: string) => string): AIInsight[] => {
  return [
    {
      key: 'error-recovery',
      title: t("limitedAnalysis"),
      description: language === 'pt-br'
        ? 'Não foi possível gerar análises detalhadas no momento. Tente novamente mais tarde.'
        : 'Detailed analysis could not be generated at this time. Please try again later.',
      type: 'warning'
    }
  ];
};

export default AIAnalysisContext;
