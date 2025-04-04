
import { TimeframeAnalysis } from '@/types/timeframeAnalysis';

// Adjusts the confidence based on various market factors
export function adjustConfidence(
  baseConfidence: number,
  selectedAnalysis: TimeframeAnalysis,
  confluenceDirection: 'CALL' | 'PUT' | 'NEUTRAL',
  overallConfluence: number,
  volatility: number,
  currentPrice: number,
  supportLevel: number,
  resistanceLevel: number,
  prices: number[]
): number {
  let adjustedConfidence = baseConfidence;
  
  // 1. Adjust based on confluence direction
  if (selectedAnalysis.direction === confluenceDirection) {
    // Confluence supports the signal - boost confidence
    adjustedConfidence += Math.min(overallConfluence / 8, 15); // Max +15 boost
  } else if (confluenceDirection === 'NEUTRAL') {
    // Mixed signals - small reduction
    adjustedConfidence -= 5; 
  } else {
    // Confluence opposes the signal - significant reduction
    adjustedConfidence -= Math.min(overallConfluence / 4, 20); // Max -20 reduction
  }
  
  // 2. Volatility filter - reduce confidence in high volatility
  if (volatility > 0.015) {
    adjustedConfidence -= Math.min(Math.round(volatility * 400), 15);
  }
  
  // 3. Trend strength bonus for aligned signals
  if (selectedAnalysis.strength > 70 && 
      ((selectedAnalysis.direction === 'CALL' && confluenceDirection === 'CALL') ||
       (selectedAnalysis.direction === 'PUT' && confluenceDirection === 'PUT'))) {
    adjustedConfidence += 5;
  }
  
  // 4. Support/resistance proximity bonus
  const distanceToSupport = Math.abs(currentPrice - supportLevel) / currentPrice;
  const distanceToResistance = Math.abs(currentPrice - resistanceLevel) / currentPrice;
  
  if (selectedAnalysis.direction === 'CALL' && distanceToSupport < 0.01) {
    // Price near support, good for CALL
    adjustedConfidence += 5;
  } else if (selectedAnalysis.direction === 'PUT' && distanceToResistance < 0.01) {
    // Price near resistance, good for PUT
    adjustedConfidence += 5;
  }
  
  // 5. Recent price action consideration
  const priceChange = (currentPrice - prices[prices.length - 5]) / prices[prices.length - 5];
  if ((selectedAnalysis.direction === 'CALL' && priceChange > 0.005) ||
      (selectedAnalysis.direction === 'PUT' && priceChange < -0.005)) {
    adjustedConfidence += 3;
  }
  
  // Ensure reasonable confidence range
  adjustedConfidence = Math.round(adjustedConfidence);
  adjustedConfidence = Math.min(Math.max(adjustedConfidence, 60), 96);
  
  return adjustedConfidence;
}
