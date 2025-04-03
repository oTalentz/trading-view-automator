
// Lista de estratégias avançadas com descrições
export const ADVANCED_STRATEGIES = {
  MACD_CROSSOVER: {
    name: "MACD Crossover",
    minConfidence: 75,
    maxConfidence: 92,
    indicators: ["MACD", "Signal Line", "EMA 200"]
  },
  RSI_DIVERGENCE: {
    name: "RSI Divergence",
    minConfidence: 78,
    maxConfidence: 95,
    indicators: ["RSI(14)", "Price Action", "Support/Resistance"]
  },
  BOLLINGER_BREAKOUT: {
    name: "Bollinger Bands Breakout",
    minConfidence: 80,
    maxConfidence: 93,
    indicators: ["Bollinger Bands", "Volume", "ADX"]
  },
  SUPPORT_RESISTANCE: {
    name: "Key Level Reversal",
    minConfidence: 82,
    maxConfidence: 94,
    indicators: ["Support/Resistance", "Candlestick Patterns", "Volume"]
  },
  TREND_FOLLOWING: {
    name: "Multi-Timeframe Trend",
    minConfidence: 85,
    maxConfidence: 96,
    indicators: ["EMA Stack", "ADX", "Momentum"]
  },
  FIBONACCI_RETRACEMENT: {
    name: "Fibonacci Retracement",
    minConfidence: 83,
    maxConfidence: 97,
    indicators: ["Fibonacci Levels", "Price Action", "Previous Swings"]
  },
  ICHIMOKU_CLOUD: {
    name: "Ichimoku Cloud Analysis",
    minConfidence: 87,
    maxConfidence: 98,
    indicators: ["Kumo Cloud", "Tenkan/Kijun Cross", "Chikou Span"]
  }
};
