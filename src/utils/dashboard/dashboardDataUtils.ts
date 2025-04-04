
import { MarketCondition } from '@/utils/technicalAnalysis';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';

/**
 * Filter signals by time range
 */
export const filterSignalsByTimeRange = (signals: any[], timeRange: '7d' | '30d' | 'all') => {
  return signals.filter(signal => {
    if (timeRange === 'all') return true;
    
    const signalDate = new Date(signal.timestamp);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - signalDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (timeRange === '7d') return daysDiff <= 7;
    if (timeRange === '30d') return daysDiff <= 30;
    
    return true;
  });
};

/**
 * Get win rate by confidence level
 */
export const getWinRateByConfidence = (completedSignals: any[]) => {
  // Define confidence levels
  const levels = [
    { min: 0, max: 70, label: '<70%' },
    { min: 70, max: 80, label: '70-80%' },
    { min: 80, max: 90, label: '80-90%' },
    { min: 90, max: 100, label: '>90%' }
  ];
  
  // Calculate win rate for each level
  return levels.map(level => {
    const signalsInLevel = completedSignals.filter(
      s => s.confidence >= level.min && s.confidence < level.max
    );
    
    const winsInLevel = signalsInLevel.filter(s => s.result === 'WIN').length;
    const winRate = signalsInLevel.length > 0 
      ? Math.round((winsInLevel / signalsInLevel.length) * 100) 
      : 0;
    
    return {
      label: level.label,
      winRate: winRate,
      count: signalsInLevel.length
    };
  });
};

/**
 * Generate time series data for performance tracking
 */
export const getTimeSeriesData = (filteredSignals: any[]) => {
  // Group signals by day
  const signalsByDay: Record<string, any> = {};
  
  filteredSignals.forEach(signal => {
    const date = new Date(signal.timestamp);
    const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD format
    
    if (!signalsByDay[dateStr]) {
      signalsByDay[dateStr] = {
        date: dateStr,
        totalSignals: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        pending: 0
      };
    }
    
    signalsByDay[dateStr].totalSignals += 1;
    
    if (signal.result === 'WIN') {
      signalsByDay[dateStr].wins += 1;
    } else if (signal.result === 'LOSS') {
      signalsByDay[dateStr].losses += 1;
    } else if (signal.result === 'DRAW') {
      signalsByDay[dateStr].draws += 1;
    } else {
      signalsByDay[dateStr].pending += 1;
    }
  });
  
  // Convert to array and sort by date
  return Object.values(signalsByDay).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

/**
 * Create mock analysis for testing
 */
export const createMockAnalysis = (): MultiTimeframeAnalysisResult => {
  return {
    primarySignal: {
      direction: 'CALL' as 'CALL' | 'PUT' | 'NEUTRAL',
      confidence: 78,
      timestamp: new Date().toISOString(),
      entryTime: new Date().toISOString(),
      expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      strategy: "Multi-Timeframe Confluence",
      indicators: ["RSI", "MACD", "Bollinger Bands"],
      trendStrength: 65,
      marketCondition: MarketCondition.STRONG_TREND_UP,
      supportResistance: {
        support: 100,
        resistance: 110
      },
      technicalScores: {
        rsi: 70,
        macd: 65,
        bollingerBands: 75,
        volumeTrend: 60,
        priceAction: 80,
        overallScore: 70
      }
    },
    overallConfluence: 78,
    confluenceDirection: 'CALL' as 'CALL' | 'PUT' | 'NEUTRAL',
    timeframes: [
      { 
        label: '1m', 
        timeframe: '1', 
        confidence: 65, 
        direction: 'CALL' as 'CALL' | 'PUT' | 'NEUTRAL', 
        strength: 60,
        marketCondition: MarketCondition.TREND_UP 
      },
      { 
        label: '5m', 
        timeframe: '5', 
        confidence: 82, 
        direction: 'CALL' as 'CALL' | 'PUT' | 'NEUTRAL', 
        strength: 75,
        marketCondition: MarketCondition.STRONG_TREND_UP
      },
      { 
        label: '15m', 
        timeframe: '15', 
        confidence: 75, 
        direction: 'NEUTRAL' as 'CALL' | 'PUT' | 'NEUTRAL', 
        strength: 65,
        marketCondition: MarketCondition.SIDEWAYS 
      },
      { 
        label: '1h', 
        timeframe: '60', 
        confidence: 90, 
        direction: 'CALL' as 'CALL' | 'PUT' | 'NEUTRAL', 
        strength: 85,
        marketCondition: MarketCondition.STRONG_TREND_UP
      },
    ],
    countdown: 60
  };
};
