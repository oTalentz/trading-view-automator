
import { useState, useEffect } from 'react';
import { MultiTimeframeAnalysisResult, TimeframeAnalysis } from '@/types/timeframeAnalysis';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { analyzeAllTimeframes } from '@/utils/confluenceCalculator';
import { playAlertSound } from '@/utils/audioUtils';
import { saveSignalToHistory } from '@/utils/signalHistoryUtils';
import { sendNotification } from '@/utils/pushNotificationUtils';
import { getNotificationSettings } from '@/utils/pushNotificationUtils';

// Fix: Change re-exports to use 'export type' syntax
export type { TimeframeAnalysis, MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';

export function useMultiTimeframeAnalysis(symbol: string, interval: string = '1') {
  const [analysis, setAnalysis] = useState<MultiTimeframeAnalysisResult | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useLanguage();
  
  const generateAnalysis = () => {
    // Define loading state
    setIsLoading(true);
    
    try {
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
      
      // Play sound alert for new signal
      playAlertSound(result.primarySignal.direction.toLowerCase() as 'call' | 'put');
      
      // Envia notificação do navegador se habilitado
      const notifSettings = getNotificationSettings();
      if (notifSettings.enabled) {
        sendNotification(
          result.primarySignal.direction === 'CALL' ? 'Sinal de COMPRA' : 'Sinal de VENDA',
          {
            body: `${symbol} - Confiança: ${result.primarySignal.confidence}% - Entrada em: ${result.countdown}s`,
            icon: '/favicon.ico',
          }
        );
      }
      
      // Save signal to history
      saveSignalToHistory({
        symbol: symbol,
        direction: result.primarySignal.direction,
        confidence: result.primarySignal.confidence,
        timestamp: result.primarySignal.timestamp,
        entryTime: result.primarySignal.entryTime,
        expiryTime: result.primarySignal.expiryTime,
        timeframe: interval,
        strategy: result.primarySignal.strategy || 'Multi-Timeframe Confluence'
      });
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error(t("analysisError"), {
        description: t("tryAgainLater"),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Realiza pequenas atualizações do sinal a cada 1 segundo para maior precisão
  const updateAnalysisInRealtime = () => {
    if (!analysis) return;
    
    try {
      // Atualiza somente a confluência sem alterar o sinal principal
      const updatedResult = analyzeAllTimeframes(symbol, interval, true);
      if (updatedResult) {
        setAnalysis(prevAnalysis => {
          if (!prevAnalysis) return updatedResult;
          
          return {
            ...prevAnalysis,
            overallConfluence: updatedResult.overallConfluence,
            confluenceDirection: updatedResult.confluenceDirection,
            timeframes: updatedResult.timeframes,
          };
        });
      }
    } catch (error) {
      console.error('Error updating analysis:', error);
    }
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
            
            // Play entry sound alert
            playAlertSound('entry');
            
            // Envia notificação de entrada se habilitado
            const notifSettings = getNotificationSettings();
            if (notifSettings.enabled) {
              sendNotification(
                'Momento de Entrada!',
                {
                  body: `${symbol} - ${analysis.primarySignal.direction === 'CALL' ? 'COMPRA' : 'VENDA'} AGORA!`,
                  icon: '/favicon.ico',
                }
              );
            }
          }
          
          return 0;
        }
        return prev - 1;
      });
      
      // Atualiza análise em tempo real a cada segundo
      updateAnalysisInRealtime();
      
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
    isLoading,
    analyzeMarket: generateAnalysis
  };
}
