
import { TimeframeAnalysis } from '@/types/timeframeAnalysis';

export interface SignalHistoryEntry {
  id: string;
  symbol: string;
  direction: 'CALL' | 'PUT';
  confidence: number;
  timestamp: string;
  entryTime: string;
  expiryTime: string;
  timeframe: string;
  strategy?: string;
  result?: 'WIN' | 'LOSS' | 'DRAW' | null;
  profit?: number;
}

// Store up to 100 signals in local storage
const SIGNAL_HISTORY_KEY = 'trading-automator-signal-history';
const MAX_HISTORY_SIZE = 100;

export const saveSignalToHistory = (signal: Omit<SignalHistoryEntry, 'id'>): SignalHistoryEntry => {
  const history = getSignalHistory();
  const newSignal: SignalHistoryEntry = {
    ...signal,
    id: generateSignalId(),
  };
  
  // Add to beginning of array and limit size
  const updatedHistory = [newSignal, ...history].slice(0, MAX_HISTORY_SIZE);
  localStorage.setItem(SIGNAL_HISTORY_KEY, JSON.stringify(updatedHistory));
  
  return newSignal;
};

export const getSignalHistory = (): SignalHistoryEntry[] => {
  try {
    const history = localStorage.getItem(SIGNAL_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving signal history', error);
    return [];
  }
};

export const updateSignalResult = (id: string, result: 'WIN' | 'LOSS' | 'DRAW', profit?: number): boolean => {
  const history = getSignalHistory();
  const signalIndex = history.findIndex(signal => signal.id === id);
  
  if (signalIndex === -1) return false;
  
  history[signalIndex] = {
    ...history[signalIndex],
    result,
    profit
  };
  
  localStorage.setItem(SIGNAL_HISTORY_KEY, JSON.stringify(history));
  return true;
};

export const clearSignalHistory = (): void => {
  localStorage.removeItem(SIGNAL_HISTORY_KEY);
};

export const exportSignalHistory = (): string => {
  const history = getSignalHistory();
  const csv = [
    'Symbol,Direction,Confidence,Timestamp,Entry Time,Expiry Time,Timeframe,Result,Profit',
    ...history.map(signal => 
      `${signal.symbol},${signal.direction},${signal.confidence}%,${new Date(signal.timestamp).toLocaleString()},${new Date(signal.entryTime).toLocaleString()},${new Date(signal.expiryTime).toLocaleString()},${signal.timeframe},${signal.result || 'PENDING'},${signal.profit || 0}`
    )
  ].join('\n');
  
  return csv;
};

const generateSignalId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
