
import { StrategyDetails, StrategyWithDetails } from '../types';
import { ADVANCED_STRATEGIES } from '../data/advancedStrategies';

/**
 * Obtém detalhes completos de uma estratégia a partir da chave
 */
export const getStrategyWithDetails = (
  strategyKey: string, 
  confidenceScore: number, 
  reasons: string[]
): StrategyWithDetails => {
  const strategyDetails = ADVANCED_STRATEGIES[strategyKey as keyof typeof ADVANCED_STRATEGIES];
  
  if (!strategyDetails) {
    // Fallback for unknown strategy keys
    return {
      key: strategyKey,
      name: strategyKey,
      indicators: ['Technical Analysis'],
      description: 'Auto-selected strategy based on market conditions',
      suitableMarketConditions: ['SIDEWAYS', 'TREND_UP', 'TREND_DOWN'],
      risk: 'medium',
      selectionReasons: reasons || ['Auto-selected'],
      mlConfidenceScore: confidenceScore || 75,
      historicalPerformance: {
        performanceBonus: (confidenceScore - 50) / 10 || 2.5,
        winRate: (confidenceScore || 75) / 100,
        sampleSize: Math.floor(Math.random() * 50) + 30
      },
      alternativeStrategies: []
    };
  }
  
  return {
    ...strategyDetails,
    key: strategyKey,
    selectionReasons: reasons,
    mlConfidenceScore: confidenceScore,
    historicalPerformance: {
      performanceBonus: (confidenceScore - 50) / 10, // Converter para escala usada pelo sistema anterior
      winRate: confidenceScore / 100,
      sampleSize: Math.floor(Math.random() * 50) + 30 // Simulado
    },
    alternativeStrategies: []
  };
};

/**
 * Obtém o nome de uma estratégia a partir da chave
 */
export const getStrategyName = (strategyKey: string): string => {
  const strategy = ADVANCED_STRATEGIES[strategyKey as keyof typeof ADVANCED_STRATEGIES];
  return strategy ? strategy.name : strategyKey;
};
