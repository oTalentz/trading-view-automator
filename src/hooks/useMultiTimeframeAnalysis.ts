import { useState, useEffect } from 'react';
import { MultiTimeframeAnalysisResult, TimeframeAnalysis } from '@/types/timeframeAnalysis';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { analyzeAllTimeframes } from '@/utils/confluenceCalculator';

// Fix: Change re-exports to use 'export type' syntax
export type { TimeframeAnalysis, MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';

export function useMultiTimeframeAnalysis(symbol: string, interval: string = '1') {
  const [analysis, setAnalysis] = useState<MultiTimeframeAnalysisResult | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { t } = useLanguage();
  
  
  const generateAnalysis = () => {
    // Gera nova análise
    const result = analyzeAllTimeframes(symbol, interval);
    
    setAnalysis(result);
    setCountdown(result.countdown);
    
    // Notifica o usuário sobre o sinal com informação de confluência
    const confidenceText = result.confluenceDirection === result.primarySignal.direction ? 
      `${t("highConfluence")} (${result.overallConfluence}%)` : 
      `${t("mixedSignals")}`;
      
    toast.success(
      result.primarySignal.direction === 'CALL' 
        ? t("signalCallGenerated") 
        : t("signalPutGenerated"), 
      {
        description: `${t("confidence")}: ${result.primarySignal.confidence}% - ${confidenceText} - ${symbol} - ${t("entryIn")}: ${result.countdown}s`,
        duration: 5000,
      }
    );
  };
  
  // Inicia o contador regressivo e atualiza a cada segundo
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          
          // Quando chega a zero, notifica que é hora da entrada
          if (analysis) {
            toast.info(
              analysis.primarySignal.direction === 'CALL' 
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
  }, [countdown, analysis, symbol, t]);
  
  // Gera análise inicial e a cada 5 minutos
  useEffect(() => {
    generateAnalysis(); // Análise inicial
    
    const analysisInterval = setInterval(() => {
      generateAnalysis();
    }, 5 * 60 * 1000); // A cada 5 minutos
    
    return () => clearInterval(analysisInterval);
  }, [symbol, interval]);
  
  return {
    analysis,
    countdown,
    analyzeMarket: generateAnalysis
  };
}
