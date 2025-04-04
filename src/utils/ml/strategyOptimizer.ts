
/**
 * Sistema de aprendizado de máquina para seleção dinâmica de estratégias de trading
 * baseado em condições de mercado e histórico de desempenho
 */

import { MarketCondition } from '@/utils/technical/enums';
import { SentimentAnalysisResult } from '@/utils/sentiment/sentimentAnalyzer';
import { ADVANCED_STRATEGIES } from '@/constants/tradingStrategies';

interface MarketFeatures {
  rsiValue: number;
  macdHistogram: number;
  volatility: number;
  trendStrength: number;
  priceToSMA: number;
  volumeRatio: number;
  sentimentScore: number | null;
  timeOfDay: number; // Hora do dia (0-23)
  dayOfWeek: number; // Dia da semana (0-6)
  marketCondition: MarketCondition;
}

interface StrategyPerformance {
  strategyKey: string;
  recentWinRate: number;
  overallWinRate: number;
  confidenceScore: number;
  volatilityPerformance: number;
  marketConditionPerformance: Record<MarketCondition, number>;
  sentimentAlignmentScore: number;
}

export interface OptimizedStrategy {
  strategyKey: string;
  confidenceScore: number;
  reasons: string[];
  alternativeStrategies: {
    strategyKey: string;
    confidenceScore: number;
  }[];
}

/**
 * Otimiza a seleção de estratégia usando técnicas de ML
 */
export const optimizeStrategySelection = (
  compatibleStrategies: string[],
  prices: number[],
  volume: number[],
  rsiValue: number,
  macdData: any,
  bbands: any,
  volatility: number,
  trendStrength: number,
  marketCondition: MarketCondition,
  sentimentData: SentimentAnalysisResult | null,
  historicalPerformance: Record<string, any>
): OptimizedStrategy => {
  // Extrai características do mercado atual
  const features = extractMarketFeatures(
    prices, 
    volume, 
    rsiValue, 
    macdData, 
    volatility, 
    trendStrength,
    marketCondition,
    sentimentData
  );
  
  // Calcula a pontuação de desempenho para cada estratégia
  const performances = calculateStrategyPerformances(
    compatibleStrategies,
    features,
    historicalPerformance
  );
  
  // Classifica as estratégias com base na pontuação
  const rankedStrategies = performances.sort((a, b) => 
    b.confidenceScore - a.confidenceScore
  );
  
  // Seleciona a melhor estratégia e alternativas
  const bestStrategy = rankedStrategies[0];
  const alternativeStrategies = rankedStrategies.slice(1, 3).map(p => ({
    strategyKey: p.strategyKey,
    confidenceScore: p.confidenceScore
  }));
  
  // Gera razões para a seleção
  const reasons = generateSelectionReasons(bestStrategy, features);
  
  return {
    strategyKey: bestStrategy.strategyKey,
    confidenceScore: bestStrategy.confidenceScore,
    reasons,
    alternativeStrategies
  };
};

/**
 * Extrai características relevantes do mercado atual
 */
const extractMarketFeatures = (
  prices: number[],
  volume: number[],
  rsiValue: number,
  macdData: any,
  volatility: number,
  trendStrength: number,
  marketCondition: MarketCondition,
  sentimentData: SentimentAnalysisResult | null
): MarketFeatures => {
  // Calcula proporção de preço atual para SMA50
  const currentPrice = prices[prices.length - 1];
  const sma50 = prices.slice(-50).reduce((sum, price) => sum + price, 0) / Math.min(prices.length, 50);
  const priceToSMA = currentPrice / sma50;
  
  // Calcula proporção de volume atual para média
  const currentVolume = volume[volume.length - 1];
  const avgVolume = volume.slice(-20).reduce((sum, vol) => sum + vol, 0) / Math.min(volume.length, 20);
  const volumeRatio = currentVolume / avgVolume;
  
  // Obtém hora do dia e dia da semana
  const now = new Date();
  const timeOfDay = now.getHours();
  const dayOfWeek = now.getDay();
  
  return {
    rsiValue,
    macdHistogram: macdData.histogram,
    volatility,
    trendStrength,
    priceToSMA,
    volumeRatio,
    sentimentScore: sentimentData ? sentimentData.overallScore : null,
    timeOfDay,
    dayOfWeek,
    marketCondition
  };
};

/**
 * Calcula o desempenho de cada estratégia com base nas características atuais do mercado
 */
