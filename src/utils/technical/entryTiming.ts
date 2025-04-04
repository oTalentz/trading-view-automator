
// Utilitários avançados para timing de entrada e expiração

// Determinar o melhor momento de entrada com base na ação do preço, volatilidade e padrões de velas
export const calculateOptimalEntryTiming = (): number => {
  // Em um sistema real, isso analisaria a ação de preço recente e volatilidade
  const now = new Date();
  
  // Fatores que afetam o timing ideal:
  // 1. Segundos para o próximo minuto (importante para plataformas baseadas em velas)
  // 2. Momento do dia (certos períodos têm maior liquidez e menor spread)
  // 3. Posição dos segundos no minuto atual (alguns segundos são melhores que outros)
  
  // Cálculo dos segundos até o próximo minuto
  const secondsToNextMinute = 60 - now.getSeconds();
  
  // Lógica de entrada mais precisa:
  
  // Caso 1: Se estamos muito próximos da mudança de minuto (< 3 segundos),
  // esperamos pelo próximo (evita condições de corrida no limite do minuto)
  if (secondsToNextMinute <= 3) {
    return secondsToNextMinute + 60;
  }
  
  // Caso 2: Se estamos em um bom momento para entrada imediata
  // (entre 15-25 segundos ou 40-50 segundos após o minuto),
  // que são momentos de maior estabilidade de preço em muitos instrumentos:
  const secondsInMinute = now.getSeconds();
  if ((secondsInMinute >= 15 && secondsInMinute <= 25) || 
      (secondsInMinute >= 40 && secondsInMinute <= 50)) {
    return 0; // Entrada imediata
  }
  
  // Caso 3: Se estamos próximos do meio do minuto, esperar pelos 40 segundos
  // (momento de maior estabilidade após formação de vela parcial)
  if (secondsInMinute > 25 && secondsInMinute < 40) {
    return 40 - secondsInMinute;
  }
  
  // Caso 4: Para outros casos, apontamos para o início do próximo minuto
  // que geralmente coincide com a formação de novas velas em muitas plataformas
  return secondsToNextMinute;
};

// Calcular tempo de expiração ideal com base na volatilidade, força da tendência e momento do dia
export const calculateOptimalExpiryTime = (
  interval: string, 
  volatility: number, 
  trendStrength: number
): number => {
  let baseExpiry = parseInt(interval) || 1; // Usa intervalo como base em minutos
  
  // Fator 1: Ajustar para força da tendência - tendências mais fortes podem ter expiração mais longa
  if (trendStrength > 80) {
    baseExpiry = Math.round(baseExpiry * 1.75); // 75% mais longo para tendências fortes
  } else if (trendStrength > 65) {
    baseExpiry = Math.round(baseExpiry * 1.3); // 30% mais longo para tendências moderadas
  } else if (trendStrength < 40) {
    baseExpiry = Math.max(Math.round(baseExpiry * 0.7), 1); // 30% mais curto para tendências fracas
  }
  
  // Fator 2: Ajustar para volatilidade - maior volatilidade precisa de expiração mais próxima
  if (volatility > 0.02) { // Volatilidade muito alta
    baseExpiry = Math.max(Math.round(baseExpiry * 0.5), 1); // 50% mais curto
  } else if (volatility > 0.015) { // Volatilidade alta
    baseExpiry = Math.max(Math.round(baseExpiry * 0.7), 1); // 30% mais curto
  } else if (volatility < 0.005) { // Volatilidade muito baixa
    baseExpiry = Math.round(baseExpiry * 1.3); // 30% mais longo
  }
  
  // Fator 3: Verifica hora do dia para ajuste (em sistema real)
  const now = new Date();
  const hour = now.getHours();
  
  // Horários de maior volatilidade (abertura/fechamento de mercados) precisam de expiração mais curta
  if ((hour >= 9 && hour <= 10) || (hour >= 15 && hour <= 16)) {
    baseExpiry = Math.max(Math.round(baseExpiry * 0.85), 1); // 15% mais curto
  }
  
  // Horários de baixa liquidez precisam de expiração mais longa
  if (hour >= 12 && hour <= 13) {
    baseExpiry = Math.round(baseExpiry * 1.15); // 15% mais longo
  }
  
  // Assegura que a expiração esteja dentro de limites razoáveis
  return Math.min(Math.max(baseExpiry, 1), 60); // Entre 1 e 60 minutos
};
