
import { MarketCondition } from '@/utils/technical/enums';

/**
 * Checks if the signal direction is aligned with the current market condition
 */
export const isSignalAlignedWithMarket = (
  direction: 'CALL' | 'PUT', 
  marketCondition: MarketCondition
): boolean => {
  switch (marketCondition) {
    case MarketCondition.STRONG_TREND_UP:
    case MarketCondition.TREND_UP:
      return direction === 'CALL';
    case MarketCondition.STRONG_TREND_DOWN:
    case MarketCondition.TREND_DOWN:
      return direction === 'PUT';
    case MarketCondition.SIDEWAYS:
      return true; // Em mercados laterais, qualquer direção pode ser válida
    case MarketCondition.VOLATILE:
      return false; // Em mercados voláteis, exigimos mais confirmações
    default:
      return false;
  }
};
