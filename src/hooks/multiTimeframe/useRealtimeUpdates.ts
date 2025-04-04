
import { cacheService } from '@/utils/cacheSystem';
import { analyzeAllTimeframes } from '@/utils/confluence';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';

export function useRealtimeUpdates() {
  // Realiza pequenas atualizações do sinal a cada 1 segundo para maior precisão
  const updateAnalysisInRealtime = (symbol: string, interval: string, analysis: MultiTimeframeAnalysisResult | null) => {
    if (!analysis) return null;
    
    // Verificar cache para atualizações em tempo real
    const cacheKey = cacheService.generateKey('realtime-update', { symbol, interval });
    const cachedUpdate = cacheService.get<MultiTimeframeAnalysisResult>(cacheKey);
    
    if (cachedUpdate) {
      return {
        ...analysis,
        overallConfluence: cachedUpdate.overallConfluence,
        confluenceDirection: cachedUpdate.confluenceDirection,
        timeframes: cachedUpdate.timeframes,
      };
    }
    
    try {
      // Atualiza somente a confluência sem alterar o sinal principal
      const updatedResult = analyzeAllTimeframes(symbol, interval, true);
      if (updatedResult) {
        const newAnalysis = {
          ...analysis,
          overallConfluence: updatedResult.overallConfluence,
          confluenceDirection: updatedResult.confluenceDirection,
          timeframes: updatedResult.timeframes,
        };
        
        // Cache para atualizações em tempo real (5 segundos)
        cacheService.set(cacheKey, updatedResult, 5);
        
        return newAnalysis;
      }
    } catch (error) {
      console.error('Error updating analysis:', error);
    }
    
    return analysis;
  };
  
  return {
    updateAnalysisInRealtime
  };
}
