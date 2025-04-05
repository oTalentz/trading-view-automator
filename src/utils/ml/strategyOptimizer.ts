
import { 
  MarketCondition, 
  MACDData, 
  type BollingerBands 
} from '@/utils/technicalAnalysis';
import { StrategyWithDetails } from '../strategy/types';
import { cacheService } from '../cacheSystem';
import { getStrategyWithDetails } from '../strategy/utils/strategyDetailsUtils';

/**
 * Seleciona a estratégia mais adequada usando modelos de ML
 * Simula um modelo de ML em vez de ter um modelo real
 */
export const getMLStrategySelection = (
  marketCondition: MarketCondition,
  prices: number[],
  volume: number[],
  rsi: number,
  macd: MACDData,
  bollingerBands: BollingerBands,
  volatility: number,
  trendStrength: number,
  sentimentData: null = null
): StrategyWithDetails | null => {
  // Verificar cache para resultados anteriores
  const cacheKey = cacheService.generateKey('ml-strategy', {
    marketCondition,
    priceLength: prices.length,
    lastPrice: prices[prices.length - 1],
    rsi,
    macd: macd.histogram,
    volatility,
    trendStrength
  });
  
  const cachedResult = cacheService.get<StrategyWithDetails>(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }
  
  // Lógica de seleção simulada baseada em condições de mercado
  // Em um ambiente real, isso seria substituído por um modelo de ML treinado
  
  let selectedStrategy: StrategyWithDetails | null = null;
  
  // Simular seleção baseada nas condições de mercado
  if (marketCondition === MarketCondition.TREND_UP || marketCondition === MarketCondition.STRONG_TREND_UP) {
    if (rsi < 70) {  // Não está sobrecomprado
      selectedStrategy = getStrategyWithDetails(
        'TREND_FOLLOWING',
        75,
        [
          'Tendência de alta detectada',
          'RSI mostra força sem sobrecompra',
          'Volume confirma movimento'
        ]
      );
    } else {
      selectedStrategy = getStrategyWithDetails(
        'FIBONACCI_RETRACEMENT',
        70,
        [
          'Mercado em alta mas sobrecomprado',
          'Possível retração detectada',
          'Níveis de Fibonacci sugerem pontos de entrada'
        ]
      );
    }
  } else if (marketCondition === MarketCondition.TREND_DOWN || marketCondition === MarketCondition.STRONG_TREND_DOWN) {
    if (rsi > 30) {  // Não está sobrevendido
      selectedStrategy = getStrategyWithDetails(
        'SUPPORT_RESISTANCE',
        72,
        [
          'Tendência de baixa confirmada',
          'Pressão de venda contínua',
          'Possíveis pontos de suporte identificados'
        ]
      );
    } else {
      selectedStrategy = getStrategyWithDetails(
        'RSI_DIVERGENCE',
        68,
        [
          'RSI em região de sobrevenda',
          'Possível divergência RSI-preço',
          'Volume decrescente na queda'
        ]
      );
    }
  } else if (marketCondition === MarketCondition.SIDEWAYS) {
    // Em mercado lateral, escolher com base na volatilidade
    if (volatility > 0.8) {
      selectedStrategy = getStrategyWithDetails(
        'BOLLINGER_BREAKOUT',
        65,
        [
          'Alta volatilidade em mercado lateral',
          'Possibilidade de rompimento iminente',
          'Bandas de Bollinger apertadas'
        ]
      );
    } else {
      selectedStrategy = getStrategyWithDetails(
        'MACD_CROSSOVER',
        70,
        [
          'Movimento lateral com baixa volatilidade',
          'MACD próximo de cruzamento',
          'Padrão de consolidação identificado'
        ]
      );
    }
  } else {
    // Incerto/Indefinido
    selectedStrategy = getStrategyWithDetails(
      'ICHIMOKU_CLOUD',
      60,
      [
        'Mercado em transição de tendência',
        'Múltiplos timeframes conflitantes',
        'Ichimoku provê visão de múltiplos fatores'
      ]
    );
  }
  
  // Armazene em cache por 5 minutos
  if (selectedStrategy) {
    cacheService.set(cacheKey, selectedStrategy, 300);
  }
  
  return selectedStrategy;
};
