// Utility functions for advanced technical analysis

// Enum for market conditions
export enum MarketCondition {
  STRONG_TREND_UP = "STRONG_TREND_UP",
  TREND_UP = "TREND_UP",
  SIDEWAYS = "SIDEWAYS",
  TREND_DOWN = "TREND_DOWN",
  STRONG_TREND_DOWN = "STRONG_TREND_DOWN",
  VOLATILE = "VOLATILE",
  UNKNOWN = "UNKNOWN"
}

// Enum for trend strengths
export enum TrendStrength {
  WEAK = "WEAK",
  MODERATE = "MODERATE",
  STRONG = "STRONG",
  VERY_STRONG = "VERY_STRONG"
}

// Standard deviation calculation for volatility
export const calculateVolatility = (prices: number[], period: number = 14): number => {
  if (prices.length < period) return 0;
  
  const recentPrices = prices.slice(-period);
  const mean = recentPrices.reduce((sum, price) => sum + price, 0) / period;
  
  const squaredDifferences = recentPrices.map(price => Math.pow(price - mean, 2));
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / period;
  
  return Math.sqrt(variance); // Standard deviation
};

// Moving average calculation
export const calculateMA = (prices: number[], period: number): number => {
  if (prices.length < period) return 0;
  const recentPrices = prices.slice(-period);
  return recentPrices.reduce((sum, price) => sum + price, 0) / period;
};

// Exponential moving average
export const calculateEMA = (prices: number[], period: number): number => {
  if (prices.length < period) return 0;
  
  const k = 2 / (period + 1); // Smoothing factor
  
  // First EMA is SMA
  let ema = calculateMA(prices.slice(0, period), period);
  
  // Calculate EMA for remaining prices
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] * k) + (ema * (1 - k));
  }
  
  return ema;
};

// Relative Strength Index
export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length <= period) return 50; // Default neutral value
  
  let gains = 0;
  let losses = 0;
  
  // Calculate initial gains and losses
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change; // Convert to positive value
    }
  }
  
  // Initialize average gain and loss
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // Calculate subsequent values
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    
    if (change >= 0) {
      avgGain = ((avgGain * (period - 1)) + change) / period;
      avgLoss = ((avgLoss * (period - 1))) / period;
    } else {
      avgGain = ((avgGain * (period - 1))) / period;
      avgLoss = ((avgLoss * (period - 1)) - change) / period;
    }
  }
  
  if (avgLoss === 0) return 100; // Prevent division by zero
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

// MACD calculation
export const calculateMACD = (
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
) => {
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  const macdLine = fastEMA - slowEMA;
  
  // Calculate signal line (EMA of MACD line)
  // In a real implementation, we would need historical MACD values
  // This is simplified for demonstration
  const signalLine = macdLine * 0.85; // Simplified approximation
  
  return {
    macdLine,
    signalLine,
    histogram: macdLine - signalLine
  };
};

// Interface for MACD data including previousHistogram for comparison
export interface MACDData {
  macdLine: number;
  signalLine: number;
  histogram: number;
  previousHistogram?: number;
}

// Bollinger Bands
export const calculateBollingerBands = (prices: number[], period: number = 20, multiplier: number = 2) => {
  const sma = calculateMA(prices.slice(-period), period);
  const volatility = calculateVolatility(prices.slice(-period), period);
  
  return {
    upper: sma + (volatility * multiplier),
    middle: sma,
    lower: sma - (volatility * multiplier)
  };
};

// Support and Resistance detection (simplified)
export const findSupportResistanceLevels = (prices: number[], periods: number = 20) => {
  if (prices.length < periods) {
    return { support: 0, resistance: 0 };
  }
  
  const recentPrices = prices.slice(-periods);
  const min = Math.min(...recentPrices);
  const max = Math.max(...recentPrices);
  
  // Find the most recent swing low as support
  let support = min;
  for (let i = recentPrices.length - 2; i >= 0; i--) {
    if (recentPrices[i] < recentPrices[i+1] && recentPrices[i] < recentPrices[i-1]) {
      support = recentPrices[i];
      break;
    }
  }
  
  // Find the most recent swing high as resistance
  let resistance = max;
  for (let i = recentPrices.length - 2; i >= 0; i--) {
    if (recentPrices[i] > recentPrices[i+1] && recentPrices[i] > recentPrices[i-1]) {
      resistance = recentPrices[i];
      break;
    }
  }
  
  return { support, resistance };
};

// Determine market condition based on multiple indicators
export const determineMarketCondition = (
  prices: number[],
  volume: number[] = []
): MarketCondition => {
  if (prices.length < 50) return MarketCondition.UNKNOWN;
  
  const shortMA = calculateMA(prices, 10);
  const longMA = calculateMA(prices, 50);
  const rsi = calculateRSI(prices);
  const volatility = calculateVolatility(prices);
  const averagePrice = calculateMA(prices, 20);
  const volatilityRatio = volatility / averagePrice;
  
  // Check for strong trends
  if (shortMA > longMA * 1.05 && rsi > 70) {
    return MarketCondition.STRONG_TREND_UP;
  }
  if (shortMA < longMA * 0.95 && rsi < 30) {
    return MarketCondition.STRONG_TREND_DOWN;
  }
  
  // Check for moderate trends
  if (shortMA > longMA && rsi > 55) {
    return MarketCondition.TREND_UP;
  }
  if (shortMA < longMA && rsi < 45) {
    return MarketCondition.TREND_DOWN;
  }
  
  // Check for high volatility
  if (volatilityRatio > 0.02) {
    return MarketCondition.VOLATILE;
  }
  
  // Default to sideways
  return MarketCondition.SIDEWAYS;
};

