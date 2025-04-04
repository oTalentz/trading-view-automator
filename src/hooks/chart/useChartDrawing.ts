
import { useCallback } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { toast } from "sonner";
import { useChartColors } from './useChartColors';
import { useSupportResistanceDrawing } from './useSupportResistanceDrawing';
import { useEntrySignalDrawing } from './useEntrySignalDrawing';
import { useExpiryLineDrawing } from './useExpiryLineDrawing';
import { useAnalysisInfoDrawing } from './useAnalysisInfoDrawing';
import { useTechnicalIndicatorsDrawing } from './useTechnicalIndicatorsDrawing';

export function useChartDrawing(theme: string) {
  const colors = useChartColors(theme);
  const drawSupportResistance = useSupportResistanceDrawing(colors);
  const drawEntrySignal = useEntrySignalDrawing(colors);
  const drawExpiryLine = useExpiryLineDrawing(colors);
  const drawAnalysisInfo = useAnalysisInfoDrawing(colors, theme);
  const drawTechnicalIndicators = useTechnicalIndicatorsDrawing();

  return useCallback((
    chart: any, 
    analysis: MultiTimeframeAnalysisResult | null, 
    language: string
  ) => {
    if (!chart || !analysis) return;

    try {
      // Limpar desenhos existentes
      chart.removeAllShapes();
      
      // Desenhar cada elemento do gráfico
      drawSupportResistance(chart, analysis, language);
      drawEntrySignal(chart, analysis, language);
      drawExpiryLine(chart, analysis, language);
      drawAnalysisInfo(chart, analysis, language);
      drawTechnicalIndicators(chart);
      
    } catch (error) {
      console.error("Erro ao desenhar no gráfico:", error);
      toast.error(
        language === 'pt-br' 
          ? "Erro ao desenhar sinais no gráfico" 
          : "Error drawing signals on chart"
      );
    }
  }, [
    drawSupportResistance, 
    drawEntrySignal, 
    drawExpiryLine, 
    drawAnalysisInfo, 
    drawTechnicalIndicators
  ]);
}
