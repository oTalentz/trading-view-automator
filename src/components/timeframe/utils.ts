
import { MarketCondition } from '@/utils/technicalAnalysis';

export function getMarketConditionDisplay(condition: MarketCondition, language: string): string {
  if (language === 'pt-br') {
    switch (condition) {
      case MarketCondition.STRONG_TREND_UP: return "Tendência Forte de Alta";
      case MarketCondition.TREND_UP: return "Tendência de Alta";
      case MarketCondition.SIDEWAYS: return "Mercado Lateral";
      case MarketCondition.TREND_DOWN: return "Tendência de Baixa";
      case MarketCondition.STRONG_TREND_DOWN: return "Tendência Forte de Baixa";
      case MarketCondition.VOLATILE: return "Mercado Volátil";
      default: return "Desconhecido";
    }
  } else {
    switch (condition) {
      case MarketCondition.STRONG_TREND_UP: return "Strong Uptrend";
      case MarketCondition.TREND_UP: return "Uptrend";
      case MarketCondition.SIDEWAYS: return "Sideways Market";
      case MarketCondition.TREND_DOWN: return "Downtrend";
      case MarketCondition.STRONG_TREND_DOWN: return "Strong Downtrend";
      case MarketCondition.VOLATILE: return "Volatile Market";
      default: return "Unknown";
    }
  }
}

export function getTicketName(direction: 'CALL' | 'PUT' | 'NEUTRAL', language: string): string {
  if (language === 'pt-br') {
    switch (direction) {
      case 'CALL': return 'ALTA';
      case 'PUT': return 'BAIXA';
      case 'NEUTRAL': return 'NEUTRO';
      default: return direction;
    }
  }
  return direction;
}
