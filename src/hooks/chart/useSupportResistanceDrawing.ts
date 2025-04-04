
import { useCallback } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { ChartColors } from './types';

export function useSupportResistanceDrawing(colors: ChartColors) {
  return useCallback((chart: any, analysis: MultiTimeframeAnalysisResult, language: string) => {
    if (!analysis.primarySignal.supportResistance) return;
    
    const { support, resistance } = analysis.primarySignal.supportResistance;
    
    // Obter intervalo de tempo visível
    const visibleRange = chart.getVisibleRange();
    const timeOffset = Math.floor((visibleRange.to - visibleRange.from) * 0.05);
    const startTime = visibleRange.from + timeOffset;
    const endTime = visibleRange.to - timeOffset;

    // Zona de suporte com gradiente
    chart.createMultipointShape(
      [
        { price: support * 0.998, time: startTime },
        { price: support * 0.998, time: endTime },
        { price: support * 1.002, time: endTime },
        { price: support * 1.002, time: startTime }
      ],
      {
        shape: "polygon",
        overrides: {
          backgroundColor: `${colors.support}22`, // Adiciona transparência 
          linecolor: colors.support,
          linewidth: 1,
          linestyle: 1,
        }
      }
    );
    
    // Texto de suporte
    chart.createShape(
      { price: support * 0.997, time: startTime },
      {
        shape: "text",
        text: `${language === 'pt-br' ? "Suporte" : "Support"}: ${support.toFixed(2)}`,
        overrides: {
          color: colors.support,
          fontsize: 12,
          fontweight: "bold",
        }
      }
    );
    
    // Zona de resistência com gradiente
    chart.createMultipointShape(
      [
        { price: resistance * 0.998, time: startTime },
        { price: resistance * 0.998, time: endTime },
        { price: resistance * 1.002, time: endTime },
        { price: resistance * 1.002, time: startTime }
      ],
      {
        shape: "polygon",
        overrides: {
          backgroundColor: `${colors.resistance}22`, // Adiciona transparência
          linecolor: colors.resistance,
          linewidth: 1,
          linestyle: 1,
        }
      }
    );
    
    // Texto de resistência
    chart.createShape(
      { price: resistance * 1.003, time: startTime },
      {
        shape: "text",
        text: `${language === 'pt-br' ? "Resistência" : "Resistance"}: ${resistance.toFixed(2)}`,
        overrides: {
          color: colors.resistance,
          fontsize: 12,
          fontweight: "bold",
        }
      }
    );

    console.log("Níveis de suporte e resistência desenhados:", support, resistance);
  }, [colors]);
}
