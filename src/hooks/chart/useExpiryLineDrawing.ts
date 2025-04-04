
import { useCallback } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { ChartColors } from './types';

export function useExpiryLineDrawing(colors: ChartColors) {
  return useCallback((chart: any, analysis: MultiTimeframeAnalysisResult, language: string) => {
    // Adicionar linha de expiração aprimorada
    const expiryTime = new Date(analysis.primarySignal.expiryTime).getTime() / 1000;
    
    // Linha vertical para expiração
    chart.createShape(
      { time: expiryTime, price: 0 },
      {
        shape: "vertical_line",
        text: language === 'pt-br' ? "⏱️ Expiração" : "⏱️ Expiry",
        overrides: {
          linecolor: colors.expiry,
          linestyle: 1,
          linewidth: 2,
          showLabel: true,
          textcolor: colors.expiry,
          fontsize: 14,
          fontweight: "bold",
        }
      }
    );
  }, [colors]);
}
