
import { 
  MarketCondition, 
  MACDData, 
  BollingerBands 
} from '@/utils/technicalAnalysis';
import { StrategyWithDetails } from '../strategy/types';
import { cacheService } from '../cacheSystem';

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
  sentimentData: null = null // Changed from SentimentAnalysisResult to null
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
  if (marketCondition === 'Bullish' || marketCondition === 'Strong Bullish') {
    if (rsi < 70) {  // Não está sobrecomprado
      selectedStrategy = {
        name: 'Trend Following',
        indicators: ['RSI', 'MACD', 'Moving Averages'],
        selectionReasons: [
          'Tendência de alta detectada',
          'RSI mostra força sem sobrecompra',
          'Volume confirma movimento'
        ]
      };
    } else {
      selectedStrategy = {
        name: 'Fibonacci Retracement',
        indicators: ['Fibonacci', 'RSI', 'Support/Resistance'],
        selectionReasons: [
          'Mercado em alta mas sobrecomprado',
          'Possível retração detectada',
          'Níveis de Fibonacci sugerem pontos de entrada'
        ]
      };
    }
  } else if (marketCondition === 'Bearish' || marketCondition === 'Strong Bearish') {
    if (rsi > 30) {  // Não está sobrevendido
      selectedStrategy = {
        name: 'Support/Resistance',
        indicators: ['RSI', 'Bollinger Bands', 'Volume'],
        selectionReasons: [
          'Tendência de baixa confirmada',
          'Pressão de venda contínua',
          'Possíveis pontos de suporte identificados'
        ]
      };
    } else {
      selectedStrategy = {
        name: 'RSI Divergence',
        indicators: ['RSI', 'Price Action', 'Volume'],
        selectionReasons: [
          'RSI em região de sobrevenda',
          'Possível divergência RSI-preço',
          'Volume decrescente na queda'
        ]
      };
    }
  } else if (marketCondition === 'Ranging') {
    // Em mercado lateral, escolher com base na volatilidade
    if (volatility > 0.8) {
      selectedStrategy = {
        name: 'Bollinger Breakout',
        indicators: ['Bollinger Bands', 'Volume', 'Volatility'],
        selectionReasons: [
          'Alta volatilidade em mercado lateral',
          'Possibilidade de rompimento iminente',
          'Bandas de Bollinger apertadas'
        ]
      };
    } else {
      selectedStrategy = {
        name: 'MACD Crossover',
        indicators: ['MACD', 'EMA', 'Volume'],
        selectionReasons: [
          'Movimento lateral com baixa volatilidade',
          'MACD próximo de cruzamento',
          'Padrão de consolidação identificado'
        ]
      };
    }
  } else {
    // Incerto/Indefinido
    selectedStrategy = {
      name: 'Ichimoku Cloud',
      indicators: ['Ichimoku', 'RSI', 'Volume Profile'],
      selectionReasons: [
        'Mercado em transição de tendência',
        'Múltiplos timeframes conflitantes',
        'Ichimoku provê visão de múltiplos fatores'
      ]
    };
  }
  
  // Armazene em cache por 5 minutos
  if (selectedStrategy) {
    cacheService.set(cacheKey, selectedStrategy, 300);
  }
  
  return selectedStrategy;
};
