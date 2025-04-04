
/**
 * Types for the strategy selection system
 */

export interface StrategyDetails {
  name: string;
  indicators: string[];
  description: string;
  suitableMarketConditions: string[];
  risk: string;
}

export interface AlternativeStrategy {
  name: string;
  confidenceScore: number;
}

export interface StrategyWithDetails extends StrategyDetails {
  key: string;
  selectionReasons: string[];
  mlConfidenceScore: number;
  historicalPerformance: {
    performanceBonus: number;
    winRate: number;
    sampleSize: number;
  };
  alternativeStrategies?: AlternativeStrategy[];
}
