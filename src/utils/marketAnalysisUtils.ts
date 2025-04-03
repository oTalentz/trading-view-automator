
import { 
  MarketCondition, 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  findSupportResistanceLevels,
  determineMarketCondition,
  calculateTrendStrength,
  generateSimulatedMarketData
} from '@/utils/technicalAnalysis';
import { ADVANCED_STRATEGIES } from '@/constants/tradingStrategies';
import { MarketAnalysisResult } from '@/types/marketAnalysis';

// Função para calcular tempo ótimo de entrada
export const calculateOptimalEntryTiming = (): number => {
  const now = new Date();
  const secondsToNextMinute = 60 - now.getSeconds();
  return secondsToNextMinute <= 3 ? secondsToNextMinute + 60 : secondsToNextMinute;
};

// Função para calcular expiração com base no intervalo
export const calculateExpiryMinutes = (interval: string): number => {
  switch(interval) {
    case '1': return 1;
    case '5': return 5;
    case '15': return 15;
    case '30': return 30;
    case '60': return 60;
    case '240': return 240;
    case 'D': return 1440; // 24 horas
    case 'W': return 10080; // 7 dias
    default: return 1;
  }
};

// Função para selecionar a estratégia baseada nas condições de mercado
export const selectStrategy = (marketCondition: MarketCondition, prices: number[], supportResistance: any, rsiValue: number) => {
  switch(marketCondition) {
    case MarketCondition.STRONG_TREND_UP:
    case MarketCondition.STRONG_TREND_DOWN:
      return ADVANCED_STRATEGIES.TREND_FOLLOWING;
    case MarketCondition.VOLATILE:
      return ADVANCED_STRATEGIES.BOLLINGER_BREAKOUT;
    case MarketCondition.SIDEWAYS:
      if (Math.abs(prices[prices.length-1] - supportResistance.support) < 
          Math.abs(prices[prices.length-1] - supportResistance.resistance)) {
        return ADVANCED_STRATEGIES.SUPPORT_RESISTANCE;
      } else {
        return ADVANCED_STRATEGIES.FIBONACCI_RETRACEMENT;
      }
    default:
      // Escolhe entre divergência RSI e MACD com base nos valores atuais
      return rsiValue > 65 || rsiValue < 35 ? 
        ADVANCED_STRATEGIES.RSI_DIVERGENCE : 
        ADVANCED_STRATEGIES.MACD_CROSSOVER;
  }
};

// Função para determinar a direção com base em indicadores técnicos
export const determineSignalDirection = (
  marketCondition: MarketCondition,
  prices: number[],
  bbands: any,
  rsiValue: number,
  macdData: any,
  trendStrengthValue: number
): 'CALL' | 'PUT' => {
  if (marketCondition === MarketCondition.STRONG_TREND_UP || 
      marketCondition === MarketCondition.TREND_UP) {
    return 'CALL';
  } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || 
            marketCondition === MarketCondition.TREND_DOWN) {
    return 'PUT';
  } else {
    // Para mercados laterais ou voláteis, usamos mais indicadores
    const currentPrice = prices[prices.length - 1];
    
    if (rsiValue < 30 && currentPrice < bbands.lower) {
      return 'CALL'; // Possível sobrevendido
    } else if (rsiValue > 70 && currentPrice > bbands.upper) {
      return 'PUT'; // Possível sobrecomprado
    } else if (macdData.histogram > 0 && macdData.histogram > macdData.histogram * 1.1) {
      return 'CALL'; // Momentum positivo
    } else if (macdData.histogram < 0 && macdData.histogram < macdData.histogram * 1.1) {
      return 'PUT'; // Momentum negativo
    } else {
      // Sem sinal claro, escolhemos com base em tendência de mais longo prazo
      return trendStrengthValue > 50 ? 'CALL' : 'PUT';
    }
  }
};

