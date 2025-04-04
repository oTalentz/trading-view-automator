
import { MarketCondition } from '@/utils/technicalAnalysis';
import { MARKET_CONDITION_STRATEGIES } from '@/constants/tradingStrategies';
import { optimizeStrategySelection } from '@/utils/ml/strategyOptimizer';
import { SentimentAnalysisResult } from '@/utils/sentiment/sentimentAnalyzer';
import { StrategyWithDetails } from './types';
import { loadStrategyPerformanceHistory } from './history/strategyPerformanceHistory';
import { getStrategyWithDetails, getStrategyName } from './utils/strategyDetailsUtils';
import { ADVANCED_STRATEGIES } from './data/advancedStrategies';
import { getCachedStrategy, generateStrategySelectionCacheKey, cacheStrategy } from './cache/strategyCacheUtils';
import { selectTraditionalStrategy } from './traditional/traditionalStrategySelector';

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
): StrategyWithDetails => {
  // Obtem estratégias compatíveis para a condição atual de mercado
  const compatibleStrategies = MARKET_CONDITION_STRATEGIES[marketCondition] || 
    MARKET_CONDITION_STRATEGIES.SIDEWAYS; // Default para lateral se condição não encontrada
  
  // Verificar cache primeiro para evitar cálculos repetidos
  const cacheKey = generateStrategySelectionCacheKey(
    marketCondition, 
    rsiValue, 
    macdData, 
    volatility, 
    sentimentData
  );
  
  const cachedStrategy = getCachedStrategy(
    marketCondition, 
    rsiValue, 
    macdData, 
    volatility, 
    sentimentData
  );
  
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
      if (strategy.alternativeStrategies && optimizedSelection.alternativeStrategies) {
        strategy.alternativeStrategies = optimizedSelection.alternativeStrategies.map(alt => ({
          name: getStrategyName(alt.strategyKey),
          confidenceScore: alt.confidenceScore
        }));
      }
      
      // Cache por 5 minutos
      cacheStrategy(cacheKey, strategy, 300);
      
      return strategy;
    } catch (error) {
      console.error("Error using ML strategy optimizer:", error);
      // Fallback para método tradicional
    }
  }
  
  // Método tradicional de fallback (sem ML)
  const topStrategy = selectTraditionalStrategy(
    compatibleStrategies,
    prices,
    volume,
    rsiValue,
    macdData,
    bbands,
    volatility
  );
  
  // Cache por 5 minutos
  cacheStrategy(cacheKey, topStrategy, 300);
  
  return topStrategy;
};

