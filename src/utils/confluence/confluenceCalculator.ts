
import { TimeframeAnalysis } from '@/types/timeframeAnalysis';

// Calcula a direção da confluência baseada na análise de múltiplos timeframes
export function calculateConfluenceDirection(
  timeframeAnalyses: TimeframeAnalysis[],
  interval: string
): { 
  confluenceDirection: 'CALL' | 'PUT' | 'NEUTRAL', 
  overallConfluence: number,
  callVotes: number,
  putVotes: number,
  totalConfidence: number
} {
  let callVotes = 0;
  let putVotes = 0;
  let totalConfidence = 0;
  
  // Apply dynamic timeframe weighting - higher weight for higher timeframes
  timeframeAnalyses.forEach(tf => {
    // Dynamic weight based on timeframe and selected interval
    let weight = 1.0;
    
    // Selected timeframe gets higher weight
    if (tf.timeframe === interval) {
      weight = 1.8;
    } 
    // Higher timeframes get more weight in general (more reliable signals)
    else if (parseInt(tf.timeframe) > parseInt(interval)) {
      weight = 1.4;
    }
    // Weight by trend strength - stronger trends get more weight
    weight *= (tf.strength / 60);
    
    // Apply weighted voting
    if (tf.direction === 'CALL') {
      callVotes += tf.confidence * weight;
    } else {
      putVotes += tf.confidence * weight;
    }
    totalConfidence += tf.confidence * weight;
  });
  
  // Determine confluence direction with stringent criteria
  let confluenceDirection: 'CALL' | 'PUT' | 'NEUTRAL';
  const confluenceThreshold = 0.15; // 15% difference threshold
  const callPercentage = callVotes / totalConfidence;
  const putPercentage = putVotes / totalConfidence;
  
  if (callPercentage > putPercentage && callPercentage - putPercentage > confluenceThreshold) {
    confluenceDirection = 'CALL';
  } else if (putPercentage > callPercentage && putPercentage - callPercentage > confluenceThreshold) {
    confluenceDirection = 'PUT';
  } else {
    confluenceDirection = 'NEUTRAL';
  }
  
  // Calculate confidence strength (0-100) with reduced volatility
  let overallConfluence = Math.abs(callVotes - putVotes) / totalConfidence * 100;
  
  // Apply smoothing to reduce volatility in confluence score
  overallConfluence = Math.round(overallConfluence);
  overallConfluence = Math.min(overallConfluence, 95); // Cap at 95 for realism
  
  return {
    confluenceDirection,
    overallConfluence,
    callVotes,
    putVotes,
    totalConfidence
  };
}
