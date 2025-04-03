
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
export const availableTimeframes = ['1', '5', '15', '30', '60', '240', 'D'];

export const availableSymbols = [
  'BINANCE:BTCUSDT',
  'BINANCE:ETHUSDT',
  'BINANCE:BNBUSDT',
  'FX:EURUSD',
  'FX:GBPUSD',
  'FX:USDJPY'
];
