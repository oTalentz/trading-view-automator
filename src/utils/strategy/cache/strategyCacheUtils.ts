
import { 
  MarketCondition, 
  MACDData, 
  type BollingerBands 
} from '@/utils/technicalAnalysis';
import { StrategyWithDetails } from '../types';
import { cacheService } from '../../cacheSystem';

/**
 * Gera uma chave de cache para estratégias
 */
export function generateStrategyCacheKey(
  marketCondition: MarketCondition,
  prices: number[],
  volume: number[],
  rsi: number,
  macd: MACDData,
  bollingerBands: BollingerBands,
  volatility: number,
  trendStrength: number,
  sentimentScore: number | undefined = undefined
): string {
  // Criar um hash de parâmetros relevantes
  return cacheService.generateKey('strategy-selection', {
    market: marketCondition,
    rsi: Math.round(rsi),
    macd: Math.round(macd.histogram * 100) / 100,
    bb: {
      width: Math.round(bollingerBands.width * 100) / 100,
      percentB: Math.round(bollingerBands.percentB * 100) / 100
    },
    volatility: Math.round(volatility * 100) / 100,
    trend: Math.round(trendStrength * 100) / 100,
    sentiment: sentimentScore ? Math.round(sentimentScore) : undefined,
    lastPrice: prices[prices.length - 1],
    lastVolume: volume[volume.length - 1]
  });
}

/**
 * Armazena uma estratégia em cache
 */
export function cacheStrategy(
  key: string,
  strategy: StrategyWithDetails,
  ttl: number = 300 // 5 minutes default
): void {
  cacheService.set(key, strategy, ttl);
}

/**
 * Recupera uma estratégia do cache
 */
export function getCachedStrategy(key: string): StrategyWithDetails | null {
  return cacheService.get<StrategyWithDetails>(key);
}
