
// User profile and settings types

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  tradingPreferences: TradingPreferences;
  notificationSettings: NotificationSettings;
  soundSettings: SoundSettings;
  alertSettings: AlertSettings;
  createdAt: string;
  lastActive: string;
}

export interface TradingPreferences {
  defaultSymbol: string;
  defaultTimeframe: string;
  favoriteSymbols: string[];
  defaultInvestmentAmount: number;
  riskLevel: 'low' | 'medium' | 'high';
  autoTrade: boolean;
  tradingHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  };
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  signalAlerts: boolean;
  entryTimeAlerts: boolean;
  resultAlerts: boolean;
  dailySummary: boolean;
}

export interface SoundSettings {
  enabled: boolean;
  signalAlerts: boolean;
  entryAlerts: boolean;
  notificationAlerts: boolean;
  volume: number;
}

export interface AlertSettings {
  customAlerts: AlertConfig[];
  minConfluenceThreshold: number;
  minConfidenceThreshold: number;
  enableSkullAlerts: boolean; // Alerta para confluências máximas (caveira)
  enableHeartAlerts: boolean; // Alerta para confluências médias (coração)
  alertOnlyForFavorites: boolean;
}

export interface AlertConfig {
  id: string;
  name: string;
  enabled: boolean;
  confluenceThreshold: number;
  confidenceThreshold: number;
  timeframes: string[];
  symbols: string[];
  directions: ('CALL' | 'PUT' | 'BOTH')[];
  notificationType: 'all' | 'sound' | 'push' | 'none';
  createdAt: string;
}

export const defaultUserProfile: UserProfile = {
  id: 'default',
  name: 'Trader',
  tradingPreferences: {
    defaultSymbol: 'BINANCE:BTCUSDT',
    defaultTimeframe: '1',
    favoriteSymbols: ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'FX:EURUSD'],
    defaultInvestmentAmount: 100,
    riskLevel: 'medium',
    autoTrade: false,
    tradingHours: {
      enabled: false,
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
    }
  },
  notificationSettings: {
    pushEnabled: true,
    emailEnabled: false,
    signalAlerts: true,
    entryTimeAlerts: true,
    resultAlerts: true,
    dailySummary: false
  },
  soundSettings: {
    enabled: true,
    signalAlerts: true,
    entryAlerts: true,
    notificationAlerts: true,
    volume: 0.7
  },
  alertSettings: {
    customAlerts: [],
    minConfluenceThreshold: 70,
    minConfidenceThreshold: 75,
    enableSkullAlerts: true,
    enableHeartAlerts: true,
    alertOnlyForFavorites: false
  },
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString()
};
