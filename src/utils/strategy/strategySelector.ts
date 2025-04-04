
import { MarketCondition } from '@/utils/technicalAnalysis';
import { MARKET_CONDITION_STRATEGIES } from '@/constants/tradingStrategies';
import { scoreStrategies } from './scoring/strategyScorer';
import { optimizeStrategySelection } from '@/utils/ml/strategyOptimizer';
import { SentimentAnalysisResult } from '@/utils/sentiment/sentimentAnalyzer';
import { cacheService } from '@/utils/cacheSystem';

// Define the ADVANCED_STRATEGIES constant that was missing
const ADVANCED_STRATEGIES = {
  'RSI_DIVERGENCE': {
    name: 'RSI Divergence',
    indicators: ['RSI', 'Price Action', 'Trend Analysis'],
    description: 'Identifica divergências entre preço e RSI para captar reversões',
    suitableMarketConditions: ['SIDEWAYS', 'TREND_UP', 'TREND_DOWN'],
    risk: 'medium'
  },
  'MACD_CROSSOVER': {
    name: 'MACD Crossover',
    indicators: ['MACD', 'Signal Line', 'Histogram'],
    description: 'Identifica cruzamentos do MACD com a linha de sinal',
    suitableMarketConditions: ['TREND_UP', 'TREND_DOWN', 'STRONG_TREND_UP', 'STRONG_TREND_DOWN'],
    risk: 'medium'
  },
  'BOLLINGER_BREAKOUT': {
    name: 'Bollinger Breakout',
    indicators: ['Bollinger Bands', 'Volatility', 'Price Action'],
    description: 'Identifica rompimentos das bandas de Bollinger',
    suitableMarketConditions: ['VOLATILE', 'SIDEWAYS'],
    risk: 'high'
  },
  'SUPPORT_RESISTANCE': {
    name: 'Support & Resistance',
    indicators: ['Support Levels', 'Resistance Levels', 'Price Action'],
    description: 'Opera em níveis de suporte e resistência',
    suitableMarketConditions: ['SIDEWAYS', 'TREND_UP', 'TREND_DOWN'],
    risk: 'low'
  },
  'TREND_FOLLOWING': {
    name: 'Trend Following',
    indicators: ['Moving Averages', 'ADX', 'Price Action'],
    description: 'Segue a direção da tendência atual',
    suitableMarketConditions: ['TREND_UP', 'TREND_DOWN', 'STRONG_TREND_UP', 'STRONG_TREND_DOWN'],
    risk: 'medium'
  },
  'FIBONACCI_RETRACEMENT': {
    name: 'Fibonacci Retracement',
    indicators: ['Fibonacci Levels', 'Trend Analysis', 'Price Action'],
    description: 'Usa níveis de Fibonacci para entradas e alvos',
    suitableMarketConditions: ['TREND_UP', 'TREND_DOWN', 'SIDEWAYS'],
    risk: 'medium'
  },
  'ICHIMOKU_CLOUD': {
    name: 'Ichimoku Cloud',
    indicators: ['Tenkan-sen', 'Kijun-sen', 'Kumo', 'Chikou Span'],
    description: 'Sistema completo de análise Ichimoku Kinko Hyo',
    suitableMarketConditions: ['TREND_UP', 'TREND_DOWN', 'STRONG_TREND_UP', 'STRONG_TREND_DOWN'],
    risk: 'medium'
  },
  'SENTIMENT_ENHANCED': {
    name: 'Sentiment Enhanced Strategy',
    indicators: ['Market Sentiment', 'Social Media Analysis', 'News Impact', 'Technical Confluence'],
    description: 'Combina análise técnica com dados de sentimento de mercado',
    suitableMarketConditions: ['SIDEWAYS', 'TREND_UP', 'TREND_DOWN', 'VOLATILE'],
    risk: 'medium'
  },
  'ML_ADAPTIVE': {
    name: 'ML Adaptive Strategy',
    indicators: ['Machine Learning', 'Pattern Recognition', 'Multi-timeframe Analysis'],
    description: 'Estratégia adaptativa baseada em aprendizado de máquina',
    suitableMarketConditions: ['SIDEWAYS', 'TREND_UP', 'TREND_DOWN', 'VOLATILE', 'STRONG_TREND_UP', 'STRONG_TREND_DOWN'],
    risk: 'medium'
  }
};

