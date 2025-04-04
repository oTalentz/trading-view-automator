
import { MarketCondition } from '@/utils/technical/enums';

export interface TechnicalScores {
  rsi: number;
  macd: number;
  bollingerBands: number;
  volumeTrend: number;
  priceAction: number;
  overallScore: number;
}

export interface SupportResistance {
  support: number;
  resistance: number;
  supportLevels?: Array<{ price: number; strength: number }>;
  resistanceLevels?: Array<{ price: number; strength: number }>;
}

export interface ValidationDetails {
  reasons: string[];
  warningLevel: 'none' | 'low' | 'medium' | 'high';
  isValid: boolean;
}

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
  supportResistance: SupportResistance;
  technicalScores: TechnicalScores;
  countdownSeconds: number;
  validationDetails?: ValidationDetails;
}
