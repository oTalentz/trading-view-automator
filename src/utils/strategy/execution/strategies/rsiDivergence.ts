
import { StrategySignal, StrategyExecutionContext } from '../types';

/**
 * Applies the RSI Divergence strategy
 */
export function executeRSIDivergenceStrategy(context: StrategyExecutionContext): StrategySignal | null {
  const { rsi } = context;
  
  // For RSI divergence, check for oversold/overbought conditions
  if (rsi < 30) {
    return {
      direction: 'CALL',
      confidence: 70 + Math.min(30 - rsi, 15),
      timestamp: Date.now()
    };
  } else if (rsi > 70) {
    return {
      direction: 'PUT',
      confidence: 70 + Math.min(rsi - 70, 15),
      timestamp: Date.now()
    };
  }
  
  return null;
}
