
import { executeRSIDivergenceStrategy } from './strategies/rsiDivergence';
import { executeMACDCrossoverStrategy } from './strategies/macdCrossover';
import { executeBollingerBreakoutStrategy } from './strategies/bollingerBreakout';
import { executeSupportResistanceStrategy } from './strategies/supportResistance';
import { executeTrendFollowingStrategy } from './strategies/trendFollowing';
import { executeFibonacciRetracementStrategy } from './strategies/fibonacciRetracement';
import { executeIchimokuCloudStrategy } from './strategies/ichimokuCloud';
import { StrategyExecutionContext } from './types';

/**
 * Maps strategy keys to their execution functions
 */
export const strategyExecutors: Record<string, (context: StrategyExecutionContext) => any> = {
  'RSI_DIVERGENCE': executeRSIDivergenceStrategy,
  'MACD_CROSSOVER': executeMACDCrossoverStrategy,
  'BOLLINGER_BREAKOUT': executeBollingerBreakoutStrategy,
  'SUPPORT_RESISTANCE': executeSupportResistanceStrategy,
  'TREND_FOLLOWING': executeTrendFollowingStrategy,
  'FIBONACCI_RETRACEMENT': executeFibonacciRetracementStrategy,
  'ICHIMOKU_CLOUD': executeIchimokuCloudStrategy
};
