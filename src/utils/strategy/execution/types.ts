
/**
 * Common type definitions for strategy execution
 */

export interface StrategySignal {
  direction: 'CALL' | 'PUT';
  confidence: number;
  timestamp: number;
}

export interface StrategyExecutionContext {
  prices: number[];
  volume: number[];
  rsi: number;
  macd: any;
  bbands: any;
  marketCondition: any;
  volatility: number;
  currentPrice: number;
  previousPrice: number;
}
