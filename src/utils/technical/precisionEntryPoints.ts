
import { calculateMA, calculateEMA } from "./movingAverages";
import { calculateRSI } from "./indicators/rsi";
import { calculateBollingerBands } from "./indicators/bollingerBands";
import { MarketCondition, TrendStrength } from "./enums";
import { findSupportResistanceLevels } from "./supportResistance";

/**
 * Calcula o ponto de entrada ideal com base em uma análise detalhada de vários indicadores
 * @returns Objeto com informações sobre a qualidade e o momento preciso de entrada
 */
export const calculatePreciseEntryPoint = (
  prices: number[],
  volume: number[],
  marketCondition: MarketCondition,
  trendStrength: number,
  direction: 'CALL' | 'PUT'
) => {
  if (prices.length < 50) {
    return {
      confidenceScore: 70,
      entryQuality: 'Médio',
      idealTimingSeconds: 45,
      priceTarget: prices[prices.length - 1],
      stopLoss: direction === 'CALL' ? 
        prices[prices.length - 1] * 0.995 : 
        prices[prices.length - 1] * 1.005
    };
  }
  
  const currentPrice = prices[prices.length - 1];
  const rsi = calculateRSI(prices);
  const bbands = calculateBollingerBands(prices);
  const { support, resistance } = findSupportResistanceLevels(prices);
  
  // Calcula distância até níveis de suporte/resistência
  const distanceToSupport = Math.abs((currentPrice - support) / currentPrice * 100);
  const distanceToResistance = Math.abs((currentPrice - resistance) / currentPrice * 100);
  
  // Verifica padrões de vela (simplificado)
  const pricePattern = detectPricePattern(prices);
  
  // Análise de Momentum
  const momentum = calculateMomentum(prices, 14);
  
  // Qualidade da entrada com base no RSI
  let entryQuality = 'Médio';
  let idealTimingSeconds = 45; // Padrão: 45 segundos
  let confidenceScore = 75; // Pontuação base
  
  // Analisa condições ideais para CALL
  if (direction === 'CALL') {
    // Verifica condições ótimas para compra
    if (rsi < 40 && rsi > 20 && currentPrice < bbands.lower * 1.01) {
      entryQuality = 'Excelente';
      confidenceScore += 15;
      idealTimingSeconds = 15; // Entrada mais rápida para reversão de sobrevendido
    } 
    else if (marketCondition === MarketCondition.STRONG_TREND_UP && rsi > 45 && rsi < 70) {
      entryQuality = 'Muito Bom';
      confidenceScore += 10;
      idealTimingSeconds = 20;
    }
    else if (distanceToSupport < 0.5 && momentum > 0) {
      entryQuality = 'Bom';
      confidenceScore += 7;
      idealTimingSeconds = 30;
    }
    
    // Ajusta com base no padrão de preço
    if (pricePattern === 'hammerBullish' || pricePattern === 'bullishEngulfing') {
      entryQuality = entryQuality === 'Médio' ? 'Bom' : 'Excelente';
      confidenceScore += 8;
      idealTimingSeconds = Math.max(10, idealTimingSeconds - 10);
    }
  } 
  // Analisa condições ideais para PUT
  else {
    // Verifica condições ótimas para venda
    if (rsi > 70 && rsi < 90 && currentPrice > bbands.upper * 0.99) {
      entryQuality = 'Excelente';
      confidenceScore += 15;
      idealTimingSeconds = 15; // Entrada mais rápida para reversão de sobrecomprado
    }
    else if (marketCondition === MarketCondition.STRONG_TREND_DOWN && rsi < 60 && rsi > 30) {
      entryQuality = 'Muito Bom';
      confidenceScore += 10;
      idealTimingSeconds = 20;
    }
    else if (distanceToResistance < 0.5 && momentum < 0) {
      entryQuality = 'Bom';
      confidenceScore += 7;
      idealTimingSeconds = 30;
    }
    
    // Ajusta com base no padrão de preço
    if (pricePattern === 'shootingStarBearish' || pricePattern === 'bearishEngulfing') {
      entryQuality = entryQuality === 'Médio' ? 'Bom' : 'Excelente';
      confidenceScore += 8;
      idealTimingSeconds = Math.max(10, idealTimingSeconds - 10);
    }
  }
  
  // Ajusta idealTimingSeconds com base na volatilidade
  const volatility = calculateVolatility(prices, 14);
  const priceAvg = calculateMA(prices, 20);
  const volatilityRatio = volatility / priceAvg;
  
  if (volatilityRatio > 0.02) {
    // Mercado volátil: entrada mais rápida
    idealTimingSeconds = Math.max(5, idealTimingSeconds - 15);
  } else if (volatilityRatio < 0.005) {
    // Mercado calmo: entrada mais lenta
    idealTimingSeconds += 10;
  }
  
  // Limita a pontuação de confiança
  confidenceScore = Math.min(98, Math.max(60, confidenceScore));
  
  // Calcula stop loss dinâmico
  const stopLoss = direction === 'CALL' 
    ? currentPrice - (volatility * 2) 
    : currentPrice + (volatility * 2);
  
  // Calcula alvo de preço
  const priceTarget = direction === 'CALL'
    ? Math.min(resistance, currentPrice + (volatility * 3))
    : Math.max(support, currentPrice - (volatility * 3));
  
  return {
    confidenceScore,
    entryQuality,
    idealTimingSeconds,
    priceTarget,
    stopLoss
  };
};

/**
 * Calcula a volatilidade do mercado
 */
const calculateVolatility = (prices: number[], period: number = 14): number => {
  if (prices.length < period) return 0;
  
  const recentPrices = prices.slice(-period);
  const average = recentPrices.reduce((sum, price) => sum + price, 0) / period;
  
  const squaredDiffs = recentPrices.map(price => Math.pow(price - average, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / period;
  
  return Math.sqrt(variance);
};

/**
 * Calcula o momentum atual do mercado
 */
const calculateMomentum = (prices: number[], period: number = 14): number => {
  if (prices.length < period) return 0;
  
  const currentPrice = prices[prices.length - 1];
  const pastPrice = prices[prices.length - period];
  
  return ((currentPrice - pastPrice) / pastPrice) * 100;
};

/**
 * Detecta padrões de velas básicos
 */
const detectPricePattern = (prices: number[]): string => {
  if (prices.length < 5) return 'unknown';
  
  const len = prices.length;
  const current = prices[len - 1];
  const prev1 = prices[len - 2];
  const prev2 = prices[len - 3];
  
  // Detecção simplificada de padrões de vela
  
  // Padrões de alta
  if (prev1 < current && prev2 > prev1 && 
      (current - prev1) > (prev2 - prev1) * 1.5) {
    return 'bullishEngulfing';
  }
  
  if (prev1 < current && 
      (current - prev1) / prev1 > 0.01 && 
      (prev1 - Math.min(prices[len-4], prices[len-5])) / prev1 < 0.005) {
    return 'hammerBullish';
  }
  
  // Padrões de baixa
  if (prev1 > current && prev2 < prev1 && 
      (prev1 - current) > (prev1 - prev2) * 1.5) {
    return 'bearishEngulfing';
  }
  
  if (prev1 > current && 
      (prev1 - current) / prev1 > 0.01 && 
      (prev1 - Math.max(prices[len-4], prices[len-5])) / prev1 > -0.005) {
    return 'shootingStarBearish';
  }
  
  return 'unknown';
};
