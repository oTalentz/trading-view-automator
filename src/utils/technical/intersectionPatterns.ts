
/**
 * Utility for detecting price pattern intersections in chart data
 * Identifies bullish and bearish patterns that can indicate potential reversals or continuations
 */

export interface IntersectionPatternResult {
  bullishPatterns: number;
  bearishPatterns: number;
  patterns: string[];
}

/**
 * Analyzes price data to find intersection patterns like crosses, engulfing candles,
 * and other technical pattern formations
 */
export const findIntersectionPatterns = (prices: number[]): IntersectionPatternResult => {
  if (prices.length < 10) {
    return { bullishPatterns: 0, bearishPatterns: 0, patterns: [] };
  }

  let bullishPatterns = 0;
  let bearishPatterns = 0;
  const detectedPatterns: string[] = [];

  // Pegar últimos 10 preços para análise de padrões
  const recentPrices = prices.slice(-10);
  
  // 1. Verificar padrão de cruzamento (preço cruza média móvel simples de 5 períodos)
  const sma5 = calculateSimpleMA(recentPrices, 5);
  const currentPrice = recentPrices[recentPrices.length - 1];
  const previousPrice = recentPrices[recentPrices.length - 2];
  
  if (previousPrice < sma5 && currentPrice > sma5) {
    bullishPatterns += 1;
    detectedPatterns.push('Cruzamento MA Bullish');
  } else if (previousPrice > sma5 && currentPrice < sma5) {
    bearishPatterns += 1;
    detectedPatterns.push('Cruzamento MA Bearish');
  }
  
  // 2. Verificar padrão de engolfo (candle atual 'engole' o anterior)
  const pricesWithHLC = simulateHLCFromClose(recentPrices);
  for (let i = 1; i < pricesWithHLC.length; i++) {
    const current = pricesWithHLC[i];
    const previous = pricesWithHLC[i-1];
    
    // Engolfo de alta (bullish engulfing)
    if (current.close > current.open && 
        previous.close < previous.open &&
        current.open < previous.close && 
        current.close > previous.open) {
      bullishPatterns += 1;
      if (i === pricesWithHLC.length - 1) detectedPatterns.push('Engolfo Bullish');
    }
    
    // Engolfo de baixa (bearish engulfing)
    if (current.close < current.open && 
        previous.close > previous.open &&
        current.open > previous.close && 
        current.close < previous.open) {
      bearishPatterns += 1;
      if (i === pricesWithHLC.length - 1) detectedPatterns.push('Engolfo Bearish');
    }
  }
  
  // 3. Verificar padrão de doji (indecisão)
  const latestCandle = pricesWithHLC[pricesWithHLC.length - 1];
  if (Math.abs(latestCandle.close - latestCandle.open) / 
      (latestCandle.high - latestCandle.low) < 0.1) {
    if (recentPrices[recentPrices.length - 2] > recentPrices[recentPrices.length - 3]) {
      bearishPatterns += 1;
      detectedPatterns.push('Doji após alta');
    } else {
      bullishPatterns += 1;
      detectedPatterns.push('Doji após baixa');
    }
  }
  
  // 4. Verificar padrão de três soldados brancos ou três corvos negros
  let whiteSoldiers = 0;
  let blackCrows = 0;
  
  for (let i = recentPrices.length - 3; i < recentPrices.length; i++) {
    if (i > 0 && recentPrices[i] > recentPrices[i-1]) {
      whiteSoldiers++;
    } else if (i > 0 && recentPrices[i] < recentPrices[i-1]) {
      blackCrows++;
    }
  }
  
  if (whiteSoldiers === 3) {
    bullishPatterns += 2;
    detectedPatterns.push('Três Soldados Brancos');
  } else if (blackCrows === 3) {
    bearishPatterns += 2;
    detectedPatterns.push('Três Corvos Negros');
  }
  
  return {
    bullishPatterns,
    bearishPatterns,
    patterns: detectedPatterns
  };
};

// Função auxiliar para calcular média móvel simples
const calculateSimpleMA = (prices: number[], period: number): number => {
  if (prices.length < period) return prices[prices.length - 1];
  
  const recentPrices = prices.slice(-period);
  return recentPrices.reduce((sum, price) => sum + price, 0) / period;
};

// Função para simular dados OHLC a partir apenas dos preços de fechamento
// Necessário para análise de padrões de candles
interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
}

const simulateHLCFromClose = (closePrices: number[]): CandleData[] => {
  return closePrices.map((close, index) => {
    // Para o primeiro preço, usamos o mesmo valor para tudo
    if (index === 0) {
      return {
        open: close,
        high: close * 1.005,
        low: close * 0.995,
        close
      };
    }
    
    const previous = closePrices[index - 1];
    const open = previous;
    const high = Math.max(open, close) * 1.005;
    const low = Math.min(open, close) * 0.995;
    
    return { open, high, low, close };
  });
};
