
import { SupportResistance } from '../technicalAnalysis';

export interface DrawSupportResistanceParams {
  chart: any;
  supportResistance: SupportResistance;
  language: string;
}

export interface DrawSignalTextParams {
  chart: any;
  direction: 'CALL' | 'PUT';
  confidence: number;
  strategy: string;
  overallConfluence: number;
  language: string;
}

export interface DrawEntryMarkerParams {
  chart: any;
  direction: 'CALL' | 'PUT';
  overallConfluence: number;
  confidence: number;
  language: string;
}

export interface DrawHistoricalMarkersParams {
  chart: any;
}

export interface DrawTechnicalAnalysisParams {
  chart: any;
  strategy: string;
  confidence: number;
  overallConfluence: number;
  trendStrength: number;
  language: string;
  theme: string;
}

export interface DrawLegendParams {
  chart: any;
  language: string;
  theme: string;
}

export interface DrawTimeframeInfoParams {
  chart: any;
  timeframes: Array<{
    timeframe: string;
    label: string;
    direction: 'CALL' | 'PUT';
    confidence: number;
  }>;
  interval: string;
}