const calculateStrategyPerformances = (
  compatibleStrategies: string[],
  features: MarketFeatures,
  historicalPerformance: Record<string, any>
): StrategyPerformance[] => {
  return compatibleStrategies.map(strategyKey => {
    const strategy = ADVANCED_STRATEGIES[strategyKey as keyof typeof ADVANCED_STRATEGIES];
    const history = historicalPerformance[strategyKey] || { 
      winRate: 0.5, 
      recentWinRate: 0.5,
      volatilityPerformance: {low: 0.5, medium: 0.5, high: 0.5},
      marketConditionPerformance: {}
    };
    
    // Busca o desempenho histórico para a condição de mercado atual
    const marketConditionScore = history.marketConditionPerformance[features.marketCondition] || 0.5;
    
    // Determina categoria de volatilidade
    const volatilityCategory = features.volatility < 0.01 ? 'low' : 
                              features.volatility < 0.02 ? 'medium' : 'high';
    const volatilityScore = history.volatilityPerformance[volatilityCategory] || 0.5;
    
    // Calcula alinhamento de sentimento
    // Estratégias de tendência se beneficiam de sentimento alinhado com a direção do mercado
    const sentimentAlignmentScore = calculateSentimentAlignment(
      strategyKey, 
      features.marketCondition, 
      features.sentimentScore
    );
    
    // Calcula pontuação geral de confiança
    const confidenceScore = calculateConfidenceScore(
      strategyKey,
      features,
      history.recentWinRate || 0.5,
      history.winRate || 0.5,
      marketConditionScore,
      volatilityScore,
      sentimentAlignmentScore
    );
    
    return {
      strategyKey,
      recentWinRate: history.recentWinRate || 0.5,
      overallWinRate: history.winRate || 0.5,
      confidenceScore,
      volatilityPerformance: volatilityScore,
      marketConditionPerformance: history.marketConditionPerformance || {},
      sentimentAlignmentScore
    };
  });
};

/**
 * Calcula alinhamento entre sentimento e estratégia
 */
const calculateSentimentAlignment = (
  strategyKey: string,
  marketCondition: MarketCondition,
  sentimentScore: number | null
): number => {
  if (sentimentScore === null) return 0.5; // Neutro se não houver dados
  
  // Estratégias de tendência funcionam melhor quando alinhadas com sentimento
  if (strategyKey === 'TREND_FOLLOWING' || strategyKey === 'ICHIMOKU_CLOUD') {
    // Se mercado em alta e sentimento positivo (ou vice-versa), score alto
    if ((marketCondition === MarketCondition.TREND_UP || 
         marketCondition === MarketCondition.STRONG_TREND_UP) && 
        sentimentScore > 0) {
      return 0.8 + (Math.min(sentimentScore, 100) / 500); // Max 1.0
    }
    
    if ((marketCondition === MarketCondition.TREND_DOWN || 
         marketCondition === MarketCondition.STRONG_TREND_DOWN) && 
        sentimentScore < 0) {
      return 0.8 + (Math.min(Math.abs(sentimentScore), 100) / 500); // Max 1.0
    }
    
    // Sentimento contrário à tendência: score baixo
    return 0.3;
  }
  
  // Estratégias de suporte/resistência e reversão funcionam bem em mercados laterais,
  // independente do sentimento
  if (strategyKey === 'SUPPORT_RESISTANCE' || strategyKey === 'RSI_DIVERGENCE') {
    return 0.6;
  }
  
  // Para outras estratégias, pequeno impulso para sentimento forte
  return 0.5 + (Math.abs(sentimentScore) / 200); // Max 0.5 + 0.5 = 1.0
};

/**
 * Calcula a pontuação de confiança geral para uma estratégia
 */
const calculateConfidenceScore = (
  strategyKey: string,
  features: MarketFeatures,
  recentWinRate: number,
  overallWinRate: number,
  marketConditionScore: number,
  volatilityScore: number,
  sentimentAlignmentScore: number
): number => {
  // Pesos para cada fator
  const weights = {
    recentPerformance: 0.25,
    overallPerformance: 0.15,
    marketCondition: 0.20,
    volatility: 0.15,
    technicalIndicators: 0.15,
    sentiment: 0.10
  };
  
  // Pontuação baseada em indicadores técnicos específicos para cada estratégia
  const technicalScore = calculateTechnicalScore(strategyKey, features);
  
  // Cálculo da pontuação ponderada
  const weightedScore = (
    (recentWinRate * weights.recentPerformance) +
    (overallWinRate * weights.overallPerformance) +
    (marketConditionScore * weights.marketCondition) +
    (volatilityScore * weights.volatility) +
    (technicalScore * weights.technicalIndicators) +
    (sentimentAlignmentScore * weights.sentiment)
  );
  
  // Converte para escala 0-100
  return Math.round(weightedScore * 100);
};

/**
 * Calcula pontuação com base em indicadores técnicos para uma estratégia específica
 */
