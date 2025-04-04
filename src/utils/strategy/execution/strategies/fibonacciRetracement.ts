
import { StrategySignal, StrategyExecutionContext } from '../types';
import { determineMarketCondition } from '@/utils/technicalAnalysis';

/**
 * Applies the Fibonacci Retracement strategy
 */
export function executeFibonacciRetracementStrategy(context: StrategyExecutionContext): StrategySignal | null {
  const { prices, currentPrice } = context;
  
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
      return {
        direction: 'CALL',
        confidence: 83,
        timestamp: Date.now()
      };
    }
  } else if (Math.abs(currentPrice - fib618) / fib618 < 0.01) {
    // If we're in a downtrend and pulling back to 61.8% level
    if (determineMarketCondition(prices.slice(-30)) === 'TREND_DOWN') {
      return {
        direction: 'PUT',
        confidence: 83,
        timestamp: Date.now()
      };
    }
  }
  
  return null;
}
