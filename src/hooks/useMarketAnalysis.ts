
import { useState, useEffect, useCallback } from 'react';
import { MarketAnalysisResult } from '@/types/marketAnalysis';
import { analyzeMarket } from '@/utils/analysis/marketAnalyzer';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { cacheService } from '@/utils/cacheSystem';

export function useMarketAnalysis(symbol: string, interval: string = '1') {
  const [analysis, setAnalysis] = useState<MarketAnalysisResult | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { t } = useLanguage();
  
  // Função para analisar o mercado e gerar sinais de alta precisão
  const handleAnalyzeMarket = useCallback(() => {
    // Verificar cache primeiro
    const cacheKey = cacheService.generateKey('market-analysis', { symbol, interval });
    const cachedResult = cacheService.get<MarketAnalysisResult>(cacheKey);
    
    if (cachedResult) {
      setAnalysis(cachedResult);
      setCountdown(cachedResult.countdownSeconds);
      return cachedResult;
    }
    
    try {
      // Gerar análise de mercado
      const result = analyzeMarket(symbol, interval);
      
      // Atualizar estado
      setAnalysis(result);
      setCountdown(result.countdownSeconds);
      
      // Determinar cor do toast baseada no nível de validação
      const toastType = 
        !result.validationDetails?.isValid ? toast.warning :
        result.validationDetails?.warningLevel === 'high' ? toast.warning :
        result.validationDetails?.warningLevel === 'medium' ? toast.info :
        toast.success;
      
      // Notifica o usuário com um toast avançado
      toastType(
        result.direction === 'CALL' 
          ? t("signalCallGenerated") 
          : t("signalPutGenerated"), 
        {
          description: `${t("confidence")}: ${result.confidence}% - ${symbol} - ${t("entryIn")}: ${result.countdownSeconds}s`,
          duration: 5000,
          // Adicionar primeiro motivo da validação como informação adicional
          action: result.validationDetails?.reasons && result.validationDetails.reasons.length > 0 ? {
            label: t("viewDetails"),
            onClick: () => {
              toast.info(
                t("validationDetails"),
                {
                  description: result.validationDetails?.reasons.slice(0, 3).join('. '),
                  duration: 8000,
                }
              );
            }
          } : undefined
        }
      );
      
      // Armazenar no cache por 2 minutos
      cacheService.set(cacheKey, result, 120);
      
      return result;
    } catch (error) {
      console.error("Error analyzing market:", error);
      
      toast.error(
        t("errorAnalyzingMarket"), 
        {
          description: t("tryAgainLater"),
          duration: 3000,
        }
      );
      
      return null;
    }
  }, [symbol, interval, t]);
  
  // Inicia o contador regressivo e atualiza a cada segundo
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          
          // Quando chega a zero, notifica que é hora da entrada
          if (analysis) {
            // Determinar tipo de toast baseado na validação
            const toastType = 
              analysis.validationDetails?.warningLevel === 'high' ? toast.warning :
              analysis.validationDetails?.warningLevel === 'medium' ? toast.info :
              toast.success;
            
            toastType(
              analysis.direction === 'CALL' 
                ? `${t("executeCall")} ${symbol}` 
                : `${t("executePut")} ${symbol}`,
              { 
                description: t("preciseEntryNow"),
                // Adicionar primeiro motivo da validação como informação adicional
                action: analysis.validationDetails?.reasons && analysis.validationDetails.reasons.length > 0 ? {
                  label: t("viewReason"),
                  onClick: () => {
                    toast.info(
                      t("validationDetails"),
                      {
                        description: analysis.validationDetails?.reasons[0],
                        duration: 5000,
                      }
                    );
                  }
                } : undefined
              }
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
    handleAnalyzeMarket(); // Análise inicial
    
    const analysisInterval = setInterval(() => {
      handleAnalyzeMarket();
    }, 5 * 60 * 1000); // A cada 5 minutos
    
    return () => clearInterval(analysisInterval);
  }, [symbol, interval, handleAnalyzeMarket]);
  
  return {
    analysis,
    countdown,
    analyzeMarket: handleAnalyzeMarket
  };
}
