
// Função para calcular os minutos de expiração com base no intervalo de tempo
export const calculateExpiryMinutes = (interval: string): number => {
  switch(interval) {
    case '1': return 1; 
    case '5': return 5;
    case '15': return 15;
    case '30': return 30;
    case '60': return 60;
    case '240': return 240;
    case 'D': return 1440; // 24 hours
    case 'W': return 10080; // 7 days
    default: return 1;
  }
};
