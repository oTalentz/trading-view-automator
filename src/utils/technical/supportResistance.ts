
import { calculateMA } from "./movingAverages";

// Find support and resistance levels based on price action and zigzag analysis
export const findSupportResistanceLevels = (prices: number[]) => {
  if (prices.length < 30) {
    return {
      support: prices[prices.length - 1] * 0.98,
      resistance: prices[prices.length - 1] * 1.02
    };
  }
  
  // Get recent prices for analysis
  const recentPrices = prices.slice(-100);
  const currentPrice = prices[prices.length - 1];
  
  // Find local minimums and maximums
  const minimums: { price: number; index: number; strength: number }[] = [];
  const maximums: { price: number; index: number; strength: number }[] = [];
  
  // Zigzag deviation threshold (percentage)
  const deviationThreshold = 0.005; // 0.5%
  
  for (let i = 2; i < recentPrices.length - 2; i++) {
    // Local minimum
    if (recentPrices[i] < recentPrices[i - 1] && 
        recentPrices[i] < recentPrices[i - 2] && 
        recentPrices[i] < recentPrices[i + 1] && 
        recentPrices[i] < recentPrices[i + 2]) {
      
      // Calculate strength based on relative depth
      const leftDepth = (recentPrices[i - 2] - recentPrices[i]) / recentPrices[i];
      const rightDepth = (recentPrices[i + 2] - recentPrices[i]) / recentPrices[i];
      const strength = (leftDepth + rightDepth) * 100;
      
      minimums.push({ 
        price: recentPrices[i], 
        index: i,
        strength: Math.min(Math.max(strength, 1), 10) // Normalize between 1-10
      });
    }
    
    // Local maximum
    if (recentPrices[i] > recentPrices[i - 1] && 
        recentPrices[i] > recentPrices[i - 2] && 
        recentPrices[i] > recentPrices[i + 1] && 
        recentPrices[i] > recentPrices[i + 2]) {
      
      // Calculate strength based on relative height
      const leftHeight = (recentPrices[i] - recentPrices[i - 2]) / recentPrices[i];
      const rightHeight = (recentPrices[i] - recentPrices[i + 2]) / recentPrices[i];
      const strength = (leftHeight + rightHeight) * 100;
      
      maximums.push({ 
        price: recentPrices[i], 
        index: i,
        strength: Math.min(Math.max(strength, 1), 10) // Normalize between 1-10
      });
    }
  }
  
  // Identify key levels by clustering close levels
  const clusterLevels = (points: { price: number; index: number; strength: number }[]): { price: number; strength: number }[] => {
    if (points.length === 0) return [];
    
    // Sort by price
    points.sort((a, b) => a.price - b.price);
    
    const clusters: { price: number; strength: number }[] = [];
    let currentCluster = { 
      prices: [points[0].price], 
      strengths: [points[0].strength]
    };
    
    for (let i = 1; i < points.length; i++) {
      const currentPrice = points[i].price;
      const prevPrice = points[i - 1].price;
      
      // If prices are close (within threshold), add to current cluster
      if ((currentPrice - prevPrice) / prevPrice < deviationThreshold) {
        currentCluster.prices.push(currentPrice);
        currentCluster.strengths.push(points[i].strength);
      } else {
        // Create a new cluster
        // Average price and sum strengths from previous cluster
        clusters.push({
          price: currentCluster.prices.reduce((sum, p) => sum + p, 0) / currentCluster.prices.length,
          strength: currentCluster.strengths.reduce((sum, s) => sum + s, 0)
        });
        
        currentCluster = { 
          prices: [currentPrice], 
          strengths: [points[i].strength]
        };
      }
    }
    
    // Add the last cluster
    clusters.push({
      price: currentCluster.prices.reduce((sum, p) => sum + p, 0) / currentCluster.prices.length,
      strength: currentCluster.strengths.reduce((sum, s) => sum + s, 0)
    });
    
    return clusters;
  };
  
  // Get clustered support and resistance levels
  const supportClusters = clusterLevels(minimums);
  const resistanceClusters = clusterLevels(maximums);
  
  // Sort by strength
  supportClusters.sort((a, b) => b.strength - a.strength);
  resistanceClusters.sort((a, b) => b.strength - a.strength);
  
  // Find closest support below current price
  let support = currentPrice * 0.985; // Default fallback
  for (const cluster of supportClusters) {
    if (cluster.price < currentPrice) {
      support = cluster.price;
      break;
    }
  }
  
  // Find closest resistance above current price
  let resistance = currentPrice * 1.015; // Default fallback
  for (const cluster of resistanceClusters) {
    if (cluster.price > currentPrice) {
      resistance = cluster.price;
      break;
    }
  }
  
  // If no suitable levels found, use moving averages
  if (support >= currentPrice || resistance <= currentPrice) {
    const ma20 = calculateMA(prices, 20);
    const ma50 = calculateMA(prices, 50);
    const ma200 = calculateMA(prices, 200);
    
    if (support >= currentPrice) {
      // Find the closest MA below current price
      if (ma20 < currentPrice) support = ma20 * 0.99;
      else if (ma50 < currentPrice) support = ma50 * 0.99;
      else if (ma200 < currentPrice) support = ma200 * 0.99;
      else support = currentPrice * 0.985;
    }
    
    if (resistance <= currentPrice) {
      // Find the closest MA above current price
      if (ma20 > currentPrice) resistance = ma20 * 1.01;
      else if (ma50 > currentPrice) resistance = ma50 * 1.01;
      else if (ma200 > currentPrice) resistance = ma200 * 1.01;
      else resistance = currentPrice * 1.015;
    }
  }
  
  // Return support and resistance with additional data for visualization
  return { 
    support, 
    resistance,
    // Additional data for more detailed analysis
    supportLevels: supportClusters.map(c => ({ price: c.price, strength: c.strength })),
    resistanceLevels: resistanceClusters.map(c => ({ price: c.price, strength: c.strength }))
  };
};
