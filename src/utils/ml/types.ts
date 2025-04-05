
/**
 * Tipos para as funções de otimização e análise de IA
 */

export interface Pattern {
  name: string;
  confidence: number;
  action: 'BUY' | 'SELL' | 'HOLD';
}

export interface AIOptimizationResult {
  detectedPatterns: string[];
  reliability: number;
  recommendedTimeframes: string[];
  optimalParameters: {
    rsiPeriod: number;
    macdFast: number;
    macdSlow: number;
    bollingerPeriod: number;
  };
}

export interface PatternAnalysisResult {
  patterns: Pattern[];
  overallConfidence: number;
  recommendedAction: 'BUY' | 'SELL' | 'HOLD';
}

export interface EnhancedAnalysis extends Record<string, any> {
  aiEnhanced: boolean;
  aiOptimizationScore: number;
  overallConfluence?: number;
  primarySignal?: {
    confidence: number;
  };
}
