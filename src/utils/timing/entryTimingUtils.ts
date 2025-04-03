
// Utility functions for calculating entry timing and expiry

/**
 * Calculates the optimal entry timing for a market order
 * @returns Number of seconds to wait for optimal entry
 */
export const calculateOptimalEntryTiming = (): number => {
  const now = new Date();
  const secondsToNextMinute = 60 - now.getSeconds();
  return secondsToNextMinute <= 3 ? secondsToNextMinute + 60 : secondsToNextMinute;
};

/**
 * Calculates expiry time in minutes based on the selected interval
 * @param interval The chart interval
 * @returns Expiry time in minutes
 */
export const calculateExpiryMinutes = (interval: string): number => {
  switch(interval) {
    case '1': return 1;
    case '5': return 5;
    case '15': return 15;
    case '30': return 30;
    case '60': return 60;
    case '240': return 240;
    case 'D': return 1440; // 24 horas
    case 'W': return 10080; // 7 dias
    default: return 1;
  }
};
