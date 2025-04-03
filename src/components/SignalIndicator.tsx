
import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";

interface SignalIndicatorProps {
  symbol: string;
}

interface SignalData {
  direction: 'CALL' | 'PUT';
  confidence: number;
  timestamp: string;
  expiryTime: string;
  strategy: string;
  indicators: string[];
}

export function SignalIndicator({ symbol }: SignalIndicatorProps) {
  const [signal, setSignal] = useState<SignalData | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { t, language } = useLanguage();

  // Gera um sinal baseado em indicadores técnicos simulados
  const generateSignal = () => {
    // Em uma implementação real, isso seria baseado em cálculos de indicadores reais
    const strategies = [
      "Cruzamento de Médias Móveis",
      "Divergência RSI",
      "Suporte e Resistência",
      "Retração de Fibonacci",
      "Rompimento de Pivot Point"
    ];
    
    const indicators = [
      "SMA 20/50",
      "RSI",
      "Suporte/Resistência",
      "Awesome Oscillator",
      "MACD",
      "Pivot Points"
    ];
    
    // Escolhe aleatoriamente entre 2 e 4 indicadores para simular uma análise multi-indicador
    const usedIndicators = [];
    const indicatorCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < indicatorCount; i++) {
      const idx = Math.floor(Math.random() * indicators.length);
      if (!usedIndicators.includes(indicators[idx])) {
        usedIndicators.push(indicators[idx]);
      }
    }
    
    const now = new Date();
    const expiryMinutes = 1; // Tempo de expiração fixo em 1 minuto
    const expiryTime = new Date(now.getTime() + expiryMinutes * 60000);
    
    const direction = Math.random() > 0.5 ? 'CALL' : 'PUT';
    
    // Simulando uma confiança baseada na "concordância" dos indicadores
    // Na vida real, isso seria calculado com base em algoritmos específicos
    const confidence = Math.floor(65 + Math.random() * 30); // Entre 65% e 95%
    
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    
    setSignal({
      direction,
      confidence,
      timestamp: now.toISOString(),
      expiryTime: expiryTime.toISOString(),
      strategy,
      indicators: usedIndicators
    });
    
    setCountdown(60); // 60 segundos até a próxima vela
    
    // Notifica o usuário com um toast
    toast.success(
      direction === 'CALL' 
        ? t("signalCallGenerated") 
        : t("signalPutGenerated"), 
      {
        description: `${t("confidence")}: ${confidence}% - ${symbol}`,
        duration: 5000,
      }
    );
  };

  // Atualiza o contador regressivo a cada segundo
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);

  // Gera um novo sinal a cada 5 minutos (em um sistema real, seria baseado em cálculos reais)
  useEffect(() => {
    generateSignal(); // Gera um sinal inicial
    
    const signalInterval = setInterval(() => {
      generateSignal();
    }, 5 * 60 * 1000); // A cada 5 minutos
    
    return () => clearInterval(signalInterval);
  }, [symbol]);

  // Se não houver sinal, mostre um indicador de carregamento
  if (!signal) {
    return (
      <div className="p-4 border rounded-lg flex items-center justify-center">
        <div className="animate-pulse">{t("analyzingMarket")}</div>
      </div>
    );
  }

  // Formata o tempo de expiração para exibição
  const formatExpiryTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(language === 'pt-br' ? 'pt-BR' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`p-4 border rounded-lg ${
      signal.direction === 'CALL' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{t("entrySignal")}</h3>
        <div className={`px-2 py-1 rounded text-white ${
          signal.direction === 'CALL' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {signal.direction}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {signal.direction === 'CALL' ? (
          <ArrowUpCircle className="h-6 w-6 text-green-500" />
        ) : (
          <ArrowDownCircle className="h-6 w-6 text-red-500" />
        )}
        <span className="font-medium">
          {signal.direction === 'CALL' ? t("buySignal") : t("sellSignal")}
        </span>
      </div>
      
      <div className="space-y-1 mb-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("symbol")}:</span>
          <span className="font-medium">{symbol}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("expiryTime")}:</span>
          <span className="font-medium">{formatExpiryTime(signal.expiryTime)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("timeLeft")}:</span>
          <span className="font-medium">{countdown}s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("confidence")}:</span>
          <span className={`font-medium ${
            signal.confidence > 80 ? 'text-green-600 dark:text-green-400' : 
            signal.confidence > 70 ? 'text-yellow-600 dark:text-yellow-400' : 
            'text-orange-600 dark:text-orange-400'
          }`}>{signal.confidence}%</span>
        </div>
      </div>

      <div className="border-t pt-2 mt-2">
        <h4 className="font-medium mb-1">{t("strategy")}: {signal.strategy}</h4>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t("basedOn")}:</div>
          <ul className="list-disc list-inside text-sm">
            {signal.indicators.map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {t("disclaimer")}
      </div>
    </div>
  );
}
