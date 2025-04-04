
import { MarketCondition } from '@/utils/technicalAnalysis';
import { scoreStrategies } from '../scoring/strategyScorer';
import { StrategyWithDetails } from '../types';
import { getStrategyWithDetails } from '../utils/strategyDetailsUtils';

/**
 * Selects strategies using the traditional scoring method (non-ML)
 */
export const selectTraditionalStrategy = (
  compatibleStrategies: string[],
  prices: number[],
  volume: number[],
  rsiValue: number,
  macdData: any,
  bbands: any,
  volatility: number
): StrategyWithDetails => {
  // Score each compatible strategy
  const strategyScores = scoreStrategies(
    compatibleStrategies,
    prices,
    volume,
    rsiValue,
    macdData,
    bbands,
    volatility
  );
  
  // Seleciona a estratégia com maior pontuação
  strategyScores.sort((a, b) => b.score - a.score);
  
  // Create a proper StrategyWithDetails object from the top-scored strategy
  const topStrategyKey = strategyScores[0]?.key || Object.keys(strategyScores)[0];
  const topStrategy = getStrategyWithDetails(
    topStrategyKey,
    75, // Default confidence
    ['Selected based on highest traditional score']
  );
  
  return topStrategy;
};
