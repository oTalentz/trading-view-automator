
// Types for alerts
export interface AlertCondition {
  id: string;
  type: 'price' | 'indicator' | 'confluence' | 'pattern' | 'volatility';
  indicator?: string;
  comparison: 'above' | 'below' | 'crosses_above' | 'crosses_below' | 'equals';
  value: number;
  timeframe?: string;
}

export interface Alert {
  id: string;
  name: string;
  symbol: string;
  enabled: boolean;
  conditions: AlertCondition[];
  notifyVia: ('sound' | 'toast' | 'email')[];
  createdAt: string;
  lastTriggered?: string;
}
