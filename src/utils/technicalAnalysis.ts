
// Facade file for technical analysis utilities
// Re-export everything from the refactored files

// Enums
import { MarketCondition, TrendStrength } from './technical/enums';

// Core calculations
import { calculateVolatility } from './technical/volatility';
import { calculateMA, calculateEMA } from './technical/movingAverages';

// Indicators
import { calculateRSI } from './technical/indicators/rsi';
import { calculateMACD } from './technical/indicators/macd';
import type { MACDData } from './technical/indicators/macd';
import { calculateBollingerBands } from './technical/indicators/bollingerBands';

// Analysis utilities
import { findSupportResistanceLevels } from './technical/supportResistance';
import { determineMarketCondition } from './technical/marketCondition';
import { calculateTrendStrength } from './technical/trendStrength';
import { calculateSignalQuality } from './technical/signalQuality';
import { calculateOptimalEntryTiming } from './technical/entryTiming';
import { generateSimulatedMarketData } from './technical/marketData';

// Re-export all the utilities to maintain backward compatibility
export {
  // Enums
  MarketCondition,
  TrendStrength,
  
  // Core calculations
  calculateVolatility,
  calculateMA,
  calculateEMA,
  
  // Indicators
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  
  // Types
  // Use export type for re-exporting types when isolatedModules is enabled
  type MACDData,
  
  // Analysis utilities
  findSupportResistanceLevels,
  determineMarketCondition,
  calculateTrendStrength,
  calculateSignalQuality,
  calculateOptimalEntryTiming,
  generateSimulatedMarketData
};
