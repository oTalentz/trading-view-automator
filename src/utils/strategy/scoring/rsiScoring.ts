
/**
 * Calculates the score for RSI Divergence strategy
 */
export const calculateRSIScore = (
  strategyKey: string,
  rsiValue: number
): number => {
  if (strategyKey !== "RSI_DIVERGENCE") return 0;
  
  let score = 0;
  
  if (rsiValue < 30 || rsiValue > 70) {
    // Extreme RSI values get higher score
    score += Math.abs(rsiValue - 50) * 3; 
  } else {
    // Medium RSI values get lower score
    score += Math.abs(rsiValue - 50) * 1.5;
  }
  
  return score;
};