/**
 * Seleciona a estratégia de trading ideal com base nas condições atuais de mercado,
 * indicadores técnicos, histórico de desempenho e análise de sentimento
 */
export const selectStrategy = (
  marketCondition: MarketCondition, 
  prices: number[], 
  volume: number[],
  rsiValue: number, 
  macdData: any,
  bbands: any,
  volatility: number,
  trendStrength: number = 50,
  sentimentData: SentimentAnalysisResult | null = null,
  useML: boolean = true
) => {
  // Obtem estratégias compatíveis para a condição atual de mercado
  const compatibleStrategies = MARKET_CONDITION_STRATEGIES[marketCondition] || 
    MARKET_CONDITION_STRATEGIES.SIDEWAYS; // Default para lateral se condição não encontrada
  
  // Verificar cache primeiro para evitar cálculos repetidos
  const cacheKey = cacheService.generateKey('strategy-selection', { 
    marketCondition, 
    rsiValue: Math.round(rsiValue), 
    macdHistogram: Math.round(macdData.histogram * 1000) / 1000,
    volatility: Math.round(volatility * 1000) / 1000,
    hasSentiment: sentimentData !== null,
    sentimentScore: sentimentData ? Math.round(sentimentData.overallScore / 5) * 5 : null
  });
  
  const cachedStrategy = cacheService.get(cacheKey);
  if (cachedStrategy) {
    return cachedStrategy;
  }
  
  // Carregar histórico de desempenho das estratégias
  const historicalPerformance = loadStrategyPerformanceHistory();
  
  if (useML) {
    try {
      // Usar otimizador de ML para seleção de estratégia
      const optimizedSelection = optimizeStrategySelection(
        compatibleStrategies,
        prices,
        volume,
        rsiValue,
        macdData,
        bbands,
        volatility,
        trendStrength,
        marketCondition,
        sentimentData,
        historicalPerformance
      );
      
      // Obter estratégia a partir da chave otimizada
      const strategyKey = optimizedSelection.strategyKey;
      const strategy = getStrategyWithDetails(
        strategyKey, 
        optimizedSelection.confidenceScore, 
        optimizedSelection.reasons
      );
      
      // Adicionar estratégias alternativas
      strategy.alternativeStrategies = optimizedSelection.alternativeStrategies.map(alt => ({
        name: getStrategyName(alt.strategyKey),
        confidenceScore: alt.confidenceScore
      }));
      
      // Cache por 5 minutos
      cacheService.set(cacheKey, strategy, 300);
      
      return strategy;
    } catch (error) {
      console.error("Error using ML strategy optimizer:", error);
      // Fallback para método tradicional
    }
  }
  
  // Método tradicional de fallback (sem ML)
  const strategyScores = scoreStrategies(
    compatibleStrategies,
    prices,
    volume,
    rsiValue,
    macdData,
    bbands,
    volatility
  );
  
  // Seleciona a estratégia com maior pontuação
  strategyScores.sort((a, b) => b.score - a.score);
  
  // Cache por 5 minutos
  cacheService.set(cacheKey, strategyScores[0].strategy, 300);
  
  return strategyScores[0].strategy;
};

/**
 * Obtém detalhes completos de uma estratégia a partir da chave
 */
const getStrategyWithDetails = (
  strategyKey: string, 
  confidenceScore: number, 
  reasons: string[]
) => {
  const strategyDetails = ADVANCED_STRATEGIES[strategyKey as keyof typeof ADVANCED_STRATEGIES];
  
  return {
    ...strategyDetails,
    key: strategyKey,
    name: strategyDetails.name,
    selectionReasons: reasons,
    mlConfidenceScore: confidenceScore,
    // Adiciona histórico simulado de desempenho
    historicalPerformance: {
      performanceBonus: (confidenceScore - 50) / 10, // Converter para escala usada pelo sistema anterior
      winRate: confidenceScore / 100,
      sampleSize: Math.floor(Math.random() * 50) + 30 // Simulado
    }
  };
};

/**
 * Obtém o nome de uma estratégia a partir da chave
 */
const getStrategyName = (strategyKey: string): string => {
  const strategy = ADVANCED_STRATEGIES[strategyKey as keyof typeof ADVANCED_STRATEGIES];
  return strategy ? strategy.name : strategyKey;
};

