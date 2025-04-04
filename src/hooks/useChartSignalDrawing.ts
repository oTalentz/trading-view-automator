
import { useEffect } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { useChartDrawing } from './chart/useChartDrawing';
import { ChartSignalDrawingOptions } from './chart/types';

// Este hook lida com o desenho de sinais no gráfico TradingView
export const useChartSignalDrawing = ({
  analysis,
  language,
  theme,
  interval,
  isChartReady,
  showLegend = true
}: ChartSignalDrawingOptions) => {
  // Usar o hook de desenho refatorado
  const drawChart = useChartDrawing(theme);

  // Effect para desenhar sinais quando o gráfico está pronto e a análise disponível
  useEffect(() => {
    if (!isChartReady || !analysis || !window.tvWidget || !window.tvWidget._ready) {
      return;
    }

    try {
      const chart = window.tvWidget.chart();
      if (!chart) return;

      // Desenhar elementos do gráfico com o novo hook refatorado
      drawChart(chart, analysis, language);
      
    } catch (error) {
      console.error("Erro ao acessar o gráfico:", error);
    }
  }, [isChartReady, analysis, theme, language, interval, drawChart]);
};
