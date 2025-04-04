
import { StrategyDetails } from '../types';

/**
 * Define advanced trading strategies with their details
 */
export const ADVANCED_STRATEGIES: Record<string, StrategyDetails> = {
  'RSI_DIVERGENCE': {
    name: 'RSI Divergence',
    indicators: ['RSI', 'Price Action', 'Trend Analysis'],
    description: 'Identifica divergências entre preço e RSI para captar reversões',
    suitableMarketConditions: ['SIDEWAYS', 'TREND_UP', 'TREND_DOWN'],
    risk: 'medium'
  },
  'MACD_CROSSOVER': {
    name: 'MACD Crossover',
    indicators: ['MACD', 'Signal Line', 'Histogram'],
    description: 'Identifica cruzamentos do MACD com a linha de sinal',
    suitableMarketConditions: ['TREND_UP', 'TREND_DOWN', 'STRONG_TREND_UP', 'STRONG_TREND_DOWN'],
    risk: 'medium'
  },
  'BOLLINGER_BREAKOUT': {
    name: 'Bollinger Breakout',
    indicators: ['Bollinger Bands', 'Volatility', 'Price Action'],
    description: 'Identifica rompimentos das bandas de Bollinger',
    suitableMarketConditions: ['VOLATILE', 'SIDEWAYS'],
    risk: 'high'
  },
  'SUPPORT_RESISTANCE': {
    name: 'Support & Resistance',
    indicators: ['Support Levels', 'Resistance Levels', 'Price Action'],
    description: 'Opera em níveis de suporte e resistência',
    suitableMarketConditions: ['SIDEWAYS', 'TREND_UP', 'TREND_DOWN'],
    risk: 'low'
  },
  'TREND_FOLLOWING': {
    name: 'Trend Following',
    indicators: ['Moving Averages', 'ADX', 'Price Action'],
    description: 'Segue a direção da tendência atual',
    suitableMarketConditions: ['TREND_UP', 'TREND_DOWN', 'STRONG_TREND_UP', 'STRONG_TREND_DOWN'],
    risk: 'medium'
  },
  'FIBONACCI_RETRACEMENT': {
    name: 'Fibonacci Retracement',
    indicators: ['Fibonacci Levels', 'Trend Analysis', 'Price Action'],
    description: 'Usa níveis de Fibonacci para entradas e alvos',
    suitableMarketConditions: ['TREND_UP', 'TREND_DOWN', 'SIDEWAYS'],
    risk: 'medium'
  },
  'ICHIMOKU_CLOUD': {
    name: 'Ichimoku Cloud',
    indicators: ['Tenkan-sen', 'Kijun-sen', 'Kumo', 'Chikou Span'],
    description: 'Sistema completo de análise Ichimoku Kinko Hyo',
    suitableMarketConditions: ['TREND_UP', 'TREND_DOWN', 'STRONG_TREND_UP', 'STRONG_TREND_DOWN'],
    risk: 'medium'
  },
  'SENTIMENT_ENHANCED': {
    name: 'Sentiment Enhanced Strategy',
    indicators: ['Market Sentiment', 'Social Media Analysis', 'News Impact', 'Technical Confluence'],
    description: 'Combina análise técnica com dados de sentimento de mercado',
    suitableMarketConditions: ['SIDEWAYS', 'TREND_UP', 'TREND_DOWN', 'VOLATILE'],
    risk: 'medium'
  },
  'ML_ADAPTIVE': {
    name: 'ML Adaptive Strategy',
    indicators: ['Machine Learning', 'Pattern Recognition', 'Multi-timeframe Analysis'],
    description: 'Estratégia adaptativa baseada em aprendizado de máquina',
    suitableMarketConditions: ['SIDEWAYS', 'TREND_UP', 'TREND_DOWN', 'VOLATILE', 'STRONG_TREND_UP', 'STRONG_TREND_DOWN'],
    risk: 'medium'
  }
};