// Função para calcular as pontuações técnicas
export const calculateTechnicalScores = (
  rsiValue: number,
  macdData: any,
  bbands: any,
  currentPrice: number,
  volume: number[],
  trendStrengthValue: number
) => {
  // RSI score
  const rsiScore = Math.abs(rsiValue - 50) * 2;
  
  // MACD score
  const macdScore = Math.abs(macdData.histogram) * 20;
  
  // Bollinger Bands score
  const bbRange = bbands.upper - bbands.lower;
  const bbPosition = (currentPrice - bbands.lower) / bbRange;
  const bbandsScore = (1 - Math.abs(bbPosition - 0.5) * 2) * 100;
  
  // Volume trend
  const recentVolumes = volume.slice(-5);
  const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
  const volumeTrend = volume[volume.length - 1] / avgVolume * 50;
  
  // Price action score
  const priceActionScore = (trendStrengthValue / 100) * 80 + 20;
  
  // Overall score
  const overallScore = (
    rsiScore * 0.2 + 
    macdScore * 0.2 + 
    bbandsScore * 0.15 + 
    volumeTrend * 0.15 + 
    priceActionScore * 0.3
  );
  
  return {
    rsi: Math.round(rsiScore),
    macd: Math.round(macdScore),
    bollingerBands: Math.round(bbandsScore),
    volumeTrend: Math.round(volumeTrend),
    priceAction: Math.round(priceActionScore),
    overallScore: Math.round(overallScore)
  };
};

// Função principal para analisar o mercado
export const analyzeMarket = (symbol: string, interval: string): MarketAnalysisResult => {
  // Obter dados simulados do mercado
  const { prices, volume } = generateSimulatedMarketData(symbol, 100);
  
  // Análise de mercado avançada
  const marketCondition = determineMarketCondition(prices, volume);
  const { value: trendStrengthValue } = calculateTrendStrength(prices, volume);
  const supportResistance = findSupportResistanceLevels(prices);
  const rsiValue = calculateRSI(prices);
  const macdData = calculateMACD(prices);
  const bbands = calculateBollingerBands(prices);
  
  // Determina a direção com maior probabilidade de sucesso
  const direction = determineSignalDirection(
    marketCondition,
    prices,
    bbands,
    rsiValue,
    macdData,
    trendStrengthValue
  );
  
  // Seleção de estratégia baseada nas condições atuais do mercado
  const selectedStrategy = selectStrategy(marketCondition, prices, supportResistance, rsiValue);
  
  // Calcula pontuações técnicas
  const currentPrice = prices[prices.length - 1];
  const technicalScores = calculateTechnicalScores(
    rsiValue,
    macdData,
    bbands,
    currentPrice,
    volume,
    trendStrengthValue
  );
  
  // Calcular confiança final baseada na estratégia e análise técnica
  const baseConfidence = (selectedStrategy.minConfidence + selectedStrategy.maxConfidence) / 2;
  const confidenceAdjustment = (technicalScores.overallScore - 50) / 2;
  const confidence = Math.round(Math.min(Math.max(baseConfidence + confidenceAdjustment, 70), 98));
  
  // Calcular tempo ótimo de entrada
  const secondsToNextMinute = calculateOptimalEntryTiming();
  const now = new Date();
  const entryTimeMillis = now.getTime() + (secondsToNextMinute * 1000);
  const entryTime = new Date(entryTimeMillis);
  
  // Calcular tempo de expiração
  const expiryMinutes = calculateExpiryMinutes(interval);
  const expiryTimeMillis = entryTimeMillis + (expiryMinutes * 60 * 1000);
  const expiryTime = new Date(expiryTimeMillis);
  
  // Construir e retornar o resultado da análise
  return {
    direction,
    confidence,
    timestamp: now.toISOString(),
    entryTime: entryTime.toISOString(),
    expiryTime: expiryTime.toISOString(),
    strategy: selectedStrategy.name,
    indicators: selectedStrategy.indicators,
    trendStrength: trendStrengthValue,
    marketCondition,
    supportResistance: {
      support: Math.round(supportResistance.support * 100) / 100,
      resistance: Math.round(supportResistance.resistance * 100) / 100
    },
    technicalScores,
    countdownSeconds: secondsToNextMinute
  };
};
