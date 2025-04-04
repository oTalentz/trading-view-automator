
import { useEffect } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { toast } from "sonner";
import { findSupportResistanceLevels } from '@/utils/technicalAnalysis';

// Este hook lida com o desenho de sinais no gráfico TradingView
export const useChartSignalDrawing = ({
  analysis,
  language,
  theme,
  interval,
  isChartReady,
  showLegend = true
}: {
  analysis: MultiTimeframeAnalysisResult | null;
  language: string;
  theme: string;
  interval: string;
  isChartReady: boolean;
  showLegend?: boolean;
}) => {
  // Effect para desenhar sinais quando o gráfico está pronto e a análise disponível
  useEffect(() => {
    if (!isChartReady || !analysis || !window.tvWidget || !window.tvWidget._ready) {
      return;
    }

    try {
      const chart = window.tvWidget.chart();
      if (!chart) return;

      // Limpar desenhos existentes
      chart.removeAllShapes();
      
      // Definir cores baseadas no tema atual com melhor contraste
      const colors = {
        support: theme === 'dark' ? "#10b981" : "#059669",
        resistance: theme === 'dark' ? "#ef4444" : "#dc2626",
        entry: {
          call: theme === 'dark' ? "#22c55e" : "#16a34a",
          put: theme === 'dark' ? "#ef4444" : "#dc2626"
        },
        expiry: theme === 'dark' ? "#f97316" : "#ea580c",
        label: theme === 'dark' ? "#e5e7eb" : "#1f2937"
      };
      
      // Desenhar zonas de suporte e resistência (ao invés de linhas simples)
      if (analysis.primarySignal.supportResistance) {
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
      }

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

      // Adicionar estudos de indicadores com configurações otimizadas
      try {
        // RSI com configuração aprimorada
        chart.createStudy("RSI@tv-basicstudies", false, false, {
          length: 14,
          "plot.color": "#7e57c2",
          "plot.linewidth": 2,
          "band.1": 30,
          "band.2": 70,
          "bandFill.1": true,
          "bandFill.2": true,
          "bandFill.color.1": "#10b98120", // Verde com transparência
          "bandFill.color.2": "#ef444420", // Vermelho com transparência
        }, { "precision": 1 });
        
        // MACD com configuração otimizada
        chart.createStudy("MACD@tv-basicstudies", false, false, {
          "fast length": 12,
          "slow length": 26,
          "signal length": 9,
          "histogram.color": "#2962ff",
          "histogram.linewidth": 2,
          "macd.color": "#ff6b00",
          "signal.color": "#f542cb",
          "macd.linewidth": 2,
          "signal.linewidth": 2
        });
        
        // Bollinger Bands com configurações melhoradas
        chart.createStudy("BB@tv-basicstudies", false, false, {
          length: 20,
          "plot.color": "#2962ff",
          "plot.linewidth": 2,
          "upper.color": "#ef4444",
          "lower.color": "#10b981",
          "basis.color": "#f59e0b",
          "upper.linewidth": 2,
          "lower.linewidth": 2,
          "basis.linewidth": 1,
          "deviation": 2
        });
        
        // Volume médio
        chart.createStudy("Volume@tv-basicstudies", false, false, {
          "volume.color.0": "#ef444470",
          "volume.color.1": "#10b98170",
          "volume.linewidth": 2,
          "volume ma.color": "#f59e0b",
          "volume ma.linewidth": 2,
          "volume ma.length": 20,
          "volume ma.visible": true
        });
        
        console.log("Estudos de indicadores adicionados com configurações otimizadas");
      } catch (err) {
        console.error("Erro ao adicionar estudos:", err);
        // Os estudos podem já existir, continuar
      }
      
    } catch (error) {
      console.error("Erro ao desenhar no gráfico:", error);
      toast.error(
        language === 'pt-br' 
          ? "Erro ao desenhar sinais no gráfico" 
          : "Error drawing signals on chart"
      );
    }
  }, [isChartReady, analysis, theme, language, interval]);
};
