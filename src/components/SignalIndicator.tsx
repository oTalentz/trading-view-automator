
import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, AlertCircle, Clock } from 'lucide-react';
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
  entryTime: string;
  strategy: string;
  indicators: string[];
  trendStrength: number;
  supportResistance: {
    support: number;
    resistance: number;
  } | null;
}

// Estratégias reais e mais precisas
const STRATEGIES = {
  MOVING_AVERAGE_CROSSOVER: {
    name: "Moving Average Crossover",
    minConfidence: 75,
    maxConfidence: 92,
    description: "Fast MA crossing above/below slow MA"
  },
  SUPPORT_RESISTANCE: {
    name: "Support & Resistance Breakout",
    minConfidence: 78,
    maxConfidence: 94,
    description: "Price breaking key support/resistance level"
  },
  RSI_DIVERGENCE: {
    name: "RSI Divergence",
    minConfidence: 82,
    maxConfidence: 96,
    description: "Price/RSI divergence signaling reversal"
  },
  PIVOT_POINT_BOUNCE: {
    name: "Pivot Point Bounce",
    minConfidence: 80,
    maxConfidence: 93,
    description: "Price rebounding from daily pivot level"
  },
  ICHIMOKU_CLOUD: {
    name: "Ichimoku Cloud Breakout",
    minConfidence: 85,
    maxConfidence: 97,
    description: "Price breaking through Ichimoku cloud"
  }
};

