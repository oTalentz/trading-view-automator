
import { useCallback } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { ChartColors } from './types';

export function useEntrySignalDrawing(colors: ChartColors) {
  return useCallback((chart: any, analysis: MultiTimeframeAnalysisResult, language: string) => {
    // Desenhar seta de entrada com destaque visual melhorado
    const entryTime = new Date(analysis.primarySignal.entryTime).getTime() / 1000;
    const isCall = analysis.primarySignal.direction === 'CALL';
    
    // Criar uma zona de destaque para o ponto de entrada
    chart.createShape(
      { 
        time: entryTime, 
        price: isCall
          ? analysis.primarySignal.supportResistance.support * 0.995
          : analysis.primarySignal.supportResistance.resistance * 1.005
      },
      {
        shape: isCall ? "arrow_up" : "arrow_down",
        text: isCall
          ? (language === 'pt-br' ? "🔼 ENTRADA COMPRA" : "🔼 BUY ENTRY")
          : (language === 'pt-br' ? "🔽 ENTRADA VENDA" : "🔽 SELL ENTRY"),
        overrides: {
          color: isCall ? colors.entry.call : colors.entry.put,
          textcolor: isCall ? colors.entry.call : colors.entry.put,
          fontsize: 16,
          fontweight: "bold",
          size: 3,
        }
      }
    );
    
    // Adicionar zona de destaque ao redor do ponto de entrada
    chart.createMultipointShape(
      [
        { price: isCall ? analysis.primarySignal.supportResistance.support * 0.99 : analysis.primarySignal.supportResistance.resistance * 1.01, time: entryTime - 60 },
        { price: isCall ? analysis.primarySignal.supportResistance.support * 0.99 : analysis.primarySignal.supportResistance.resistance * 1.01, time: entryTime + 60 },
        { price: isCall ? analysis.primarySignal.supportResistance.support * 1.01 : analysis.primarySignal.supportResistance.resistance * 0.99, time: entryTime + 60 },
        { price: isCall ? analysis.primarySignal.supportResistance.support * 1.01 : analysis.primarySignal.supportResistance.resistance * 0.99, time: entryTime - 60 }
      ],
      {
        shape: "polygon",
        overrides: {
          backgroundColor: `${isCall ? colors.entry.call : colors.entry.put}33`, // Com transparência
          linecolor: isCall ? colors.entry.call : colors.entry.put,
          linewidth: 1,
          linestyle: 1,
        }
      }
    );
  }, [colors]);
}
