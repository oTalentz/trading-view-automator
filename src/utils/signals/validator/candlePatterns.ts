
/**
 * Detects basic candle patterns in price data
 */
export const checkCandlePatterns = (
  prices: number[], 
  direction: 'CALL' | 'PUT'
): { detected: boolean; pattern: string } => {
  if (prices.length < 5) return { detected: false, pattern: '' };
  
  const last3Prices = prices.slice(-3);
  const priceChanges = [
    (last3Prices[1] - last3Prices[0]) / last3Prices[0],
    (last3Prices[2] - last3Prices[1]) / last3Prices[1]
  ];
  
  // Detectar padrão de reversão para CALL
  if (direction === 'CALL' && 
      priceChanges[0] < -0.005 && 
      Math.abs(priceChanges[1]) < 0.003) {
    return { detected: true, pattern: 'Martelo' };
  }
  
  // Detectar padrão de reversão para PUT
  if (direction === 'PUT' && 
      priceChanges[0] > 0.005 && 
      Math.abs(priceChanges[1]) < 0.003) {
    return { detected: true, pattern: 'Estrela Cadente' };
  }
  
  // Verificar padrão de engolfo
  if ((direction === 'CALL' && 
       priceChanges[0] < -0.005 && 
       priceChanges[1] > Math.abs(priceChanges[0])) ||
      (direction === 'PUT' && 
       priceChanges[0] > 0.005 && 
       priceChanges[1] < -Math.abs(priceChanges[0]))) {
    return { detected: true, pattern: 'Engolfo' };
  }
  
  return { detected: false, pattern: '' };
};
