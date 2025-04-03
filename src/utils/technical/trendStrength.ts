
import { TrendStrength } from "./enums";
import { calculateMA } from "./movingAverages";
import { calculateRSI } from "./indicators/rsi";

// Calculate trend strength based on multiple factors
export const calculateTrendStrength = (
  prices: number[],
  volume: number[] = []
): { strength: TrendStrength; value: number } => {
  if (prices.length < 50) return { strength: TrendStrength.WEAK, value: 30 };
  
  const shortMA = calculateMA(prices, 10);
  const longMA = calculateMA(prices, 50);
  const rsi = calculateRSI(prices);
  
  // Calculate distance between MAs as percentage
  const maDistance = Math.abs((shortMA - longMA) / longMA) * 100;
  
  // Calculate RSI distance from neutral (50)
  const rsiDeviation = Math.abs(rsi - 50);
  
  // Calculate trend consistency (simplified)
  const priceTrend = shortMA > longMA ? 1 : -1;
  let consistentMoves = 0;
  
  for (let i = prices.length - 2; i > prices.length - 15; i--) {
    const move = prices[i+1] > prices[i] ? 1 : -1;
    if (move === priceTrend) consistentMoves++;
  }
  
  // Calculate strength score (0-100)
  let strengthScore = (maDistance * 3) + (rsiDeviation * 0.8) + (consistentMoves * 3);
  
  // Ensure range is within 0-100
  strengthScore = Math.min(Math.max(strengthScore, 0), 100);
  
  // Determine trend strength category
  let strength;
  if (strengthScore >= 80) strength = TrendStrength.VERY_STRONG;
  else if (strengthScore >= 60) strength = TrendStrength.STRONG;
  else if (strengthScore >= 40) strength = TrendStrength.MODERATE;
  else strength = TrendStrength.WEAK;
  
  return { strength, value: strengthScore };
};
