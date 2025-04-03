
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';

export const OTCMarketStatus: React.FC = () => {
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  
  // Verifica se o mercado OTC está aberto (normalmente está 24/7)
  // No mundo real isso seria baseado em dados reais da API da Pocket Option
  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      const day = now.getUTCDay();
      
      // OTC geralmente está disponível 24/7
      setIsMarketOpen(true);
      
      // Atualiza o horário atual no formato HH:MM UTC
      setCurrentTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} UTC`
      );
    };
    
    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 30000); // Atualiza a cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isMarketOpen ? "default" : "destructive"}
        className={`${isMarketOpen ? 'bg-green-500 hover:bg-green-600' : ''} flex items-center gap-1`}
      >
        <span className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-white' : 'bg-red-300'}`} />
        {isMarketOpen ? 'MERCADO ABERTO' : 'MERCADO FECHADO'}
      </Badge>
      
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="h-4 w-4 mr-1" />
        {currentTime}
      </div>
    </div>
  );
};
