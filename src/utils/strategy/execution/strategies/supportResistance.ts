
import { StrategySignal, StrategyExecutionContext } from '../types';

/**
 * Applies the Support and Resistance strategy
 */
export function executeSupportResistanceStrategy(context: StrategyExecutionContext): StrategySignal | null {
  const { prices, currentPrice } = context;
  
  // Simplified support/resistance
  const highestHigh = Math.max(...prices.slice(-20));
  const lowestLow = Math.min(...prices.slice(-20));
  
  // Price approaching resistance
  if (Math.abs(currentPrice - highestHigh) / highestHigh < 0.01 && 
      currentPrice < highestHigh) {
    return {
      direction: 'PUT',
      confidence: 82,
      timestamp: Date.now()
    };
  } 
  // Price approaching support
  else if (Math.abs(currentPrice - lowestLow) / lowestLow < 0.01 && 
           currentPrice > lowestLow) {
    return {
      direction: 'CALL',
      confidence: 82,
      timestamp: Date.now()
    };
  }
  
  return null;
}
