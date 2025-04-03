
import { calculateMA } from "../movingAverages";
import { calculateVolatility } from "../volatility";

// Bollinger Bands
export const calculateBollingerBands = (prices: number[], period: number = 20, multiplier: number = 2) => {
  const sma = calculateMA(prices.slice(-period), period);
  const volatility = calculateVolatility(prices.slice(-period), period);
  
  return {
    upper: sma + (volatility * multiplier),
    middle: sma,
    lower: sma - (volatility * multiplier)
  };
};
