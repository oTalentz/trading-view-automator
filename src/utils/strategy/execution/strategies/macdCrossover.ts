
import { StrategySignal, StrategyExecutionContext } from '../types';
import { calculateMACD } from '@/utils/technicalAnalysis';

/**
 * Applies the MACD Crossover strategy
 */
export function executeMACDCrossoverStrategy(context: StrategyExecutionContext): StrategySignal | null {
  const { prices, macd } = context;
  
  // Check for MACD crosses
  const previousMacd = calculateMACD(prices.slice(0, -1));
  
  // MACD line crossing above signal line
  if (previousMacd.macdLine < previousMacd.signalLine && 
      macd.macdLine > macd.signalLine) {
    return {
      direction: 'CALL',
      confidence: 75 + Math.min(Math.abs(macd.histogram) * 100, 15),
      timestamp: Date.now()
    };
  } 
  // MACD line crossing below signal line
  else if (previousMacd.macdLine > previousMacd.signalLine && 
           macd.macdLine < macd.signalLine) {
    return {
      direction: 'PUT',
      confidence: 75 + Math.min(Math.abs(macd.histogram) * 100, 15),
      timestamp: Date.now()
    };
  }
  
  return null;
}
