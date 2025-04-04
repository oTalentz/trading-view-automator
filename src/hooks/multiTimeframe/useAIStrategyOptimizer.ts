
import { useState } from 'react';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { cacheService } from '@/utils/cacheSystem';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { analyzePatterns } from './utils/patternAnalyzer';
import { enhanceAnalysisWithAI as enhanceAnalysis } from './utils/analysisEnhancer';
import { StrategyOptimizationResult, UseAIStrategyOptimizerReturn } from './types/strategyTypes';

/**
 * Hook que usa IA para analisar desempenho passado e otimizar estratégias de trading
 */
export function useAIStrategyOptimizer(): UseAIStrategyOptimizerReturn {
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<StrategyOptimizationResult | null>(null);
  const { t } = useLanguage();

  /**
   * Analisa sinais históricos para detectar padrões e otimizar parâmetros de estratégia
   * @param symbol O símbolo para otimizar (ex: 'EUR/USD')
   * @returns Resultado de otimização com ajustes de estratégia
   */
  const optimizeStrategy = (symbol: string): StrategyOptimizationResult | null => {
    const minSampleSize = 10; // Valor padrão movido para cá
    setIsOptimizing(true);

    try {
      // Verificar cache primeiro para evitar recálculos desnecessários
      const cacheKey = cacheService.generateKey('ai-optimization', { symbol });
      const cachedResult = cacheService.get<StrategyOptimizationResult>(cacheKey);
      
      if (cachedResult) {
        setOptimizationResult(cachedResult);
        setIsOptimizing(false);
        return cachedResult;
      }

      // Obter dados históricos de sinais
      const signalHistory = getSignalHistory();
      const symbolSignals = signalHistory.filter(signal => signal.symbol === symbol);
      
      // Só continuar se tivermos dados suficientes
      if (symbolSignals.length < minSampleSize) {
        toast.warning(t("insufficientData"), {
          description: t("needMoreSignals", { count: minSampleSize }),
        });
        setIsOptimizing(false);
        return null;
      }

      // Dividir sinais em trades ganhadoras e perdedoras
      const winningSignals = symbolSignals.filter(signal => signal.result === 'WIN');
      const losingSignals = symbolSignals.filter(signal => signal.result === 'LOSS');
      
      // Calcular taxa de acerto
      const completedSignals = winningSignals.length + losingSignals.length;
      const winRate = completedSignals > 0 ? (winningSignals.length / completedSignals) * 100 : 0;
      
      // Analisar padrões em trades ganhadoras vs perdedoras
      const optimizedResult = analyzePatterns(winningSignals, losingSignals, winRate);
      
      // Armazenar em cache por 24 horas (otimização não precisa rodar com frequência)
      cacheService.set(cacheKey, optimizedResult, 24 * 60 * 60);
      
      setOptimizationResult(optimizedResult);
      setIsOptimizing(false);
      
      return optimizedResult;
    } catch (error) {
      console.error('Erro na otimização de estratégia com IA:', error);
      toast.error(t("optimizationError"), {
        description: t("tryAgainLater"),
      });
      setIsOptimizing(false);
      return null;
    }
  };

  /**
   * Aplicar otimizações de IA na análise atual
   * @param analysis O resultado da análise atual
   * @returns Análise aprimorada com otimizações de IA
   */
  const enhanceAnalysisWithAI = (
    analysis: MultiTimeframeAnalysisResult | null
  ): MultiTimeframeAnalysisResult | null => {
    return enhanceAnalysis(analysis, optimizationResult);
  };

  return {
    optimizeStrategy,
    enhanceAnalysisWithAI,
    isLoading: isOptimizing,
    optimizationResult
  };
}