// Calculate trend strength based on multiple factors
export const calculateTrendStrength = (
  prices: number[],
  volume: number[] = []
): { strength: TrendStrength; value: number } => {
  if (prices.length < 50) return { strength: TrendStrength.WEAK, value: 30 };
  
  const shortMA = calculateMA(prices, 10);
  const longMA = calculateMA(prices, 50);
  const rsi = calculateRSI(prices);
  
  // Calculate distance between MAs as percentage
  const maDistance = Math.abs((shortMA - longMA) / longMA) * 100;
  
  // Calculate RSI distance from neutral (50)
  const rsiDeviation = Math.abs(rsi - 50);
  
  // Calculate trend consistency (simplified)
  const priceTrend = shortMA > longMA ? 1 : -1;
  let consistentMoves = 0;
  
  for (let i = prices.length - 2; i > prices.length - 15; i--) {
    const move = prices[i+1] > prices[i] ? 1 : -1;
    if (move === priceTrend) consistentMoves++;
  }
  
  // Calculate strength score (0-100)
  let strengthScore = (maDistance * 3) + (rsiDeviation * 0.8) + (consistentMoves * 3);
  
  // Ensure range is within 0-100
  strengthScore = Math.min(Math.max(strengthScore, 0), 100);
  
  // Determine trend strength category
  let strength;
  if (strengthScore >= 80) strength = TrendStrength.VERY_STRONG;
  else if (strengthScore >= 60) strength = TrendStrength.STRONG;
  else if (strengthScore >= 40) strength = TrendStrength.MODERATE;
  else strength = TrendStrength.WEAK;
  
  return { strength, value: strengthScore };
};

// Score a signal's quality based on multiple factors (0-100)
export const calculateSignalQuality = (
  prices: number[],
  direction: 'CALL' | 'PUT',
  marketCondition: MarketCondition,
  trendStrength: number
): number => {
  if (prices.length < 50) return 60; // Default moderate confidence
  
  const rsi = calculateRSI(prices);
  const { macdLine, signalLine, histogram } = calculateMACD(prices);
  const bollingerBands = calculateBollingerBands(prices);
  const currentPrice = prices[prices.length - 1];
  
  let score = 50; // Start with neutral score
  
  // Factor 1: Check if signal aligns with market condition
  if (direction === 'CALL' && 
      (marketCondition === MarketCondition.TREND_UP || 
       marketCondition === MarketCondition.STRONG_TREND_UP)) {
    score += 15;
  } else if (direction === 'PUT' && 
             (marketCondition === MarketCondition.TREND_DOWN || 
              marketCondition === MarketCondition.STRONG_TREND_DOWN)) {
    score += 15;
  } else if (marketCondition === MarketCondition.VOLATILE) {
    score -= 10; // Reduce confidence in volatile markets
  }
  
  // Factor 2: RSI confirmation
  if (direction === 'CALL' && rsi > 50 && rsi < 70) {
    score += 10;
  } else if (direction === 'PUT' && rsi < 50 && rsi > 30) {
    score += 10;
  }
  
  // Factor 3: MACD confirmation
  if (direction === 'CALL' && histogram > 0 && macdLine > signalLine) {
    score += 10;
  } else if (direction === 'PUT' && histogram < 0 && macdLine < signalLine) {
    score += 10;
  }
  
  // Factor 4: Bollinger Bands position
  if (direction === 'CALL' && currentPrice < bollingerBands.middle) {
    score += 5; // Potential bounce up from below the middle band
  } else if (direction === 'PUT' && currentPrice > bollingerBands.middle) {
    score += 5; // Potential drop from above the middle band
  }
  
  // Factor 5: Trend strength adjustment
  score += (trendStrength - 50) / 5;
  
  // Ensure score is within 0-100 range
  return Math.min(Math.max(score, 30), 97); // Cap between 30-97 for realism
};

// Determine best entry time based on price action and volatility
export const calculateOptimalEntryTiming = (): number => {
  // In a real system, this would analyze recent price action and volatility
  // For this implementation, we'll aim for a precise entry time at the start of a new minute
  const now = new Date();
  const secondsToNextMinute = 60 - now.getSeconds();
  
  // Add a small buffer to ensure we're at the very start of the new minute
  return secondsToNextMinute <= 3 ? secondsToNextMinute + 60 : secondsToNextMinute;
};

// Simulate market data for testing (in real app, this would be actual market data)
export const generateSimulatedMarketData = (
  symbol: string, 
  periods: number = 100
): { prices: number[]; volume: number[] } => {
  // Start with a base price that varies by symbol
  const symbolHash = symbol.split('').reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);
  
  const basePrice = 100 + Math.abs(symbolHash % 900);
  const volatility = (Math.abs(symbolHash % 10) / 100) + 0.005;
  
  const prices = [];
  const volume = [];
  
  let currentPrice = basePrice;
  let trend = 0;
  
  // Generate price series with some realistic patterns
  for (let i = 0; i < periods; i++) {
    // Occasionally shift the trend
    if (i % 10 === 0) {
      trend = (Math.random() - 0.5) * 0.02;
    }
    
    // Add random noise plus trend
    const change = (Math.random() - 0.5) * volatility * currentPrice + (currentPrice * trend);
    currentPrice += change;
    
    // Ensure price is positive
    currentPrice = Math.max(currentPrice, 0.01);
    
    prices.push(currentPrice);
    
    // Generate corresponding volume
    const baseVolume = currentPrice * 100;
    const volumeNoise = (Math.random() + 0.5) * baseVolume;
    volume.push(volumeNoise);
  }
  
  return { prices, volume };
};
