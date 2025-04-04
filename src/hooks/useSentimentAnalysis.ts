
import { useState, useCallback } from 'react';
import { analyzeSentiment, SentimentAnalysisResult } from '@/utils/sentiment/sentimentAnalyzer';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { cacheService } from '@/utils/cacheSystem';

export function useSentimentAnalysis(symbol: string) {
  const [sentimentData, setSentimentData] = useState<SentimentAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useLanguage();
  
  const getSentimentAnalysis = useCallback(async () => {
    // Verificar cache primeiro
    const cacheKey = cacheService.generateKey('sentiment-analysis', { symbol });
    const cachedResult = cacheService.get<SentimentAnalysisResult>(cacheKey);
    
    if (cachedResult) {
      setSentimentData(cachedResult);
      return cachedResult;
    }
    
    setIsLoading(true);
    
    try {
      const result = await analyzeSentiment(symbol);
      setSentimentData(result);
      
      // Notificar o usuário apenas se houver impacto significativo
      if (result.marketImpact === 'high' || result.marketImpact === 'medium') {
        const sentimentType = result.overallScore > 0 ? 
          t("positiveSentiment") : result.overallScore < 0 ? 
          t("negativeSentiment") : t("neutralSentiment");
        
        toast.info(
          t("sentimentAnalysisUpdate"), 
          {
            description: `${symbol}: ${sentimentType} (${result.overallScore > 0 ? '+' : ''}${result.overallScore})`,
            duration: 5000,
          }
        );
      }
      
      // Cache por 10 minutos
      cacheService.set(cacheKey, result, 600);
      
      return result;
    } catch (error) {
      console.error("Error fetching sentiment analysis:", error);
      toast.error(
        t("sentimentAnalysisError"), 
        {
          description: t("errorFetchingSentimentData"),
          duration: 3000,
        }
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [symbol, t]);
  
  return {
    sentimentData,
    isLoading,
    getSentimentAnalysis
  };
}
