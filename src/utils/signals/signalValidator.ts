
import { MarketCondition, TrendStrength } from '@/utils/technical/enums';
import { calculateVolatility } from '@/utils/technical/volatility';
import { findSupportResistanceLevels } from '@/utils/technicalAnalysis';

/**
 * Sistema avançado de validação de sinais que aplica múltiplas camadas de verificação
 * para reduzir falsos sinais e aumentar a precisão das operações
 */
export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  reasons: string[];
  warningLevel: 'none' | 'low' | 'medium' | 'high';
}

/**
 * Valida um sinal usando múltiplos critérios técnicos
 */
export const validateSignal = (
  direction: 'CALL' | 'PUT',
  prices: number[],
  volume: number[],
  rsiValue: number,
  macdData: { macdLine: number; signalLine: number; histogram: number; previousHistogram?: number },
  marketCondition: MarketCondition,
  trendStrength: number,
  volatility: number
): ValidationResult => {
  const reasons: string[] = [];
  let confidence = 70; // Confiança base
  
  // Validação 1: Verificar divergências de preço e RSI
  const hasRsiDivergence = checkRsiDivergence(prices, rsiValue, direction);
  if (hasRsiDivergence) {
    confidence += 10;
    reasons.push(`Divergência de RSI confirmada: ${direction}`);
  }
  
  // Validação 2: Verificar condição de mercado x direção
  const isMarketConditionAligned = isSignalAlignedWithMarket(direction, marketCondition);
  if (isMarketConditionAligned) {
    confidence += 12;
    reasons.push(`Alinhamento com condição de mercado: ${marketCondition}`);
  } else {
    confidence -= 15;
    reasons.push(`Sinal contra tendência principal do mercado: ${marketCondition}`);
  }
  
  // Validação 3: Verificar força da tendência
  if (trendStrength > 75) {
    confidence += 8;
    reasons.push(`Tendência forte detectada: ${trendStrength}`);
  } else if (trendStrength < 40) {
    confidence -= 10;
    reasons.push(`Tendência fraca: ${trendStrength}`);
  }
  
  // Validação 4: Verificar níveis de suporte/resistência
  const { support, resistance } = findSupportResistanceLevels(prices);
  const currentPrice = prices[prices.length - 1];
  const priceToSupportDistance = (currentPrice - support) / support;
  const priceToResistanceDistance = (resistance - currentPrice) / currentPrice;
  
  if (direction === 'CALL' && priceToSupportDistance < 0.005) {
    confidence += 15;
    reasons.push(`Preço próximo ao suporte (${(priceToSupportDistance * 100).toFixed(2)}%)`);
  } else if (direction === 'PUT' && priceToResistanceDistance < 0.005) {
    confidence += 15;
    reasons.push(`Preço próximo à resistência (${(priceToResistanceDistance * 100).toFixed(2)}%)`);
  }
  
  // Validação 5: Verificar momentum do MACD
  if (direction === 'CALL' && 
      macdData.histogram > 0 && 
      macdData.previousHistogram !== undefined && 
      macdData.histogram > macdData.previousHistogram) {
    confidence += 12;
    reasons.push('Momentum positivo do MACD crescente');
  } else if (direction === 'PUT' && 
            macdData.histogram < 0 && 
            macdData.previousHistogram !== undefined && 
            macdData.histogram < macdData.previousHistogram) {
    confidence += 12;
    reasons.push('Momentum negativo do MACD crescente');
  }
  
  // Validação 6: Verificar volume
  const volumeTrend = checkVolumeTrend(volume, 5);
  if (volumeTrend > 1.3) {
    confidence += 10;
    reasons.push(`Volume crescente: ${volumeTrend.toFixed(2)}x média`);
  } else if (volumeTrend < 0.7) {
    confidence -= 8;
    reasons.push(`Volume baixo: ${volumeTrend.toFixed(2)}x média`);
  }
  
  // Validação 7: Filtro de volatilidade
  if (volatility > 0.020) {
    confidence -= Math.min(Math.round(volatility * 500), 25);
    reasons.push(`Alta volatilidade detectada: ${(volatility * 100).toFixed(2)}%`);
  } else if (volatility < 0.005) {
    confidence += 5;
    reasons.push(`Baixa volatilidade, maior previsibilidade: ${(volatility * 100).toFixed(2)}%`);
  }
  
  // Validação 8: Verificar padrões de candles
  const hasPatterns = checkCandlePatterns(prices, direction);
  if (hasPatterns.detected) {
    confidence += 15;
    reasons.push(`Padrão de candles detectado: ${hasPatterns.pattern}`);
  }
  
  // Validação 9: Verificar sinais anteriores
  const priceMovement = (prices[prices.length - 1] - prices[prices.length - 10]) / prices[prices.length - 10];
  if ((direction === 'CALL' && priceMovement > 0.03) || 
      (direction === 'PUT' && priceMovement < -0.03)) {
    confidence -= 10;
    reasons.push(`Possível entrada tardia, movimento de preço significativo recente: ${(priceMovement * 100).toFixed(2)}%`);
  }
  
  // Assegurar range de confiança entre 0-100
  confidence = Math.min(Math.max(confidence, 0), 100);
  
  // Determinar nível de aviso com base na confiança
  let warningLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  if (confidence < 60) warningLevel = 'high';
  else if (confidence < 70) warningLevel = 'medium';
  else if (confidence < 80) warningLevel = 'low';
  
  // Fazer a validação final
  return {
    isValid: confidence >= 65,
    confidence,
    reasons,
    warningLevel
  };
};

