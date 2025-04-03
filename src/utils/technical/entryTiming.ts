
// Determine best entry time based on price action and volatility
export const calculateOptimalEntryTiming = (
  prices: number[] = [],
  volatility: number = 0,
  marketCondition: string = '',
  idealTimingSeconds: number = 45,
  isOTCMarket: boolean = false
): number => {
  // Primeiro obtemos o tempo até o próximo minuto exato
  const now = new Date();
  let secondsToNextMinute = 60 - now.getSeconds();
  
  // Para mercados OTC, que são mais previsíveis e menos voláteis
  if (isOTCMarket) {
    // Mercados OTC tendem a ser mais estáveis e às vezes artificiais
    // Então podemos usar uma abordagem mais precisa
    
    // Verificamos se o mercado está tendendo ou em consolidação
    if (marketCondition.includes('TRENDING')) {
      // Em tendências claras nos mercados OTC, entramos mais cedo para maximizar o ganho
      secondsToNextMinute = Math.min(secondsToNextMinute, 30);
    } else if (marketCondition.includes('RANGING')) {
      // Em consolidação nos mercados OTC, esperamos pelo melhor momento de reversão
      secondsToNextMinute = Math.min(secondsToNextMinute, 45);
    }
    
    // Se temos um timing ideal específico, priorizamos isso
    if (idealTimingSeconds > 0) {
      secondsToNextMinute = Math.min(idealTimingSeconds, secondsToNextMinute);
    }
  } else {
    // Para mercados regulares, mantém a lógica original
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
  }
  
  // Impede tempos muito curtos, sempre garantindo pelo menos 5 segundos
  // para o trader se preparar para a entrada
  return secondsToNextMinute <= 5 ? secondsToNextMinute + 5 : secondsToNextMinute;
};
