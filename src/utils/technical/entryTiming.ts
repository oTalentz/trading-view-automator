
// Determine best entry time based on price action and volatility
export const calculateOptimalEntryTiming = (
  prices: number[] = [],
  volatility: number = 0,
  marketCondition: string = '',
  idealTimingSeconds: number = 45
): number => {
  // Primeiro obtemos o tempo até o próximo minuto exato
  const now = new Date();
  let secondsToNextMinute = 60 - now.getSeconds();
  
  // Check if this is an OTC market
  const isOTCMarket = marketCondition.toLowerCase().includes('otc');
  
  // Se temos dados de preços e foi calculado um timing ideal, o usamos
  if (prices.length > 0 && idealTimingSeconds > 0) {
    // Ajusta o tempo com base no timing ideal calculado
    if (idealTimingSeconds < 30) {
      // Para entradas de alta precisão, usamos um timing mais próximo
      secondsToNextMinute = Math.min(idealTimingSeconds, secondsToNextMinute);
    } else if (secondsToNextMinute > 45) {
      // Se falta muito para o próximo minuto e o timing não é crítico
      // podemos entrar antes do próximo minuto exato
      secondsToNextMinute = Math.min(idealTimingSeconds, secondsToNextMinute);
    }
    
    // OTC markets may have slightly different timing characteristics
    if (isOTCMarket) {
      // OTC markets often have cleaner patterns with less noise
      // so we can be more precise with entry timing
      if (volatility < 0.5) {
        // For low volatility OTC markets, best entries are often right after
        // price consolidation periods
        secondsToNextMinute = Math.min(30, secondsToNextMinute);
      }
    }
  }
  
  // Impede tempos muito curtos, sempre garantindo pelo menos 5 segundos
  // para o trader se preparar para a entrada
  return secondsToNextMinute <= 5 ? secondsToNextMinute + 5 : secondsToNextMinute;
};

// Special function for OTC market entry timing
export const calculateOTCEntryTiming = (
  symbol: string,
  prices: number[] = [],
  volatility: number = 0
): number => {
  // OTC markets have different characteristics than regular markets
  const now = new Date();
  const secondsInCurrentMinute = now.getSeconds();
  
  // For OTC markets, we often want to enter:
  // 1. After a clear pattern forms (usually 15-20 seconds into a minute)
  // 2. Before the minute closes to catch momentum (around 50 seconds)
  
  if (secondsInCurrentMinute < 30) {
    // If we're early in the minute, wait for pattern to complete
    // but not too long
    return Math.max(10, 30 - secondsInCurrentMinute);
  } else if (secondsInCurrentMinute >= 30 && secondsInCurrentMinute < 45) {
    // Mid-minute is often a good entry point for OTC assets
    // especially during trend continuation
    return 5; // Enter soon
  } else {
    // Late in the minute, decide if we want to enter now or wait for next minute
    // based on volatility
    return volatility > 0.7 ? 5 : (60 - secondsInCurrentMinute) + 10;
  }
};
