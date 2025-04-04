
import { cacheService } from '@/utils/cacheSystem';

/**
 * Carrega o histórico de desempenho das estratégias
 * Em uma implementação real, isso buscaria dados do banco de dados ou localStorage
 */
export const loadStrategyPerformanceHistory = () => {
  // Verificar cache
  const cacheKey = 'strategy-performance-history';
  const cachedHistory = cacheService.get(cacheKey);
  
  if (cachedHistory) {
    return cachedHistory;
  }
  
  // Em uma implementação real, esses dados viriam de um histórico salvo
  // Aqui usamos dados simulados para demonstração
  const simulatedHistory = {
    'RSI_DIVERGENCE': {
      winRate: 0.76,
      recentWinRate: 0.71,
      volatilityPerformance: {low: 0.65, medium: 0.76, high: 0.52},
      marketConditionPerformance: {
        'SIDEWAYS': 0.82,
        'VOLATILE': 0.68,
        'TREND_UP': 0.58,
        'TREND_DOWN': 0.61,
        'STRONG_TREND_UP': 0.42,
        'STRONG_TREND_DOWN': 0.46
      }
    },
    'MACD_CROSSOVER': {
      winRate: 0.68,
      recentWinRate: 0.65,
      volatilityPerformance: {low: 0.52, medium: 0.70, high: 0.61},
      marketConditionPerformance: {
        'SIDEWAYS': 0.55,
        'VOLATILE': 0.62,
        'TREND_UP': 0.78,
        'TREND_DOWN': 0.76,
        'STRONG_TREND_UP': 0.72,
        'STRONG_TREND_DOWN': 0.71
      }
    },
    'BOLLINGER_BREAKOUT': {
      winRate: 0.72,
      recentWinRate: 0.77,
      volatilityPerformance: {low: 0.45, medium: 0.68, high: 0.89},
      marketConditionPerformance: {
        'SIDEWAYS': 0.51,
        'VOLATILE': 0.88,
        'TREND_UP': 0.65,
        'TREND_DOWN': 0.64,
        'STRONG_TREND_UP': 0.59,
        'STRONG_TREND_DOWN': 0.56
      }
    },
    'SUPPORT_RESISTANCE': {
      winRate: 0.79,
      recentWinRate: 0.73,
      volatilityPerformance: {low: 0.82, medium: 0.75, high: 0.48},
      marketConditionPerformance: {
        'SIDEWAYS': 0.89,
        'VOLATILE': 0.52,
        'TREND_UP': 0.62,
        'TREND_DOWN': 0.65,
        'STRONG_TREND_UP': 0.51,
        'STRONG_TREND_DOWN': 0.54
      }
    },
    'TREND_FOLLOWING': {
      winRate: 0.81,
      recentWinRate: 0.84,
      volatilityPerformance: {low: 0.72, medium: 0.80, high: 0.65},
      marketConditionPerformance: {
        'SIDEWAYS': 0.50,
        'VOLATILE': 0.59,
        'TREND_UP': 0.85,
        'TREND_DOWN': 0.83,
        'STRONG_TREND_UP': 0.92,
        'STRONG_TREND_DOWN': 0.90
      }
    },
    'FIBONACCI_RETRACEMENT': {
      winRate: 0.75,
      recentWinRate: 0.69,
      volatilityPerformance: {low: 0.66, medium: 0.78, high: 0.59},
      marketConditionPerformance: {
        'SIDEWAYS': 0.75,
        'VOLATILE': 0.61,
        'TREND_UP': 0.72,
        'TREND_DOWN': 0.70,
        'STRONG_TREND_UP': 0.62,
        'STRONG_TREND_DOWN': 0.65
      }
    },
    'ICHIMOKU_CLOUD': {
      winRate: 0.78,
      recentWinRate: 0.81,
      volatilityPerformance: {low: 0.73, medium: 0.79, high: 0.64},
      marketConditionPerformance: {
        'SIDEWAYS': 0.60,
        'VOLATILE': 0.58,
        'TREND_UP': 0.81,
        'TREND_DOWN': 0.83,
        'STRONG_TREND_UP': 0.88,
        'STRONG_TREND_DOWN': 0.89
      }
    }
  };
  
  // Cache por 1 hora
  cacheService.set(cacheKey, simulatedHistory, 3600);
  
  return simulatedHistory;
};
