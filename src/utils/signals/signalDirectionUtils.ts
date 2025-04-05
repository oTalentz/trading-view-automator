
import { MarketCondition, MACDData, type BollingerBands } from '@/utils/technicalAnalysis';

/**
 * Determina a direção do sinal (CALL ou PUT) com base em múltiplos indicadores técnicos
 * e análise de sentimento (opcional)
 */
export const determineSignalDirection = (
  marketCondition: MarketCondition,
  prices: number[],
  volumes: number[],
  bollingerBands: BollingerBands,
  rsi: number,
  macd: MACDData,
  trendStrength: number,
  sentimentScore?: number
): 'CALL' | 'PUT' => {
  let bullishSignals = 0;
  let bearishSignals = 0;
  
  // 1. Analisar condição geral do mercado (peso 2)
  if (marketCondition === MarketCondition.STRONG_TREND_UP || marketCondition === MarketCondition.TREND_UP) {
    bullishSignals += 2;
  } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || marketCondition === MarketCondition.TREND_DOWN) {
    bearishSignals += 2;
  }
  
  // 2. Analisar RSI (peso 1)
  if (rsi > 50 && rsi < 70) {
    bullishSignals += 1;
  } else if (rsi >= 70) {
    bearishSignals += 0.5; // Sobrecomprado pode indicar reversão
  } else if (rsi < 50 && rsi > 30) {
    bearishSignals += 1;
  } else if (rsi <= 30) {
    bullishSignals += 0.5; // Sobrevendido pode indicar reversão
  }
  
  // 3. Analisar MACD (peso 1.5)
  if (macd.histogram > 0 && macd.histogram > macd.previousHistogram) {
    bullishSignals += 1.5; // Histograma positivo e crescente
  } else if (macd.histogram < 0 && macd.histogram < macd.previousHistogram) {
    bearishSignals += 1.5; // Histograma negativo e decrescente
  } else if (macd.histogram > 0) {
    bullishSignals += 0.7; // Histograma positivo apenas
  } else if (macd.histogram < 0) {
    bearishSignals += 0.7; // Histograma negativo apenas
  }
  
  // 4. Analisar Bollinger Bands (peso 1.5)
  const currentPrice = prices[prices.length - 1];
  if (bollingerBands.percentB > 0.8) {
    bearishSignals += 0.8; // Preço próximo à banda superior - possível sobrecompra
  } else if (bollingerBands.percentB < 0.2) {
    bullishSignals += 0.8; // Preço próximo à banda inferior - possível sobrevenda
  } else if (bollingerBands.percentB > 0.5 && bollingerBands.percentB < 0.8) {
    bullishSignals += 1.2; // Preço acima da média mas não sobrecomprado
  } else if (bollingerBands.percentB < 0.5 && bollingerBands.percentB > 0.2) {
    bearishSignals += 1.2; // Preço abaixo da média mas não sobrevendido
  }
  
  // 5. Analisar força da tendência (peso 1.5)
  if (trendStrength > 70) {
    // Tendência forte - mais peso para a direção atual
    if (marketCondition === MarketCondition.STRONG_TREND_UP || marketCondition === MarketCondition.TREND_UP) {
      bullishSignals += 1.5;
    } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || marketCondition === MarketCondition.TREND_DOWN) {
      bearishSignals += 1.5;
    }
  }
  
  // 6. Análise de velas (peso 1)
  // Verifica formações de reversão ou continuação
  const priceChange = prices[prices.length - 1] - prices[prices.length - 2];
  const priceChangePercent = priceChange / prices[prices.length - 2] * 100;
  
  if (priceChangePercent > 1) {
    bullishSignals += 1; // Vela de alta significativa
  } else if (priceChangePercent < -1) {
    bearishSignals += 1; // Vela de baixa significativa
  }
  
  // 7. Análise de volume (peso 1)
  const currentVolume = volumes[volumes.length - 1];
  const previousVolume = volumes[volumes.length - 2];
  const avgVolume = volumes.slice(-5).reduce((sum, vol) => sum + vol, 0) / 5;
  
  if (priceChange > 0 && currentVolume > avgVolume) {
    bullishSignals += 1; // Alta com volume acima da média
  } else if (priceChange < 0 && currentVolume > avgVolume) {
    bearishSignals += 1; // Queda com volume acima da média
  }
  
  // 8. Incluir influência do sentimento, se disponível (peso 1)
  if (typeof sentimentScore === 'number') {
    if (sentimentScore > 30) {
      bullishSignals += 1;
    } else if (sentimentScore < -30) {
      bearishSignals += 1;
    } else if (sentimentScore > 0) {
      bullishSignals += sentimentScore / 50; // Proporcional ao score
    } else if (sentimentScore < 0) {
      bearishSignals += Math.abs(sentimentScore) / 50; // Proporcional ao score
    }
  }
  
  // Determinar direção com base na pontuação total
  return bullishSignals > bearishSignals ? 'CALL' : 'PUT';
};
