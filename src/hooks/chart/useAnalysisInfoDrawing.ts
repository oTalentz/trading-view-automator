
import { useCallback } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { ChartColors } from './types';

export function useAnalysisInfoDrawing(colors: ChartColors, theme: string) {
  return useCallback((chart: any, analysis: MultiTimeframeAnalysisResult, language: string) => {
    // Adicionar um painel de informações com detalhes da análise
    const confidenceColor = 
      analysis.primarySignal.confidence >= 80 ? "#10b981" :
      analysis.primarySignal.confidence >= 65 ? "#f59e0b" : "#ef4444";
    
    chart.createShape(
      { time: chart.getVisibleRange().from + 10, price: analysis.primarySignal.supportResistance.resistance * 1.05 },
      {
        shape: "text",
        text: `${language === 'pt-br' ? 'Análise:' : 'Analysis:'} ${analysis.primarySignal.direction} - ${analysis.primarySignal.confidence}% | ${language === 'pt-br' ? 'Estratégia:' : 'Strategy:'} ${analysis.primarySignal.strategy}`,
        overrides: {
          color: colors.label,
          fontsize: 12,
          fontweight: "bold",
          bordercolor: confidenceColor,
          backgroundColor: theme === 'dark' ? "#18181b99" : "#f8fafc99",
          drawBorder: true,
          borderwidth: 1,
        }
      }
    );
  }, [colors, theme]);
}
