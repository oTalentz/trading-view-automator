
import { 
  MarketCondition, 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  findSupportResistanceLevels,
  determineMarketCondition,
  calculateTrendStrength,
  generateSimulatedMarketData,
  calculateVolatility,
  calculateSignalQuality
} from '@/utils/technicalAnalysis';
import { ADVANCED_STRATEGIES, MARKET_CONDITION_STRATEGIES } from '@/constants/tradingStrategies';
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

// Improved strategy selection based on market conditions and technical indicators
export const selectStrategy = (
  marketCondition: MarketCondition, 
  prices: number[], 
  volume: number[],
  rsiValue: number, 
  macdData: any,
  bbands: any,
  volatility: number
) => {
  // Get compatible strategies for current market condition
  const compatibleStrategies = MARKET_CONDITION_STRATEGIES[marketCondition] || 
    MARKET_CONDITION_STRATEGIES.SIDEWAYS; // Default to sideways if condition not found
  
  // Calculate scores for each compatible strategy
  const strategyScores = compatibleStrategies.map(strategyKey => {
    const strategy = ADVANCED_STRATEGIES[strategyKey as keyof typeof ADVANCED_STRATEGIES];
    let score = 0;
    
    // RSI-based scoring
    if (strategyKey === "RSI_DIVERGENCE") {
      score += Math.abs(rsiValue - 50) * 2; // Higher score for extreme RSI values
    }
    
    // MACD-based scoring
    if (strategyKey === "MACD_CROSSOVER") {
      score += Math.abs(macdData.histogram) * 10;
    }
    
    // Bollinger Bands scoring
    if (strategyKey === "BOLLINGER_BREAKOUT") {
      const currentPrice = prices[prices.length - 1];
      const distanceToUpper = Math.abs(currentPrice - bbands.upper);
      const distanceToLower = Math.abs(currentPrice - bbands.lower);
      const distanceToMiddle = Math.abs(currentPrice - bbands.middle);
      
      // Higher score when price is near bands
      if (distanceToUpper < volatility || distanceToLower < volatility) {
        score += 50;
      } else if (distanceToMiddle < volatility / 2) {
        score += 20;
      }
    }
    
    // Support/Resistance scoring
    if (strategyKey === "SUPPORT_RESISTANCE") {
      const supportResistance = findSupportResistanceLevels(prices);
      const currentPrice = prices[prices.length - 1];
      const distanceToSupport = Math.abs(currentPrice - supportResistance.support);
      const distanceToResistance = Math.abs(currentPrice - supportResistance.resistance);
      
      // Higher score when price is near support or resistance
      if (distanceToSupport < volatility || distanceToResistance < volatility) {
        score += 50;
      }
    }
    
    // Trend following scoring
    if (strategyKey === "TREND_FOLLOWING") {
      const { value: trendStrength } = calculateTrendStrength(prices, volume);
      score += trendStrength / 2;
    }
    
    // Add base score for all strategies
    score += 50;
    
    return { key: strategyKey, score, strategy };
  });
  
  // Select the highest scoring strategy
  strategyScores.sort((a, b) => b.score - a.score);
  return strategyScores[0].strategy;
};

// Improved signal direction determination with more technical indicators
export const determineSignalDirection = (
  marketCondition: MarketCondition,
  prices: number[],
  volume: number[],
  bbands: any,
  rsiValue: number,
  macdData: any,
  trendStrengthValue: number
): 'CALL' | 'PUT' => {
  let bullishFactors = 0;
  let bearishFactors = 0;
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2];
  
  // Market condition analysis
  if ([MarketCondition.STRONG_TREND_UP, MarketCondition.TREND_UP].includes(marketCondition)) {
    bullishFactors += 2;
  } else if ([MarketCondition.STRONG_TREND_DOWN, MarketCondition.TREND_DOWN].includes(marketCondition)) {
    bearishFactors += 2;
  }
  
  // RSI analysis
  if (rsiValue < 30) {
    bullishFactors += 1; // Oversold condition
  } else if (rsiValue > 70) {
    bearishFactors += 1; // Overbought condition
  } else if (rsiValue > 50) {
    bullishFactors += 0.5; // Bullish bias
  } else {
    bearishFactors += 0.5; // Bearish bias
  }
  
  // MACD analysis
  if (macdData.histogram > 0 && macdData.histogram > macdData.previousHistogram) {
    bullishFactors += 1; // Increasing positive histogram
  } else if (macdData.histogram < 0 && macdData.histogram < macdData.previousHistogram) {
    bearishFactors += 1; // Decreasing negative histogram
  }
  
  // Bollinger Bands analysis
  if (currentPrice < bbands.lower) {
    bullishFactors += 1; // Price below lower band (potential bounce)
  } else if (currentPrice > bbands.upper) {
    bearishFactors += 1; // Price above upper band (potential fall)
  }
  
  // Volume analysis
  const avgVolume = volume.slice(-5).reduce((sum, vol) => sum + vol, 0) / 5;
  if (currentPrice > previousPrice && volume[volume.length - 1] > avgVolume) {
    bullishFactors += 0.5; // Rising price with above average volume
  } else if (currentPrice < previousPrice && volume[volume.length - 1] > avgVolume) {
    bearishFactors += 0.5; // Falling price with above average volume
  }
  
  // Trend strength analysis
  if (trendStrengthValue > 70) {
    if (marketCondition === MarketCondition.STRONG_TREND_UP || marketCondition === MarketCondition.TREND_UP) {
      bullishFactors += 1.5;
    } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || marketCondition === MarketCondition.TREND_DOWN) {
      bearishFactors += 1.5;
    }
  }
  
  // Make final decision based on accumulated factors
  return bullishFactors > bearishFactors ? 'CALL' : 'PUT';
};