const calculateTechnicalScore = (strategyKey: string, features: MarketFeatures): number => {
  switch (strategyKey) {
    case 'RSI_DIVERGENCE':
      // RSI Divergence funciona melhor em condições de sobrecompra/sobrevenda
      return (features.rsiValue < 30 || features.rsiValue > 70) ? 0.9 : 0.5;
      
    case 'MACD_CROSSOVER':
      // MACD funciona melhor com histograma crescente/decrescente significativo
      return Math.min(0.9, 0.5 + Math.abs(features.macdHistogram) / 5);
    
    case 'BOLLINGER_BREAKOUT':
      // Breakouts funcionam melhor com alta volatilidade e volume
      return features.volatility > 0.015 && features.volumeRatio > 1.2 ? 0.85 : 0.5;
      
    case 'TREND_FOLLOWING':
      // Trend following funciona melhor com tendências fortes
      return features.trendStrength > 75 ? 0.95 : 
             features.trendStrength > 60 ? 0.8 : 
             features.trendStrength > 40 ? 0.6 : 0.4;
             
    case 'SUPPORT_RESISTANCE':
      // Suporte/Resistência funciona melhor em mercados laterais
      return features.marketCondition === MarketCondition.SIDEWAYS ? 0.85 : 0.6;
    
    case 'FIBONACCI_RETRACEMENT':
      // Fibonacci funciona bem após movimentos significativos
      return Math.abs(features.priceToSMA - 1) > 0.03 ? 0.8 : 0.6;
      
    case 'ICHIMOKU_CLOUD':
      // Ichimoku funciona melhor em tendências bem definidas
      return features.trendStrength > 70 ? 0.9 : 
             features.trendStrength > 50 ? 0.7 : 0.5;
      
    default:
      return 0.5;
  }
};

/**
 * Gera razões descritivas para a seleção da estratégia
 */
const generateSelectionReasons = (
  strategyPerformance: StrategyPerformance,
  features: MarketFeatures
): string[] => {
  const reasons: string[] = [];
  const strategyKey = strategyPerformance.strategyKey;
  const strategy = ADVANCED_STRATEGIES[strategyKey as keyof typeof ADVANCED_STRATEGIES];
  
  // Razão baseada no desempenho histórico
  if (strategyPerformance.recentWinRate > 0.65) {
    reasons.push(`Alta taxa de acerto recente (${Math.round(strategyPerformance.recentWinRate * 100)}%)`);
  }
  
  // Razão baseada na condição de mercado
  reasons.push(`Otimizado para condição de mercado atual: ${translateMarketCondition(features.marketCondition)}`);
  
  // Razões específicas por estratégia
  switch (strategyKey) {
    case 'RSI_DIVERGENCE':
      if (features.rsiValue < 30) {
        reasons.push(`RSI em condição de sobrevenda (${features.rsiValue.toFixed(1)})`);
      } else if (features.rsiValue > 70) {
        reasons.push(`RSI em condição de sobrecompra (${features.rsiValue.toFixed(1)})`);
      }
      break;
      
    case 'MACD_CROSSOVER':
      reasons.push(`Forte impulso no histograma do MACD (${features.macdHistogram.toFixed(4)})`);
      break;
      
    case 'BOLLINGER_BREAKOUT':
      if (features.volatility > 0.015) {
        reasons.push(`Volatilidade favorável para breakouts (${(features.volatility * 100).toFixed(1)}%)`);
      }
      if (features.volumeRatio > 1.2) {
        reasons.push(`Volume acima da média (${features.volumeRatio.toFixed(1)}x)`);
      }
      break;
      
    case 'TREND_FOLLOWING':
      reasons.push(`Força da tendência: ${features.trendStrength.toFixed(1)}`);
      break;
      
    case 'SUPPORT_RESISTANCE':
      reasons.push('Níveis de suporte/resistência significativos identificados');
      break;
      
    case 'FIBONACCI_RETRACEMENT':
      reasons.push(`Distância da média móvel favorável (${Math.abs(features.priceToSMA - 1).toFixed(3)})`);
      break;
      
    case 'ICHIMOKU_CLOUD':
      reasons.push(`Indicadores Ichimoku alinhados com a tendência (${features.trendStrength.toFixed(1)})`);
      break;
  }
  
  // Razão baseada em sentimento, se disponível
  if (features.sentimentScore !== null) {
    const sentimentDirection = features.sentimentScore > 20 ? 'positivo' : 
                               features.sentimentScore < -20 ? 'negativo' : 'neutro';
    
    if (Math.abs(features.sentimentScore) > 20) {
      reasons.push(`Sentimento de mercado ${sentimentDirection} (${features.sentimentScore})`);
    }
    
    if (strategyPerformance.sentimentAlignmentScore > 0.7) {
      reasons.push('Forte alinhamento entre sentimento e estratégia');
    }
  }
  
  return reasons;
};

/**
 * Traduz condição de mercado para descrição legível
 */
const translateMarketCondition = (condition: MarketCondition): string => {
  switch (condition) {
    case MarketCondition.STRONG_TREND_UP:
      return 'Tendência de alta forte';
    case MarketCondition.TREND_UP:
      return 'Tendência de alta';
    case MarketCondition.SIDEWAYS:
      return 'Mercado lateral';
    case MarketCondition.TREND_DOWN:
      return 'Tendência de baixa';
    case MarketCondition.STRONG_TREND_DOWN:
      return 'Tendência de baixa forte';
    case MarketCondition.VOLATILE:
      return 'Mercado volátil';
    default:
      return 'Desconhecida';
  }
};
