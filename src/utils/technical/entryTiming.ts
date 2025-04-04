
// Advanced utilities for entry timing and expiration

// Determine the optimal entry moment based on price action, volatility, and candle patterns
export const calculateOptimalEntryTiming = (): number => {
  // In a real system, this would analyze recent price action and volatility
  const now = new Date();
  
  // Factors affecting optimal timing:
  // 1. Seconds to next minute (important for candle-based platforms)
  // 2. Time of day (certain periods have more liquidity and lower spread)
  // 3. Position of seconds in the current minute (some seconds are better than others)
  
  // Calculate seconds to next minute
  const secondsToNextMinute = 60 - now.getSeconds();
  
  // More precise entry logic:
  
  // Case 1: If we're very close to the minute change (< 3 seconds),
  // wait for the next one (avoids race conditions at minute boundary)
  if (secondsToNextMinute <= 3) {
    return secondsToNextMinute + 2; // Add 2 seconds buffer after minute change
  }
  
  // Case 2: If we're at a good moment for immediate entry
  // (between 15-20 seconds or 42-48 seconds after the minute),
  // which are moments of higher price stability in many instruments:
  const secondsInMinute = now.getSeconds();
  if ((secondsInMinute >= 15 && secondsInMinute <= 20) || 
      (secondsInMinute >= 42 && secondsInMinute <= 48)) {
    return 0; // Immediate entry
  }
  
  // Case 3: If we're near the middle of the minute, wait for the 42 second mark
  // (moment of higher stability after partial candle formation)
  if (secondsInMinute > 20 && secondsInMinute < 42) {
    return 42 - secondsInMinute;
  }
  
  // Case 4: For other cases, target the next 15-second mark
  // which often coincides with new candle formation in many platforms
  if (secondsInMinute > 48) {
    return secondsToNextMinute + 15; // 15 seconds into next minute
  } else {
    const nextEntryPoint = 15 - (secondsInMinute % 15);
    return nextEntryPoint > 0 ? nextEntryPoint : 15;
  }
};

// Calculate optimal expiry time based on volatility, trend strength and time of day
export const calculateOptimalExpiryTime = (
  interval: string, 
  volatility: number, 
  trendStrength: number
): number => {
  let baseExpiry = parseInt(interval) || 1; // Use interval as base in minutes
  
  // Factor 1: Adjust for trend strength - stronger trends can have longer expiry
  if (trendStrength > 85) {
    baseExpiry = Math.round(baseExpiry * 1.8); // 80% longer for very strong trends
  } else if (trendStrength > 70) {
    baseExpiry = Math.round(baseExpiry * 1.4); // 40% longer for strong trends
  } else if (trendStrength > 60) {
    baseExpiry = Math.round(baseExpiry * 1.2); // 20% longer for moderate trends
  } else if (trendStrength < 40) {
    baseExpiry = Math.max(Math.round(baseExpiry * 0.75), 1); // 25% shorter for weak trends
  }
  
  // Factor 2: Adjust for volatility - higher volatility needs closer expiry
  if (volatility > 0.018) { // Very high volatility
    baseExpiry = Math.max(Math.round(baseExpiry * 0.6), 1); // 40% shorter
  } else if (volatility > 0.012) { // High volatility
    baseExpiry = Math.max(Math.round(baseExpiry * 0.8), 1); // 20% shorter
  } else if (volatility < 0.005) { // Very low volatility
    baseExpiry = Math.round(baseExpiry * 1.25); // 25% longer
  }
  
  // Factor 3: Check time of day for adjustment (in real system)
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // Higher volatility times (market openings/closings) need shorter expiry
  if ((hour === 9 && minute < 45) || (hour === 16 && minute > 15)) {
    baseExpiry = Math.max(Math.round(baseExpiry * 0.8), 1); // 20% shorter
  }
  
  // Low liquidity times need longer expiry
  if ((hour === 12 && minute > 15) || (hour === 13 && minute < 30)) {
    baseExpiry = Math.round(baseExpiry * 1.2); // 20% longer
  }
  
  // Ensure expiry is within reasonable limits
  return Math.min(Math.max(baseExpiry, 1), 60); // Between 1 and 60 minutes
};
