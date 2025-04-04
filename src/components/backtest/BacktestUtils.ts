
import { SignalHistoryEntry } from '@/utils/signalHistoryUtils';

// Calculate consecutive wins/losses streaks
export const calculateStreaks = (signals: SignalHistoryEntry[]) => {
  if (!signals.length) return { maxWinStreak: 0, maxLossStreak: 0, currentStreak: 0 };
  
  // Sort signals by timestamp
  const sortedSignals = [...signals].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentStreak = 0;
  let currentStreakType: 'WIN' | 'LOSS' | null = null;
  
  sortedSignals.forEach(signal => {
    if (signal.result === 'WIN') {
      currentWinStreak++;
      currentLossStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      
      if (currentStreakType === 'WIN') {
        currentStreak++;
      } else {
        currentStreakType = 'WIN';
        currentStreak = 1;
      }
    } else if (signal.result === 'LOSS') {
      currentLossStreak++;
      currentWinStreak = 0;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      
      if (currentStreakType === 'LOSS') {
        currentStreak++;
      } else {
        currentStreakType = 'LOSS';
        currentStreak = 1;
      }
    }
  });
  
  return { 
    maxWinStreak, 
    maxLossStreak, 
    currentStreak,
    currentStreakType 
  };
};

// Determine candle accuracy of strategies
export const determineCandleAccuracy = (signals: SignalHistoryEntry[]) => {
  const candleAccuracy: Record<string, { accurate: number, total: number, timeframes: Record<string, { accurate: number, total: number }> }> = {};
  
  // Group by strategy
  signals.forEach(signal => {
    if (!signal.result) return;
    
    const strategy = signal.strategy || 'Unknown';
    const timeframe = signal.timeframe || '1';
    
    if (!candleAccuracy[strategy]) {
      candleAccuracy[strategy] = { 
        accurate: 0, 
        total: 0,
        timeframes: {}
      };
    }
    
    if (!candleAccuracy[strategy].timeframes[timeframe]) {
      candleAccuracy[strategy].timeframes[timeframe] = {
        accurate: 0,
        total: 0
      };
    }
    
    candleAccuracy[strategy].total++;
    candleAccuracy[strategy].timeframes[timeframe].total++;
    
    if (signal.result === 'WIN') {
      candleAccuracy[strategy].accurate++;
      candleAccuracy[strategy].timeframes[timeframe].accurate++;
    }
  });
  
  return candleAccuracy;
};

// Calculate wins by weekday
export const calculateWinsByDay = (signals: SignalHistoryEntry[]) => {
  const dayData: Record<number, { wins: number, losses: number, total: number }> = {
    0: { wins: 0, losses: 0, total: 0 }, // Sunday
    1: { wins: 0, losses: 0, total: 0 },
    2: { wins: 0, losses: 0, total: 0 },
    3: { wins: 0, losses: 0, total: 0 },
    4: { wins: 0, losses: 0, total: 0 },
    5: { wins: 0, losses: 0, total: 0 },
    6: { wins: 0, losses: 0, total: 0 }  // Saturday
  };
  
  signals.forEach(signal => {
    if (!signal.result) return;
    
    const date = new Date(signal.timestamp);
    const day = date.getDay();
    
    dayData[day].total++;
    
    if (signal.result === 'WIN') {
      dayData[day].wins++;
    } else if (signal.result === 'LOSS') {
      dayData[day].losses++;
    }
  });
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return Object.entries(dayData).map(([day, data]) => {
    const winRate = data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0;
    return {
      day: dayNames[parseInt(day)],
      winRate,
      wins: data.wins,
      losses: data.losses,
      total: data.total
    };
  });
};

// Calculate wins by hour
export const calculateWinsByHour = (signals: SignalHistoryEntry[]) => {
  const hourData: Record<number, { wins: number, losses: number, total: number }> = {};
  
  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    hourData[i] = { wins: 0, losses: 0, total: 0 };
  }
  
  signals.forEach(signal => {
    if (!signal.result) return;
    
    const date = new Date(signal.timestamp);
    const hour = date.getHours();
    
    hourData[hour].total++;
    
    if (signal.result === 'WIN') {
      hourData[hour].wins++;
    } else if (signal.result === 'LOSS') {
      hourData[hour].losses++;
    }
  });
  
  return Object.entries(hourData).map(([hour, data]) => {
    const winRate = data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0;
    // Fix padStart by converting to string first
    const hourStr = parseInt(hour).toString().padStart(2, '0');
    return {
      hour: `${hourStr}:00`,
      winRate,
      wins: data.wins,
      losses: data.losses,
      total: data.total
    };
  });
};
