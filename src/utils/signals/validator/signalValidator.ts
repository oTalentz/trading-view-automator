
import { MarketCondition } from '@/utils/technical/enums';
import { findSupportResistanceLevels } from '@/utils/technicalAnalysis';
import { ValidationResult } from './types';
import { checkRsiDivergence } from './rsiDivergence';
import { isSignalAlignedWithMarket } from './marketAlignment';
import { checkVolumeTrend } from './volumeAnalysis';
import { checkCandlePatterns } from './candlePatterns';

/**
 * Sistema avançado de validação de sinais que aplica múltiplas camadas de verificação
 * para reduzir falsos sinais e aumentar a precisão das operações
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
