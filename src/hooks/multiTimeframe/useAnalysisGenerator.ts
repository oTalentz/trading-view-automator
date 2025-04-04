
import { useState } from 'react';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { analyzeAllTimeframes } from '@/utils/confluence';
import { playAlertSound } from '@/utils/audioUtils';
import { saveSignalToHistory } from '@/utils/signalHistoryUtils';
import { sendNotification, getNotificationSettings } from '@/utils/pushNotificationUtils';
import { cacheService } from '@/utils/cacheSystem';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { useAIStrategyOptimizer } from './useAIStrategyOptimizer';

export function useAnalysisGenerator(
  symbol: string, 
  interval: string
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useLanguage();
  const { optimizeStrategy, enhanceAnalysisWithAI } = useAIStrategyOptimizer();
  
  const generateAnalysis = () => {
    // Verificar cache primeiro
    const cacheKey = cacheService.generateKey('analysis', { symbol, interval });
    const cachedResult = cacheService.get<MultiTimeframeAnalysisResult>(cacheKey);
    
    if (cachedResult) {
      // Apply AI optimizations to cached result if available
      const optimizationResult = optimizeStrategy(symbol);
      if (optimizationResult) {
        return enhanceAnalysisWithAI(cachedResult, optimizationResult);
      }
      return cachedResult;
    }
    
    // Define loading state
    setIsLoading(true);
    
    try {
      // Gera nova análise
      let result = analyzeAllTimeframes(symbol, interval);
      
      // Apply AI optimizations if available
      const optimizationResult = optimizeStrategy(symbol);
      if (optimizationResult) {
        const enhancedResult = enhanceAnalysisWithAI(result, optimizationResult);
        if (enhancedResult) {
          result = enhancedResult;
          
          // Add AI enhancement indicator to toast
          toast.info(t("aiEnhancedSignal"), {
            description: t("signalOptimizedByAI"),
            duration: 3000,
          });
        }
      }
      
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
      
      // Armazena no cache por 2 minutos
      cacheService.set(cacheKey, result, 120);
      
      return result;
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error(t("analysisError"), {
        description: t("tryAgainLater"),
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    generateAnalysis,
    isLoading
  };
}
