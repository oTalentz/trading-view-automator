
/**
 * Calculates detailed technical scores for various indicators
 */
export const calculateTechnicalScores = (
  rsiValue: number,
  macdData: any,
  bbands: any,
  prices: number[],
  volume: number[],
  trendStrengthValue: number
) => {
  const currentPrice = prices[prices.length - 1];
  
  // RSI score - normalized between 0-100
  const rsiDelta = Math.abs(rsiValue - 50);
  const rsiScore = Math.min(rsiDelta * 2, 100);
  
  // MACD score - normalized between 0-100
  const macdScore = Math.min(Math.abs(macdData.histogram) * 25, 100);
  
  // Bollinger Bands analysis
  const bbRange = bbands.upper - bbands.lower;
  const bbPosition = (currentPrice - bbands.lower) / bbRange;
  const bbandsScore = (1 - Math.abs(bbPosition - 0.5) * 2) * 100;
  
  // Volume trend analysis
  const recentVolumes = volume.slice(-5);
  const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
  const volumeRatio = volume[volume.length - 1] / avgVolume;
  const volumeTrend = Math.min(volumeRatio * 50, 100);
  
  // Price action score based on recent price movements
  let priceActionScore = 50;
  const priceChange = (currentPrice - prices[prices.length - 5]) / prices[prices.length - 5] * 100;
  if (Math.abs(priceChange) > 2) {
    // Strong price movement
    priceActionScore = 70 + Math.min(Math.abs(priceChange) * 2, 30);
  } else {
    // Normal price movement
    priceActionScore = 50 + Math.abs(priceChange) * 10;
  }
  
  // Overall score with weighted components
  const overallScore = (
    rsiScore * 0.2 + 
    macdScore * 0.2 + 
    bbandsScore * 0.15 + 
    volumeTrend * 0.15 + 
    priceActionScore * 0.2 +
    trendStrengthValue * 0.1
  );
  
  return {
    rsi: Math.round(rsiScore),
    macd: Math.round(macdScore),
    bollingerBands: Math.round(bbandsScore),
    volumeTrend: Math.round(volumeTrend),
    priceAction: Math.round(priceActionScore),
    overallScore: Math.round(overallScore)
  };
};
