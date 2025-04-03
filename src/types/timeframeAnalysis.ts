
import { MarketCondition } from '@/utils/technicalAnalysis';

export interface TimeframeAnalysis {
  direction: 'CALL' | 'PUT';
  confidence: number;
  strength: number;
  timeframe: string;
  label: string;
  marketCondition: MarketCondition;
}

export interface MultiTimeframeAnalysisResult {
  primarySignal: {
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
    entryQuality?: string; // Nova propriedade opcional
    technicalScores: {
      rsi: number;
      macd: number;
      bollingerBands: number;
      volumeTrend: number;
      priceAction: number;
      overallScore: number;
    };
    priceTargets?: {  // Nova propriedade opcional
      target: number;
      stopLoss: number;
    };
  };
  timeframes: TimeframeAnalysis[];
  overallConfluence: number;
  confluenceDirection: 'CALL' | 'PUT' | 'NEUTRAL';
  countdown: number;
}

// Lista de timeframes a analisar para confluência
export const CONFLUENCE_TIMEFRAMES = [
  { value: "1", label: "1m" },
  { value: "5", label: "5m" },
  { value: "15", label: "15m" },
  { value: "60", label: "1h" }
];
