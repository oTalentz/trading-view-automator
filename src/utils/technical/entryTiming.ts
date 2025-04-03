
// Determine best entry time based on price action and volatility
export const calculateOptimalEntryTiming = (): number => {
  // In a real system, this would analyze recent price action and volatility
  // For this implementation, we'll aim for a precise entry time at the start of a new minute
  const now = new Date();
  const secondsToNextMinute = 60 - now.getSeconds();
  
  // Add a small buffer to ensure we're at the very start of the new minute
  return secondsToNextMinute <= 3 ? secondsToNextMinute + 60 : secondsToNextMinute;
};
