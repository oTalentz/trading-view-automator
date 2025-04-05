
/**
 * Types for sentiment analysis
 */

export interface SentimentSource {
  source: 'news' | 'twitter' | 'reddit' | 'stocktwits';
  text: string;
  url?: string;
  timestamp: string;
  score?: number;
}

export interface SentimentAnalysisResult {
  overallScore: number; // -100 a 100
  sources: SentimentSource[];
  latestUpdate: string;
  marketImpact: 'high' | 'medium' | 'low' | 'neutral';
  keywords: {word: string, count: number}[];
}