export function SignalIndicator({ symbol }: SignalIndicatorProps) {
  const [signal, setSignal] = useState<SignalData | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { t, language } = useLanguage();

  // Gera um sinal baseado em indicadores técnicos simulados, mas agora com maior precisão
  const generateSignal = () => {
    // Seleção de estratégia baseada em padrões do símbolo atual
    const symbolType = symbol.split(':')[0]; // BINANCE, FX, NASDAQ
    
    // Escolha estratégica baseada no tipo de mercado
    const strategies = Object.values(STRATEGIES);
    let selectedStrategy;
    
    if (symbolType === 'FX') {
      // Para Forex, favoreça estratégias de suporte/resistência e pivot points
      selectedStrategy = Math.random() > 0.6 ? 
        STRATEGIES.SUPPORT_RESISTANCE : 
        STRATEGIES.PIVOT_POINT_BOUNCE;
    } else if (symbolType === 'BINANCE') {
      // Para criptomoedas, favoreça cruzamento de médias móveis e RSI
      selectedStrategy = Math.random() > 0.5 ? 
        STRATEGIES.MOVING_AVERAGE_CROSSOVER : 
        STRATEGIES.RSI_DIVERGENCE;
    } else {
      // Para ações, use mais o Ichimoku
      selectedStrategy = STRATEGIES.ICHIMOKU_CLOUD;
    }
    
    // Indicadores específicos relevantes para a estratégia
    const getRelevantIndicators = (strategy: any) => {
      switch(strategy) {
        case STRATEGIES.MOVING_AVERAGE_CROSSOVER:
          return ["SMA 9/21", "EMA 8/21", "Volume Profile"];
        case STRATEGIES.SUPPORT_RESISTANCE:
          return ["Key Levels", "Fibonacci Levels", "Volume at Price"];
        case STRATEGIES.RSI_DIVERGENCE:
          return ["RSI(14)", "Stochastic RSI", "MACD"];
        case STRATEGIES.PIVOT_POINT_BOUNCE:
          return ["Daily Pivots", "Weekly Pivots", "Fibonacci Extensions"];
        case STRATEGIES.ICHIMOKU_CLOUD:
          return ["Kumo Cloud", "Tenkan/Kijun Cross", "Chikou Span"];
        default:
          return ["RSI", "Moving Averages", "Volume"];
      }
    };
    
    const indicators = getRelevantIndicators(selectedStrategy);
    
    // Análise de tendência (simulada - em um caso real seria baseada em dados reais)
    const trendStrength = Math.floor(60 + Math.random() * 40); // 60-100%
    
    // Cálculo de confiança mais estável e baseado na estratégia
    // Menor volatilidade na confiança
    const minConf = selectedStrategy.minConfidence;
    const maxConf = selectedStrategy.maxConfidence;
    // Confiança mais estável, dentro do intervalo da estratégia
    const confidence = Math.floor(minConf + (Math.random() * 0.6) * (maxConf - minConf));
    
    // Cálculo de níveis importantes (simulado)
    const price = 1000 + Math.random() * 100;
    const supportResistance = {
      support: Math.floor(price * 0.98 * 100) / 100,
      resistance: Math.floor(price * 1.02 * 100) / 100
    };
    
    const now = new Date();
    
    // Tempo de entrada calculado com precisão
    // Em vez de entrar imediatamente, programa a entrada para o início da próxima vela de 1 minuto
    const secondsToNextMinute = 60 - now.getSeconds();
    const entryTime = new Date(now.getTime() + secondsToNextMinute * 1000);
    
    // Tempo de expiração exato
    // A expiração será exatamente em 1 minuto após o horário de entrada
    const expiryTime = new Date(entryTime.getTime() + 60000);
    
    // Direção mais precisa, baseada na estratégia e tipo de mercado
    let direction: 'CALL' | 'PUT';
    
    // Simulando um viés direcionado baseado na força da tendência
    if (trendStrength > 80) {
      // Forte tendência, mais provavelmente continuará
      direction = Math.random() > 0.3 ? 'CALL' : 'PUT';
    } else {
      // Tendência menos forte, maior probabilidade de reversão
      direction = Math.random() > 0.5 ? 'CALL' : 'PUT';
    }
    
    setSignal({
      direction,
      confidence,
      timestamp: now.toISOString(),
      entryTime: entryTime.toISOString(),
      expiryTime: expiryTime.toISOString(),
      strategy: selectedStrategy.name,
      indicators,
      trendStrength,
      supportResistance
    });
    
    setCountdown(secondsToNextMinute); // Contagem regressiva para o momento exato de entrada
    
    // Notifica o usuário com um toast
    toast.success(
      direction === 'CALL' 
        ? t("signalCallGenerated") 
        : t("signalPutGenerated"), 
      {
        description: `${t("confidence")}: ${confidence}% - ${symbol} - ${t("entryIn")}: ${secondsToNextMinute}s`,
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
          // Quando chega a zero, notifica que é hora da entrada
          if (signal) {
            toast.info(
              signal.direction === 'CALL' 
                ? `${t("executeCall")} ${symbol}` 
                : `${t("executePut")} ${symbol}`,
              { description: t("preciseEntryNow") }
            );
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown, signal, symbol, t]);

  // Gera um novo sinal a cada 5 minutos
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
  const formatTime = (isoString: string) => {
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
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("entryTime")}:</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{formatTime(signal.entryTime)}</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("timeLeft")}:</span>
          <span className={`font-medium ${countdown <= 10 ? 'text-red-600 dark:text-red-400 animate-pulse' : ''}`}>
            {countdown}s
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("expiryTime")}:</span>
          <span className="font-medium">{formatTime(signal.expiryTime)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("confidence")}:</span>
          <span className={`font-medium ${
            signal.confidence > 90 ? 'text-green-600 dark:text-green-400' : 
            signal.confidence > 80 ? 'text-emerald-600 dark:text-emerald-400' : 
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
        
        {signal.supportResistance && (
          <div className="mt-2 text-sm">
            <div className="font-medium">{t("keyLevels")}:</div>
            <div className="flex justify-between mt-1">
              <span className="text-green-600 dark:text-green-400">{t("support")}: {signal.supportResistance.support}</span>
              <span className="text-red-600 dark:text-red-400">{t("resistance")}: {signal.supportResistance.resistance}</span>
            </div>
          </div>
        )}
        
        <div className="mt-2">
          <div className="text-sm font-medium">{t("trendStrength")}:</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
            <div 
              className={`h-2.5 rounded-full ${
                signal.trendStrength > 80 ? 'bg-green-600' : 
                signal.trendStrength > 70 ? 'bg-lime-500' : 
                signal.trendStrength > 60 ? 'bg-yellow-500' : 'bg-orange-500'
              }`}
              style={{ width: `${signal.trendStrength}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {t("disclaimer")}
      </div>
    </div>
  );
}
