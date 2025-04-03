
import { 
  MarketCondition, 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  determineMarketCondition,
  calculateTrendStrength,
  generateSimulatedMarketData
} from '@/utils/technicalAnalysis';
import { TimeframeAnalysis } from '@/types/timeframeAnalysis';

// Função para analisar um timeframe específico
export const analyzeTimeframe = (symbol: string, timeframe: string, label: string): TimeframeAnalysis => {
  const { prices, volume } = generateSimulatedMarketData(
    symbol + "_" + timeframe, // Adicionamos o timeframe ao símbolo para gerar dados diferentes
    100
  );
  
  // Análise técnica para este timeframe
  const marketCondition = determineMarketCondition(prices, volume);
  const { value: trendStrengthValue } = calculateTrendStrength(prices, volume);
  const rsiValue = calculateRSI(prices);
  const macdData = calculateMACD(prices);
  const bbands = calculateBollingerBands(prices);
  
  // Determina a direção com base nos indicadores técnicos
  let direction: 'CALL' | 'PUT';
  
  if (marketCondition === MarketCondition.STRONG_TREND_UP || 
      marketCondition === MarketCondition.TREND_UP) {
    direction = 'CALL';
  } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || 
            marketCondition === MarketCondition.TREND_DOWN) {
    direction = 'PUT';
  } else {
    // Para mercados laterais ou voláteis, usamos mais indicadores
    const currentPrice = prices[prices.length - 1];
    
    if (rsiValue < 30 && currentPrice < bbands.lower) {
      direction = 'CALL'; // Possível sobrevendido
    } else if (rsiValue > 70 && currentPrice > bbands.upper) {
      direction = 'PUT'; // Possível sobrecomprado
    } else if (macdData.histogram > 0 && macdData.histogram > macdData.histogram * 1.1) {
      direction = 'CALL'; // Momentum positivo
    } else if (macdData.histogram < 0 && macdData.histogram < macdData.histogram * 1.1) {
      direction = 'PUT'; // Momentum negativo
    } else {
      // Sem sinal claro, escolhemos com base em tendência de mais longo prazo
      direction = trendStrengthValue > 50 ? 'CALL' : 'PUT';
    }
  }
  
  // Calcula confiança baseada nos indicadores e condição do mercado
  let confidence = 70; // Base
  
  if (marketCondition === MarketCondition.STRONG_TREND_UP && direction === 'CALL') {
    confidence += 15;
  } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN && direction === 'PUT') {
    confidence += 15;
  } else if (
    (marketCondition === MarketCondition.TREND_UP && direction === 'CALL') || 
    (marketCondition === MarketCondition.TREND_DOWN && direction === 'PUT')
  ) {
    confidence += 10;
  }
  
  // Ajusta com base no RSI
  if ((direction === 'CALL' && rsiValue < 30) || (direction === 'PUT' && rsiValue > 70)) {
    confidence += 5;
  }
  
  // Ajusta com base no MACD
  if ((direction === 'CALL' && macdData.histogram > 0) || 
      (direction === 'PUT' && macdData.histogram < 0)) {
    confidence += 5;
  }
  
  // Limita a confiança máxima
  confidence = Math.min(confidence, 95);
  
  return {
    direction,
    confidence,
    strength: trendStrengthValue,
    timeframe,
    label,
    marketCondition
  };
};