/**
 * Verifica se existe divergência entre preço e RSI
 */
const checkRsiDivergence = (prices: number[], rsiValue: number, direction: 'CALL' | 'PUT'): boolean => {
  if (prices.length < 10) return false;
  
  const recentPrices = prices.slice(-10);
  const priceHigh = Math.max(...recentPrices);
  const priceLow = Math.min(...recentPrices);
  const currentPrice = prices[prices.length - 1];
  
  // Divergência altista: preço faz mínimas mais baixas, mas RSI não
  if (direction === 'CALL' && 
      currentPrice <= priceLow * 1.005 && 
      rsiValue > 30 && rsiValue <= 45) {
    return true;
  }
  
  // Divergência baixista: preço faz máximas mais altas, mas RSI não
  if (direction === 'PUT' && 
      currentPrice >= priceHigh * 0.995 && 
      rsiValue < 70 && rsiValue >= 55) {
    return true;
  }
  
  return false;
};

/**
 * Verifica se a direção do sinal está alinhada com a condição de mercado
 */
const isSignalAlignedWithMarket = (direction: 'CALL' | 'PUT', marketCondition: MarketCondition): boolean => {
  switch (marketCondition) {
    case MarketCondition.STRONG_TREND_UP:
    case MarketCondition.TREND_UP:
      return direction === 'CALL';
    case MarketCondition.STRONG_TREND_DOWN:
    case MarketCondition.TREND_DOWN:
      return direction === 'PUT';
    case MarketCondition.SIDEWAYS:
      return true; // Em mercados laterais, qualquer direção pode ser válida
    case MarketCondition.VOLATILE:
      return false; // Em mercados voláteis, exigimos mais confirmações
    default:
      return false;
  }
};

/**
 * Analisa a tendência de volume
 * @returns Relação entre volume atual e média de volumes
 */
const checkVolumeTrend = (volume: number[], periods: number = 5): number => {
  if (volume.length < periods + 1) return 1.0;
  
  const recentVolumes = volume.slice(-periods - 1, -1);
  const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / periods;
  const currentVolume = volume[volume.length - 1];
  
  return currentVolume / avgVolume;
};

/**
 * Detecta padrões de candles básicos
 */
const checkCandlePatterns = (prices: number[], direction: 'CALL' | 'PUT'): { detected: boolean; pattern: string } => {
  if (prices.length < 5) return { detected: false, pattern: '' };
  
  const last3Prices = prices.slice(-3);
  const priceChanges = [
    (last3Prices[1] - last3Prices[0]) / last3Prices[0],
    (last3Prices[2] - last3Prices[1]) / last3Prices[1]
  ];
  
  // Detectar padrão de reversão para CALL
  if (direction === 'CALL' && 
      priceChanges[0] < -0.005 && 
      Math.abs(priceChanges[1]) < 0.003) {
    return { detected: true, pattern: 'Martelo' };
  }
  
  // Detectar padrão de reversão para PUT
  if (direction === 'PUT' && 
      priceChanges[0] > 0.005 && 
      Math.abs(priceChanges[1]) < 0.003) {
    return { detected: true, pattern: 'Estrela Cadente' };
  }
  
  // Verificar padrão de engolfo
  if ((direction === 'CALL' && 
       priceChanges[0] < -0.005 && 
       priceChanges[1] > Math.abs(priceChanges[0])) ||
      (direction === 'PUT' && 
       priceChanges[0] > 0.005 && 
       priceChanges[1] < -Math.abs(priceChanges[0]))) {
    return { detected: true, pattern: 'Engolfo' };
  }
  
  return { detected: false, pattern: '' };
};
