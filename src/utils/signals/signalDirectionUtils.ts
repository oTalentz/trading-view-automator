
import { MarketCondition } from '@/utils/technical/enums';
import { findIntersectionPatterns } from '@/utils/technical/intersectionPatterns';

/**
 * Determina a direção do sinal (CALL ou PUT) com base em múltiplos indicadores técnicos
 * e dados de sentimento, se disponíveis, para uma análise mais abrangente
 */
export const determineSignalDirection = (
  marketCondition: MarketCondition,
  prices: number[],
  volume: number[],
  bollingerBands: any,
  rsiValue: number,
  macdData: { macdLine: number; signalLine: number; histogram: number; previousHistogram?: number },
  trendStrength: number,
  sentimentScore?: number | null
): 'CALL' | 'PUT' => {
  let callSignals = 0;
  let putSignals = 0;
  
  // 1. Análise de tendência de mercado
  if (marketCondition === MarketCondition.STRONG_TREND_UP || marketCondition === MarketCondition.TREND_UP) {
    callSignals += 2;
  } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || marketCondition === MarketCondition.TREND_DOWN) {
    putSignals += 2;
  }
  
  // 2. Análise de preço em relação às Bandas de Bollinger
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2];
  
  if (currentPrice < bollingerBands.lower && previousPrice < currentPrice) {
    callSignals += 2; // Possível reversão de baixa para alta próximo à banda inferior
  } else if (currentPrice > bollingerBands.upper && previousPrice > currentPrice) {
    putSignals += 2; // Possível reversão de alta para baixa próximo à banda superior
  }
  
  // 3. Análise de RSI
  if (rsiValue < 30) {
    callSignals += 1; // Condição de sobrevenda
  } else if (rsiValue > 70) {
    putSignals += 1; // Condição de sobrecompra
  }
  
  // 4. Análise de MACD
  if (macdData.macdLine > macdData.signalLine && macdData.histogram > 0) {
    callSignals += 1;
  } else if (macdData.macdLine < macdData.signalLine && macdData.histogram < 0) {
    putSignals += 1;
  }
  
  // Verificar se o histograma está aumentando (mais positivo ou menos negativo)
  if (macdData.previousHistogram !== undefined) {
    if (macdData.histogram > macdData.previousHistogram) {
      callSignals += 1;
    } else if (macdData.histogram < macdData.previousHistogram) {
      putSignals += 1;
    }
  }
  
  // 5. Padrões de interseção
  const intersectionPatterns = findIntersectionPatterns(prices);
  if (intersectionPatterns.bullishPatterns > intersectionPatterns.bearishPatterns) {
    callSignals += intersectionPatterns.bullishPatterns;
  } else if (intersectionPatterns.bearishPatterns > intersectionPatterns.bullishPatterns) {
    putSignals += intersectionPatterns.bearishPatterns;
  }
  
  // 6. Força da tendência
  if (trendStrength > 70) {
    // Tendência forte: reforçar sinais na direção da tendência
    if (callSignals > putSignals) {
      callSignals += 1;
    } else if (putSignals > callSignals) {
      putSignals += 1;
    }
  }
  
  // 7. Análise de volume
  const volumeIncreasing = volume[volume.length - 1] > volume[volume.length - 2];
  if (volumeIncreasing && currentPrice > previousPrice) {
    callSignals += 1; // Volume crescente em alta de preço confirma tendência de alta
  } else if (volumeIncreasing && currentPrice < previousPrice) {
    putSignals += 1; // Volume crescente em queda de preço confirma tendência de baixa
  }
  
  // 8. Incorporação de dados de sentimento de mercado
  if (sentimentScore !== undefined && sentimentScore !== null) {
    // Sentimento positivo forte contribui para sinal de CALL
    if (sentimentScore > 40) {
      callSignals += 1;
    }
    // Sentimento positivo muito forte
    else if (sentimentScore > 70) {
      callSignals += 2;
    }
    // Sentimento negativo forte contribui para sinal de PUT
    else if (sentimentScore < -40) {
      putSignals += 1;
    }
    // Sentimento negativo muito forte
    else if (sentimentScore < -70) {
      putSignals += 2;
    }
  }
  
  // Determinar direção com base na quantidade de sinais
  if (callSignals > putSignals) {
    return 'CALL';
  } else if (putSignals > callSignals) {
    return 'PUT';
  } else {
    // Em caso de empate, usar tendência recente como desempate
    const shortTermTrend = prices[prices.length - 1] > prices[prices.length - 5] ? 'CALL' : 'PUT';
    return shortTermTrend;
  }
};
