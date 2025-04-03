
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
  }
  
  // Impede tempos muito curtos, sempre garantindo pelo menos 5 segundos
  // para o trader se preparar para a entrada
  return secondsToNextMinute <= 5 ? secondsToNextMinute + 5 : secondsToNextMinute;
};
