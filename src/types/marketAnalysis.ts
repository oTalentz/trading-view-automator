
import { MarketCondition } from '@/utils/technical/enums';

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
    priceAction: number;
    volumeTrend: number;
    overallScore: number;
  };
  countdownSeconds: number;
  validationDetails: {
    reasons: string[];
    warningLevel: 'none' | 'low' | 'medium' | 'high';
    isValid: boolean;
  };
  // Campos adicionados para a integração de sentimento e ML
  sentimentData?: {
    score: number;
    impact: 'high' | 'medium' | 'low' | 'neutral';
    keywords: {word: string, count: number}[];
    lastUpdate: string;
  };
  // Campos adicionados para seleção dinâmica de estratégia com ML
  mlConfidenceScore?: number;
  selectionReasons?: string[];
  alternativeStrategies?: {
    name: string;
    confidenceScore: number;
  }[];
}
