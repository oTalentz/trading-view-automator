// Determine best entry time based on price action and volatility
export const calculateOptimalEntryTiming = (): number => {
  // In a real system, this would analyze recent price action and volatility
  const now = new Date();
  
  // Calculate seconds to next minute
  const secondsToNextMinute = 60 - now.getSeconds();
  
  // More precise entry logic with buffer:
  // If we're close to the minute change (< 3 seconds), wait for the next one
  // This avoids potential race conditions at minute boundaries
  if (secondsToNextMinute <= 3) {
    return secondsToNextMinute + 60;
  }
  
  // If we're in the middle of a minute (30-45 seconds past), 
  // it's often a good entry point after price has stabilized
  if (now.getSeconds() >= 30 && now.getSeconds() <= 45) {
    return 0; // Signal to enter immediately
  }
  
  // Otherwise, aim for the start of the next minute which often
  // coincides with new candle formations in many platforms
  return secondsToNextMinute;
};

// Calculate ideal expiry time based on volatility and trend strength
export const calculateOptimalExpiryTime = (
  interval: string, 
  volatility: number, 
  trendStrength: number
): number => {
  let baseExpiry = parseInt(interval) || 1; // Default to interval minutes
  
  // Adjust for trend strength - stronger trends can have longer expiry
  if (trendStrength > 80) {
    baseExpiry = Math.round(baseExpiry * 1.5); // 50% longer for strong trends
  } else if (trendStrength < 40) {
    baseExpiry = Math.max(Math.round(baseExpiry * 0.75), 1); // 25% shorter for weak trends
  }
  
  // Adjust for volatility - higher volatility needs closer expiry
  if (volatility > 0.015) {
    baseExpiry = Math.max(Math.round(baseExpiry * 0.7), 1); // 30% shorter for high volatility
  } else if (volatility < 0.005) {
    baseExpiry = Math.round(baseExpiry * 1.2); // 20% longer for low volatility
  }
  
  return baseExpiry;
};
