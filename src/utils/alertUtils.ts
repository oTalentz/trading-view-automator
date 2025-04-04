
import { AlertConfig } from '@/types/userProfile';
import { v4 as uuidv4 } from 'uuid';

// Function to generate a UUID
export const generateId = () => uuidv4();

// Load alert settings from localStorage
export const loadAlertSettings = () => {
  const savedSettings = localStorage.getItem('trading-automator-alert-settings');
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (e) {
      console.error("Error parsing alert settings:", e);
    }
  }
  return {
    customAlerts: [],
    minConfluenceThreshold: 70,
    minConfidenceThreshold: 75,
    enableSkullAlerts: true,
    enableHeartAlerts: true,
    alertOnlyForFavorites: false
  };
};

// Save alert settings to localStorage
export const saveAlertSettings = (settings: any) => {
  localStorage.setItem('trading-automator-alert-settings', JSON.stringify(settings));
};

// Available timeframes and symbols for alerts
export const availableTimeframes = ['1', '5', '15', '30', '60', '240', 'D', 'W'];

export const availableSymbols = [
  // Criptomoedas
  'BINANCE:BTCUSDT',
  'BINANCE:ETHUSDT',
  'BINANCE:SOLUSDT',
  'BINANCE:BNBUSDT',
  'BINANCE:ADAUSDT',
  'BINANCE:DOGEUSDT',
  
  // Pares de Moedas Forex - Major
  'FX:EURUSD',
  'FX:GBPUSD',
  'FX:USDJPY',
  'FX:AUDUSD',
  'FX:USDCAD',
  'FX:NZDUSD',
  'FX:USDCHF',
  
  // Pares de Moedas Forex - Cross
  'FX:EURGBP',
  'FX:EURJPY',
  'FX:GBPJPY',
  'FX:CADJPY',
  'FX:AUDNZD',
  'FX:AUDCAD',
  'FX:EURAUD',
  'FX:GBPCAD',
  
  // Pares de Moedas Forex - Exóticos
  'FX:USDBRL',
  'FX:EURBRL',
  'FX:USDMXN',
  'FX:USDZAR',
  'FX:USDTRY',
  'FX:EURPLN',
  
  // Ações
  'NASDAQ:AAPL',
  'NASDAQ:MSFT',
  'NASDAQ:AMZN',
  'NASDAQ:GOOGL',
  'NASDAQ:META',
  'NYSE:TSLA',
];
