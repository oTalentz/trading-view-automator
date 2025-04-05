
import { calculateMA } from "../movingAverages";
import { calculateVolatility } from "../volatility";

// Define the BollingerBands type
export interface BollingerBands {
  upper: number;
  middle: number;
  lower: number;
  width?: number;
  percentB?: number;
}

// Bollinger Bands
export const calculateBollingerBands = (prices: number[], period: number = 20, multiplier: number = 2): BollingerBands => {
  const sma = calculateMA(prices.slice(-period), period);
  const volatility = calculateVolatility(prices.slice(-period), period);
  
  const upper = sma + (volatility * multiplier);
  const lower = sma - (volatility * multiplier);
  const width = (upper - lower) / sma;
  const currentPrice = prices[prices.length - 1];
  const percentB = (currentPrice - lower) / (upper - lower);
  
  return {
    upper,
    middle: sma,
    lower,
    width,
    percentB
  };
};
