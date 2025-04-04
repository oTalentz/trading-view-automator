
import { 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  determineMarketCondition,
  calculateVolatility
} from '@/utils/technicalAnalysis';

interface StrategySignal {
  direction: 'CALL' | 'PUT';
  confidence: number;
  timestamp: number;
}

/**
 * Applies a specific strategy to historical price data to generate a signal
 */
export const applyStrategy = (
  strategyKey: string,
  prices: number[],
  volume: number[]
): StrategySignal | null => {
  if (prices.length < 30) return null;
  
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2];
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const bbands = calculateBollingerBands(prices);
  const marketCondition = determineMarketCondition(prices, volume);
  const volatility = calculateVolatility(prices);
  
  let signal: StrategySignal | null = null;
  
  switch (strategyKey) {
    case 'RSI_DIVERGENCE': {
      // For RSI divergence, check for oversold/overbought conditions
      if (rsi < 30) {
        signal = {
          direction: 'CALL',
          confidence: 70 + Math.min(30 - rsi, 15),
          timestamp: Date.now()
        };
      } else if (rsi > 70) {
        signal = {
          direction: 'PUT',
          confidence: 70 + Math.min(rsi - 70, 15),
          timestamp: Date.now()
        };
      }
      break;
    }
    
    case 'MACD_CROSSOVER': {
      // Check for MACD crosses
      const previousMacd = calculateMACD(prices.slice(0, -1));
      
      // MACD line crossing above signal line
      if (previousMacd.macdLine < previousMacd.signalLine && 
          macd.macdLine > macd.signalLine) {
        signal = {
          direction: 'CALL',
          confidence: 75 + Math.min(Math.abs(macd.histogram) * 100, 15),
          timestamp: Date.now()
        };
      } 
      // MACD line crossing below signal line
      else if (previousMacd.macdLine > previousMacd.signalLine && 
               macd.macdLine < macd.signalLine) {
        signal = {
          direction: 'PUT',
          confidence: 75 + Math.min(Math.abs(macd.histogram) * 100, 15),
          timestamp: Date.now()
        };
      }
      break;
    }
    
    case 'BOLLINGER_BREAKOUT': {
      // Price breaking out of Bollinger Bands
      if (currentPrice > bbands.upper && previousPrice <= bbands.upper) {
        signal = {
          direction: 'PUT',
          confidence: 80,
          timestamp: Date.now()
        };
      } else if (currentPrice < bbands.lower && previousPrice >= bbands.lower) {
        signal = {
          direction: 'CALL',
          confidence: 80,
          timestamp: Date.now()
        };
      }
      break;
    }
    
    case 'SUPPORT_RESISTANCE': {
      // Simplified support/resistance
      const highestHigh = Math.max(...prices.slice(-20));
      const lowestLow = Math.min(...prices.slice(-20));
      
      // Price approaching resistance
      if (Math.abs(currentPrice - highestHigh) / highestHigh < 0.01 && 
          currentPrice < highestHigh) {
        signal = {
          direction: 'PUT',
          confidence: 82,
          timestamp: Date.now()
        };
      } 
      // Price approaching support
      else if (Math.abs(currentPrice - lowestLow) / lowestLow < 0.01 && 
               currentPrice > lowestLow) {
        signal = {
          direction: 'CALL',
          confidence: 82,
          timestamp: Date.now()
        };
      }
      break;
    }
    
    case 'TREND_FOLLOWING': {
      // Simple trending strategy using moving averages
      const shortMA = prices.slice(-5).reduce((sum, p) => sum + p, 0) / 5;
      const longMA = prices.slice(-15).reduce((sum, p) => sum + p, 0) / 15;
      
      // Uptrend
      if (shortMA > longMA && currentPrice > shortMA) {
        signal = {
          direction: 'CALL',
          confidence: 85,
          timestamp: Date.now()
        };
      } 
      // Downtrend
      else if (shortMA < longMA && currentPrice < shortMA) {
        signal = {
          direction: 'PUT',
          confidence: 85,
          timestamp: Date.now()
        };
      }
      break;
    }
    
    case 'FIBONACCI_RETRACEMENT': {
      // Simplified Fibonacci approach
      const recentHigh = Math.max(...prices.slice(-50));
      const recentLow = Math.min(...prices.slice(-50));
      const range = recentHigh - recentLow;
      
      // Key Fibonacci levels
      const fib382 = recentLow + (range * 0.382);
      const fib618 = recentLow + (range * 0.618);
      
      // Price near key Fibonacci level in a pullback
      if (Math.abs(currentPrice - fib382) / fib382 < 0.01) {
        // If we're in an uptrend and pulling back to 38.2% level
        if (determineMarketCondition(prices.slice(-30)) === 'TREND_UP') {
          signal = {
            direction: 'CALL',
            confidence: 83,
            timestamp: Date.now()
          };
        }
      } else if (Math.abs(currentPrice - fib618) / fib618 < 0.01) {
        // If we're in a downtrend and pulling back to 61.8% level
        if (determineMarketCondition(prices.slice(-30)) === 'TREND_DOWN') {
          signal = {
            direction: 'PUT',
            confidence: 83,
            timestamp: Date.now()
          };
        }
      }
      break;
    }
    
    case 'ICHIMOKU_CLOUD': {
      // Extremely simplified Ichimoku Cloud approach
      const tenkanPeriod = 9;
      const kijunPeriod = 26;
      
      // Calculate Tenkan-sen (Conversion Line)
      const tenkanHigh = Math.max(...prices.slice(-tenkanPeriod));
      const tenkanLow = Math.min(...prices.slice(-tenkanPeriod));
      const tenkanSen = (tenkanHigh + tenkanLow) / 2;
      
      // Calculate Kijun-sen (Base Line)
      const kijunHigh = Math.max(...prices.slice(-kijunPeriod));
      const kijunLow = Math.min(...prices.slice(-kijunPeriod));
      const kijunSen = (kijunHigh + kijunLow) / 2;
      
      // Tenkan crosses above Kijun (bullish)
      if (tenkanSen > kijunSen && 
          prices[prices.length - 2] <= kijunSen && 
          currentPrice > kijunSen) {
        signal = {
          direction: 'CALL',
          confidence: 87,
          timestamp: Date.now()
        };
      } 
      // Tenkan crosses below Kijun (bearish)
      else if (tenkanSen < kijunSen && 
               prices[prices.length - 2] >= kijunSen && 
               currentPrice < kijunSen) {
        signal = {
          direction: 'PUT',
          confidence: 87,
          timestamp: Date.now()
        };
      }
      break;
    }
    
    default:
      return null;
  }
  
  return signal;
};
