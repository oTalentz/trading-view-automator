
/**
 * Calculates the Pearson correlation coefficient between two arrays of numbers.
 * The coefficient is a value between -1 and 1, where:
 * - 1 indicates a perfect positive correlation
 * - -1 indicates a perfect negative correlation
 * - 0 indicates no correlation
 */
export const calculateCorrelation = (array1: number[], array2: number[]): number => {
  // Use the smaller length
  const length = Math.min(array1.length, array2.length);
  
  if (length <= 1) return 0;
  
  // Use the same number of data points from both arrays
  const a1 = array1.slice(-length);
  const a2 = array2.slice(-length);
  
  // Calculate means
  const mean1 = a1.reduce((sum, val) => sum + val, 0) / length;
  const mean2 = a2.reduce((sum, val) => sum + val, 0) / length;
  
  // Calculate sums
  let sum12 = 0;
  let sum1Sq = 0;
  let sum2Sq = 0;
  
  for (let i = 0; i < length; i++) {
    // Subtract means and get product
    const diff1 = a1[i] - mean1;
    const diff2 = a2[i] - mean2;
    sum12 += diff1 * diff2;
    
    // Sum of squared differences
    sum1Sq += diff1 * diff1;
    sum2Sq += diff2 * diff2;
  }
  
  // Return correlation coefficient
  if (sum1Sq === 0 || sum2Sq === 0) return 0;
  return sum12 / Math.sqrt(sum1Sq * sum2Sq);
};

/**
 * Calculates the moving correlation between two arrays over a given window
 */
export const calculateMovingCorrelation = (
  array1: number[], 
  array2: number[], 
  window: number = 14
): number[] => {
  // Use the smaller length
  const length = Math.min(array1.length, array2.length);
  
  if (length <= window) {
    return [calculateCorrelation(array1, array2)];
  }
  
  const result: number[] = [];
  
  for (let i = window; i < length; i++) {
    const slice1 = array1.slice(i - window, i);
    const slice2 = array2.slice(i - window, i);
    result.push(calculateCorrelation(slice1, slice2));
  }
  
  return result;
};

/**
 * Calculates correlations between a base asset and multiple comparison assets
 */
export const calculateMultipleCorrelations = (
  baseAsset: number[],
  comparisonAssets: Record<string, number[]>
): Record<string, number> => {
  const result: Record<string, number> = {};
  
  Object.entries(comparisonAssets).forEach(([symbol, data]) => {
    result[symbol] = calculateCorrelation(baseAsset, data);
  });
  
  return result;
};

/**
 * Calculates the weighted correlation giving more weight to recent data points
 */
export const calculateWeightedCorrelation = (
  array1: number[], 
  array2: number[]
): number => {
  const length = Math.min(array1.length, array2.length);
  
  if (length <= 1) return 0;
  
  // Use the same number of data points from both arrays
  const a1 = array1.slice(-length);
  const a2 = array2.slice(-length);
  
  // Calculate weighted means
  let sum1 = 0;
  let sum2 = 0;
  let weightSum = 0;
  
  for (let i = 0; i < length; i++) {
    // Weight increases linearly with index
    const weight = i / length;
    sum1 += a1[i] * weight;
    sum2 += a2[i] * weight;
    weightSum += weight;
  }
  
  const mean1 = sum1 / weightSum;
  const mean2 = sum2 / weightSum;
  
  // Calculate weighted sums
  let sum12 = 0;
  let sum1Sq = 0;
  let sum2Sq = 0;
  
  for (let i = 0; i < length; i++) {
    const weight = i / length;
    const diff1 = a1[i] - mean1;
    const diff2 = a2[i] - mean2;
    
    sum12 += weight * diff1 * diff2;
    sum1Sq += weight * diff1 * diff1;
    sum2Sq += weight * diff2 * diff2;
  }
  
  // Return weighted correlation coefficient
  if (sum1Sq === 0 || sum2Sq === 0) return 0;
  return sum12 / Math.sqrt(sum1Sq * sum2Sq);
};
