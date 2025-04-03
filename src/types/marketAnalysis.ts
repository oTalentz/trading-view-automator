
import { MarketCondition } from '@/utils/technicalAnalysis';

export interface MarketAnalysisResult {
  direction: 'CALL' | 'PUT';
  confidence: number;
  timestamp: string;
  entryTime: string;
  expiryTime: string;
  strategy: string;
  indicators: string[];
  trendStrength: number;
  marketCondition: MarketCondition;
  supportResistance: {
    support: number;
    resistance: number;
  };
  technicalScores: {
    rsi: number;
    macd: number;
    bollingerBands: number;
    volumeTrend: number;
    priceAction: number;
    overallScore: number;
  };
  countdownSeconds: number;
}