// Enhanced technical scores calculation with more detailed analysis
export const calculateTechnicalScores = (
  rsiValue: number,
  macdData: any,
  bbands: any,
  prices: number[],
  volume: number[],
  trendStrengthValue: number
) => {
  const currentPrice = prices[prices.length - 1];
  
  // RSI score - normalized between 0-100
  const rsiDelta = Math.abs(rsiValue - 50);
  const rsiScore = Math.min(rsiDelta * 2, 100);
  
  // MACD score - normalized between 0-100
  const macdScore = Math.min(Math.abs(macdData.histogram) * 25, 100);
  
  // Bollinger Bands analysis
  const bbRange = bbands.upper - bbands.lower;
  const bbPosition = (currentPrice - bbands.lower) / bbRange;
  const bbandsScore = (1 - Math.abs(bbPosition - 0.5) * 2) * 100;
  
  // Volume trend analysis
  const recentVolumes = volume.slice(-5);
  const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
  const volumeRatio = volume[volume.length - 1] / avgVolume;
  const volumeTrend = Math.min(volumeRatio * 50, 100);
  
  // Price action score based on recent price movements
  let priceActionScore = 50;
  const priceChange = (currentPrice - prices[prices.length - 5]) / prices[prices.length - 5] * 100;
  if (Math.abs(priceChange) > 2) {
    // Strong price movement
    priceActionScore = 70 + Math.min(Math.abs(priceChange) * 2, 30);
  } else {
    // Normal price movement
    priceActionScore = 50 + Math.abs(priceChange) * 10;
  }
  
  // Overall score with weighted components
  const overallScore = (
    rsiScore * 0.2 + 
    macdScore * 0.2 + 
    bbandsScore * 0.15 + 
    volumeTrend * 0.15 + 
    priceActionScore * 0.2 +
    trendStrengthValue * 0.1
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

// Improved market analysis function with more comprehensive technical analysis
export const analyzeMarket = (symbol: string, interval: string): MarketAnalysisResult => {
  // Obter dados simulados do mercado
  const { prices, volume } = generateSimulatedMarketData(symbol, 100);
  
  // Comprehensive market analysis
  const marketCondition = determineMarketCondition(prices, volume);
  const { value: trendStrengthValue } = calculateTrendStrength(prices, volume);
  const supportResistance = findSupportResistanceLevels(prices);
  const rsiValue = calculateRSI(prices);
  const macdData = calculateMACD(prices);
  macdData.previousHistogram = calculateMACD(prices.slice(0, -1)).histogram;
  const bbands = calculateBollingerBands(prices);
  const volatility = calculateVolatility(prices);
  
  // Select optimal strategy based on current market conditions
  const selectedStrategy = selectStrategy(
    marketCondition, 
    prices, 
    volume,
    rsiValue, 
    macdData, 
    bbands,
    volatility
  );
  
  // Determine signal direction with enhanced analysis
  const direction = determineSignalDirection(
    marketCondition,
    prices,
    volume,
    bbands,
    rsiValue,
    macdData,
    trendStrengthValue
  );
  
  // Enhanced technical scores calculation
  const technicalScores = calculateTechnicalScores(
    rsiValue,
    macdData,
    bbands,
    prices,
    volume,
    trendStrengthValue
  );
  
  // Signal quality assessment
  const signalQuality = calculateSignalQuality(prices, direction, marketCondition, trendStrengthValue);
  
  // Confidence calculation with more factors
  const baseConfidence = (selectedStrategy.minConfidence + selectedStrategy.maxConfidence) / 2;
  const confidenceAdjustment = (signalQuality - 60) / 2;
  const technicalAdjustment = (technicalScores.overallScore - 50) / 4;
  const confidence = Math.round(
    Math.min(Math.max(baseConfidence + confidenceAdjustment + technicalAdjustment, 70), 98)
  );
  
  // Calculate optimal entry timing
  const secondsToNextMinute = calculateOptimalEntryTiming();
  const now = new Date();
  const entryTimeMillis = now.getTime() + (secondsToNextMinute * 1000);
  const entryTime = new Date(entryTimeMillis);
  
  // Calculate expiry time
  const expiryMinutes = calculateExpiryMinutes(interval);
  const expiryTimeMillis = entryTimeMillis + (expiryMinutes * 60 * 1000);
  const expiryTime = new Date(expiryTimeMillis);
  
  // Build and return the analysis result
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
