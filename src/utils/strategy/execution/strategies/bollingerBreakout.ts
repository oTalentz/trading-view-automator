
import { StrategySignal, StrategyExecutionContext } from '../types';

/**
 * Applies the Bollinger Bands Breakout strategy
 */
export function executeBollingerBreakoutStrategy(context: StrategyExecutionContext): StrategySignal | null {
  const { currentPrice, previousPrice, bbands } = context;
  
  // Price breaking out of Bollinger Bands
  if (currentPrice > bbands.upper && previousPrice <= bbands.upper) {
    return {
      direction: 'PUT',
      confidence: 80,
      timestamp: Date.now()
    };
  } else if (currentPrice < bbands.lower && previousPrice >= bbands.lower) {
    return {
      direction: 'CALL',
      confidence: 80,
      timestamp: Date.now()
    };
  }
  
  return null;
}
