
// Lista de estratégias avançadas com descrições
export const ADVANCED_STRATEGIES = {
  MACD_CROSSOVER: {
    name: "MACD Crossover",
    minConfidence: 75,
    maxConfidence: 92,
    indicators: ["MACD", "Signal Line", "EMA 200"],
    description: "Identifies momentum shifts using MACD line crossing the signal line",
    bestMarketConditions: ["TREND_UP", "TREND_DOWN"],
    timeframes: ["5", "15", "30"]
  },
  RSI_DIVERGENCE: {
    name: "RSI Divergence",
    minConfidence: 78,
    maxConfidence: 95,
    indicators: ["RSI(14)", "Price Action", "Support/Resistance"],
    description: "Detects divergence between price movement and RSI indicator",
    bestMarketConditions: ["SIDEWAYS", "TREND_UP", "TREND_DOWN"],
    timeframes: ["15", "30", "60"]
  },
  BOLLINGER_BREAKOUT: {
    name: "Bollinger Bands Breakout",
    minConfidence: 80,
    maxConfidence: 93,
    indicators: ["Bollinger Bands", "Volume", "ADX"],
    description: "Identifies breakouts from Bollinger Bands during volatile conditions",
    bestMarketConditions: ["VOLATILE"],
    timeframes: ["1", "5", "15"]
  },
  SUPPORT_RESISTANCE: {
    name: "Key Level Reversal",
    minConfidence: 82,
    maxConfidence: 94,
    indicators: ["Support/Resistance", "Candlestick Patterns", "Volume"],
    description: "Identifies reversals at key support and resistance levels",
    bestMarketConditions: ["SIDEWAYS"],
    timeframes: ["15", "30", "60"]
  },
  TREND_FOLLOWING: {
    name: "Multi-Timeframe Trend",
    minConfidence: 85,
    maxConfidence: 96,
    indicators: ["EMA Stack", "ADX", "Momentum"],
    description: "Follows established trends using multi-timeframe confirmation",
    bestMarketConditions: ["STRONG_TREND_UP", "STRONG_TREND_DOWN"],
    timeframes: ["5", "15", "30", "60"]
  },
  FIBONACCI_RETRACEMENT: {
    name: "Fibonacci Retracement",
    minConfidence: 83,
    maxConfidence: 97,
    indicators: ["Fibonacci Levels", "Price Action", "Previous Swings"],
    description: "Uses Fibonacci retracement levels to identify potential reversal zones",
    bestMarketConditions: ["SIDEWAYS", "TREND_UP", "TREND_DOWN"],
    timeframes: ["15", "30", "60", "240"]
  },
  ICHIMOKU_CLOUD: {
    name: "Ichimoku Cloud Analysis",
    minConfidence: 87,
    maxConfidence: 98,
    indicators: ["Kumo Cloud", "Tenkan/Kijun Cross", "Chikou Span"],
    description: "Uses the Ichimoku Cloud system for comprehensive trend analysis",
    bestMarketConditions: ["TREND_UP", "TREND_DOWN", "STRONG_TREND_UP", "STRONG_TREND_DOWN"],
    timeframes: ["30", "60", "240", "D"]
  }
};

// Define market condition compatibility for strategy selection
export const MARKET_CONDITION_STRATEGIES = {
  STRONG_TREND_UP: ["TREND_FOLLOWING", "ICHIMOKU_CLOUD"],
  TREND_UP: ["MACD_CROSSOVER", "ICHIMOKU_CLOUD", "FIBONACCI_RETRACEMENT"],
  SIDEWAYS: ["SUPPORT_RESISTANCE", "RSI_DIVERGENCE", "FIBONACCI_RETRACEMENT"],
  TREND_DOWN: ["MACD_CROSSOVER", "ICHIMOKU_CLOUD", "FIBONACCI_RETRACEMENT"],
  STRONG_TREND_DOWN: ["TREND_FOLLOWING", "ICHIMOKU_CLOUD"],
  VOLATILE: ["BOLLINGER_BREAKOUT", "RSI_DIVERGENCE"]
};
