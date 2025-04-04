
import { StrategySignal, StrategyExecutionContext } from '../types';

/**
 * Applies the Trend Following strategy
 */
export function executeTrendFollowingStrategy(context: StrategyExecutionContext): StrategySignal | null {
  const { prices, currentPrice } = context;
  
  // Simple trending strategy using moving averages
  const shortMA = prices.slice(-5).reduce((sum, p) => sum + p, 0) / 5;
  const longMA = prices.slice(-15).reduce((sum, p) => sum + p, 0) / 15;
  
  // Uptrend
  if (shortMA > longMA && currentPrice > shortMA) {
    return {
      direction: 'CALL',
      confidence: 85,
      timestamp: Date.now()
    };
  } 
  // Downtrend
  else if (shortMA < longMA && currentPrice < shortMA) {
    return {
      direction: 'PUT',
      confidence: 85,
      timestamp: Date.now()
    };
  }
  
  return null;
}
