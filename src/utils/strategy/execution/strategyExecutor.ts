
import { 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  determineMarketCondition,
  calculateVolatility
} from '@/utils/technicalAnalysis';
import { strategyExecutors } from './strategyMap';
import { StrategySignal, StrategyExecutionContext } from './types';

/**
 * Applies a specific strategy to historical price data to generate a signal
 */
export const applyStrategy = (
  strategyKey: string,
  prices: number[],
  volume: number[]
): StrategySignal | null => {
  if (prices.length < 30) return null;
  
  // Calculate technical indicators once
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2];
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const bbands = calculateBollingerBands(prices);
  const marketCondition = determineMarketCondition(prices, volume);
  const volatility = calculateVolatility(prices);
  
  // Create execution context with all the data needed by strategies
  const context: StrategyExecutionContext = {
    prices,
    volume,
    rsi,
    macd,
    bbands,
    marketCondition,
    volatility,
    currentPrice,
    previousPrice
  };
  
  // Get the appropriate strategy executor
  const strategyExecutor = strategyExecutors[strategyKey];
  
  // If strategy doesn't exist, return null
  if (!strategyExecutor) {
    return null;
  }
  
  // Execute the strategy and return its signal
  return strategyExecutor(context);
};
