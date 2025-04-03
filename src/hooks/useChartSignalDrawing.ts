
import { useEffect } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { toast } from "sonner";
import { findSupportResistanceLevels } from '@/utils/technicalAnalysis';

// This hook handles drawing signals on the TradingView chart
export const useChartSignalDrawing = ({
  analysis,
  language,
  theme,
  interval,
  isChartReady
}: {
  analysis: MultiTimeframeAnalysisResult | null;
  language: string;
  theme: string;
  interval: string;
  isChartReady: boolean;
}) => {
  // Effect to draw signals when chart is ready and analysis data is available
  useEffect(() => {
    if (!isChartReady || !analysis || !window.tvWidget || !window.tvWidget._ready) {
      return;
    }

    try {
      const chart = window.tvWidget.chart();
      if (!chart) return;

      // Clean up existing drawings
      chart.removeAllShapes();
      
      // Draw support and resistance levels
      if (analysis.primarySignal.supportResistance) {
        const { support, resistance } = analysis.primarySignal.supportResistance;

        // Draw support level
        chart.createShape(
          { price: support, time: chart.getVisibleRange().from + Math.floor((chart.getVisibleRange().to - chart.getVisibleRange().from) * 0.05) },
          {
            shape: "horizontal_line",
            text: `${language === 'pt-br' ? "Suporte" : "Support"}: ${support}`,
            overrides: {
              linecolor: theme === 'dark' ? "#22c55e" : "#16a34a",
              linestyle: 0,
              linewidth: 2,
              showLabel: true,
              textcolor: theme === 'dark' ? "#22c55e" : "#16a34a",
              fontsize: 14,
            }
          }
        );
        
        // Draw resistance level
        chart.createShape(
          { price: resistance, time: chart.getVisibleRange().from + Math.floor((chart.getVisibleRange().to - chart.getVisibleRange().from) * 0.05) },
          {
            shape: "horizontal_line",
            text: `${language === 'pt-br' ? "Resistência" : "Resistance"}: ${resistance}`,
            overrides: {
              linecolor: theme === 'dark' ? "#ef4444" : "#dc2626",
              linestyle: 0,
              linewidth: 2,
              showLabel: true,
              textcolor: theme === 'dark' ? "#ef4444" : "#dc2626",
              fontsize: 14,
            }
          }
        );

        console.log("Support and resistance levels drawn:", support, resistance);
      }

      // Draw entry point arrow
      const entryTime = new Date(analysis.primarySignal.entryTime).getTime() / 1000;
      
      chart.createShape(
        { time: entryTime, price: analysis.primarySignal.direction === 'CALL' ? 
          analysis.primarySignal.supportResistance.support * 0.99 : 
          analysis.primarySignal.supportResistance.resistance * 1.01 },
        {
          shape: analysis.primarySignal.direction === 'CALL' ? "arrow_up" : "arrow_down",
          text: analysis.primarySignal.direction === 'CALL' ? 
            (language === 'pt-br' ? "🔼 COMPRA" : "🔼 BUY") : 
            (language === 'pt-br' ? "🔽 VENDA" : "🔽 SELL"),
          overrides: {
            color: analysis.primarySignal.direction === 'CALL' ? "#22c55e" : "#ef4444",
            textcolor: analysis.primarySignal.direction === 'CALL' ? 
              (theme === 'dark' ? "#22c55e" : "#16a34a") : 
              (theme === 'dark' ? "#ef4444" : "#dc2626"),
            fontsize: 14,
            size: 2,
          }
        }
      );
      
      // Add expiry line
      const expiryTime = new Date(analysis.primarySignal.expiryTime).getTime() / 1000;
      
      chart.createShape(
        { time: expiryTime, price: 0 },
        {
          shape: "vertical_line",
          text: language === 'pt-br' ? "Expiração" : "Expiry",
          overrides: {
            linecolor: theme === 'dark' ? "#f97316" : "#ea580c", 
            linestyle: 1,
            linewidth: 1,
            showLabel: true,
            textcolor: theme === 'dark' ? "#f97316" : "#ea580c",
            fontsize: 12,
          }
        }
      );

      // Add indicator studies if not already present
      try {
        // Add RSI indicator if not present
        chart.createStudy("RSI@tv-basicstudies", false, false, {
          length: 14,
          "plot.color": "#7e57c2"
        });
        
        // Add MACD indicator
        chart.createStudy("MACD@tv-basicstudies", false, false, {
          "fast length": 12,
          "slow length": 26,
          "signal length": 9,
        });
        
        // Add Bollinger Bands
        chart.createStudy("BB@tv-basicstudies", false, false, {
          length: 20,
          "plot.color": "#2962ff"
        });
        
        console.log("Chart studies added successfully");
      } catch (err) {
        console.error("Error adding studies:", err);
        // Studies might already exist, continue
      }
      
    } catch (error) {
      console.error("Error drawing on chart:", error);
      toast.error(
        language === 'pt-br' 
          ? "Erro ao desenhar sinais no gráfico" 
          : "Error drawing signals on chart"
      );
    }
  }, [isChartReady, analysis, theme, language, interval]);
};
