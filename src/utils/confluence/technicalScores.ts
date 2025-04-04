
import { TimeframeAnalysis } from '@/types/timeframeAnalysis';
import { 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands 
} from '@/utils/technicalAnalysis';

// Helper function to calculate enhanced technical scores with less volatility
export const calculateEnhancedTechnicalScores = (
  prices: number[], 
  volume: number[],
  analysis: TimeframeAnalysis,
  adjustedConfidence: number
) => {
  // Calculate core indicators
  const rsiValue = calculateRSI(prices);
  const macdData = calculateMACD(prices);
  const bbands = calculateBollingerBands(prices);
  
  // Enhanced scoring with less random noise
  const rsiScore = 65 + (analysis.direction === 'CALL' ? 
                         Math.min(15, Math.max(-15, (50 - rsiValue) / 2)) : 
                         Math.min(15, Math.max(-15, (rsiValue - 50) / 2)));
  
  const macdScore = 70 + (analysis.direction === 'CALL' ?
                          Math.min(20, Math.max(-20, macdData.histogram * 100)) :
                          Math.min(20, Math.max(-20, -macdData.histogram * 100)));
  
  const currentPrice = prices[prices.length - 1];
  const bbPosition = (currentPrice - bbands.lower) / (bbands.upper - bbands.lower);
  const bbandsScore = 65 + (analysis.direction === 'CALL' ?
                           Math.min(25, Math.max(-25, (0.5 - bbPosition) * 50)) :
                           Math.min(25, Math.max(-25, (bbPosition - 0.5) * 50)));
  
  // Volume trend analysis with less noise
  const recentVolumes = volume.slice(-5);
  const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
  const volumeRatio = volume[volume.length - 1] / avgVolume;
  const volumeTrend = 60 + Math.min(30, Math.max(-20, (volumeRatio - 1) * 40));
  
  // Price action score based on recent patterns
  const priceChange = (currentPrice - prices[prices.length - 5]) / prices[prices.length - 5] * 100;
  const priceActionScore = 70 + (analysis.direction === 'CALL' ?
                                Math.min(20, Math.max(-20, priceChange * 2)) :
                                Math.min(20, Math.max(-20, -priceChange * 2)));
  
  // Overall score that matches the adjusted confidence
  return {
    rsi: Math.round(rsiScore),
    macd: Math.round(macdScore),
    bollingerBands: Math.round(bbandsScore),
    volumeTrend: Math.round(volumeTrend),
    priceAction: Math.round(priceActionScore),
    overallScore: Math.round(adjustedConfidence)
  };
};