/**
 * Carrega o histórico de desempenho das estratégias
 * Em uma implementação real, isso buscaria dados do banco de dados ou localStorage
 */
const loadStrategyPerformanceHistory = () => {
  // Verificar cache
  const cacheKey = 'strategy-performance-history';
  const cachedHistory = cacheService.get(cacheKey);
  
  if (cachedHistory) {
    return cachedHistory;
  }
  
  // Em uma implementação real, esses dados viriam de um histórico salvo
  // Aqui usamos dados simulados para demonstração
  const simulatedHistory = {
    'RSI_DIVERGENCE': {
      winRate: 0.76,
      recentWinRate: 0.71,
      volatilityPerformance: {low: 0.65, medium: 0.76, high: 0.52},
      marketConditionPerformance: {
        'SIDEWAYS': 0.82,
        'VOLATILE': 0.68,
        'TREND_UP': 0.58,
        'TREND_DOWN': 0.61,
        'STRONG_TREND_UP': 0.42,
        'STRONG_TREND_DOWN': 0.46
      }
    },
    'MACD_CROSSOVER': {
      winRate: 0.68,
      recentWinRate: 0.65,
      volatilityPerformance: {low: 0.52, medium: 0.70, high: 0.61},
      marketConditionPerformance: {
        'SIDEWAYS': 0.55,
        'VOLATILE': 0.62,
        'TREND_UP': 0.78,
        'TREND_DOWN': 0.76,
        'STRONG_TREND_UP': 0.72,
        'STRONG_TREND_DOWN': 0.71
      }
    },
    'BOLLINGER_BREAKOUT': {
      winRate: 0.72,
      recentWinRate: 0.77,
      volatilityPerformance: {low: 0.45, medium: 0.68, high: 0.89},
      marketConditionPerformance: {
        'SIDEWAYS': 0.51,
        'VOLATILE': 0.88,
        'TREND_UP': 0.65,
        'TREND_DOWN': 0.64,
        'STRONG_TREND_UP': 0.59,
        'STRONG_TREND_DOWN': 0.56
      }
    },
    'SUPPORT_RESISTANCE': {
      winRate: 0.79,
      recentWinRate: 0.73,
      volatilityPerformance: {low: 0.82, medium: 0.75, high: 0.48},
      marketConditionPerformance: {
        'SIDEWAYS': 0.89,
        'VOLATILE': 0.52,
        'TREND_UP': 0.62,
        'TREND_DOWN': 0.65,
        'STRONG_TREND_UP': 0.51,
        'STRONG_TREND_DOWN': 0.54
      }
    },
    'TREND_FOLLOWING': {
      winRate: 0.81,
      recentWinRate: 0.84,
      volatilityPerformance: {low: 0.72, medium: 0.80, high: 0.65},
      marketConditionPerformance: {
        'SIDEWAYS': 0.50,
        'VOLATILE': 0.59,
        'TREND_UP': 0.85,
        'TREND_DOWN': 0.83,
        'STRONG_TREND_UP': 0.92,
        'STRONG_TREND_DOWN': 0.90
      }
    },
    'FIBONACCI_RETRACEMENT': {
      winRate: 0.75,
      recentWinRate: 0.69,
      volatilityPerformance: {low: 0.66, medium: 0.78, high: 0.59},
      marketConditionPerformance: {
        'SIDEWAYS': 0.75,
        'VOLATILE': 0.61,
        'TREND_UP': 0.72,
        'TREND_DOWN': 0.70,
        'STRONG_TREND_UP': 0.62,
        'STRONG_TREND_DOWN': 0.65
      }
    },
    'ICHIMOKU_CLOUD': {
      winRate: 0.78,
      recentWinRate: 0.81,
      volatilityPerformance: {low: 0.73, medium: 0.79, high: 0.64},
      marketConditionPerformance: {
        'SIDEWAYS': 0.60,
        'VOLATILE': 0.58,
        'TREND_UP': 0.81,
        'TREND_DOWN': 0.83,
        'STRONG_TREND_UP': 0.88,
        'STRONG_TREND_DOWN': 0.89
      }
    }
  };
  
  // Cache por 1 hora
  cacheService.set(cacheKey, simulatedHistory, 3600);
  
  return simulatedHistory;
};
