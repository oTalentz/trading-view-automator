
/**
 * Common type definitions for signal validation
 */
export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  reasons: string[];
  warningLevel: 'none' | 'low' | 'medium' | 'high';
}
