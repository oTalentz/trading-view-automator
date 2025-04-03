
import { useEffect } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';

interface SignalDrawingProps {
  analysis: MultiTimeframeAnalysisResult | null;
  language: string;
  theme: string;
  interval: string;
}

export function SignalDrawing({ analysis, language, theme, interval }: SignalDrawingProps) {
  useEffect(() => {
    // Quando temos uma análise e o widget está pronto
    if (analysis && window.tvWidget && window.tvWidget._ready) {
      try {
        // Limpa desenhos anteriores
        const chart = window.tvWidget.activeChart();
        if (!chart) {
          console.error("TradingView chart not ready");
          return;
        }
        
        chart.clearAllDrawingTools();
        
        // Obter o sinal principal
        const primarySignal = analysis.primarySignal;
        
        // Determina cores com base na direção
        const signalColor = primarySignal.direction === 'CALL' ? "#22c55e" : "#ef4444";
        
        // Adiciona linha de suporte e resistência
        if (primarySignal.supportResistance) {
          // Linha de suporte
          chart.createShape(
            { price: primarySignal.supportResistance.support },
            { 
              shape: "horizontal_line", 
              lock: true,
              disableSelection: true,
              overrides: { 
                linecolor: "#22c55e",
                linestyle: 2, // linha tracejada
                linewidth: 1,
                showPriceLabel: true,
                text: language === 'pt-br' ? "Suporte" : "Support"
              }
            }
          );
          
          // Linha de resistência
          chart.createShape(
            { price: primarySignal.supportResistance.resistance },
            { 
              shape: "horizontal_line", 
              lock: true,
              disableSelection: true,
              overrides: { 
                linecolor: "#ef4444",
                linestyle: 2, // linha tracejada
                linewidth: 1,
                showPriceLabel: true,
                text: language === 'pt-br' ? "Resistência" : "Resistance"
              }
            }
          );
        }
        
        // Adiciona um indicador de direção preciso
        const signalText = primarySignal.direction === 'CALL' 
            ? `▲ ${language === 'pt-br' ? 'COMPRA' : 'BUY'} (${primarySignal.confidence}%)` 
            : `▼ ${language === 'pt-br' ? 'VENDA' : 'SELL'} (${primarySignal.confidence}%)`;
        
        // Texto de confluência
        const confluenceText = `[${language === 'pt-br' ? 'Confluência' : 'Confluence'}: ${analysis.overallConfluence}%]`;
          
        // Descrição da estratégia
        const strategyText = primarySignal.strategy + (language === 'pt-br' ? ' - Entrada Precisa ' : ' - Precise Entry ') + confluenceText;
        
        // Calcula o timestamp para a entrada
        const currentTime = chart.getVisibleRange().to - 5;
        const entryTime = currentTime + 10; // Tempo aproximado para entrada
        
        // Adiciona marca para o ponto de entrada
        chart.createMultipointShape(
          [
            { time: currentTime, price: 0 },
            { time: entryTime + 20, price: 0 }
          ],
          { 
            shape: "trend_line",
            text: signalText + "\n" + strategyText,
            textcolor: signalColor,
            linewidth: 2,
            linecolor: signalColor,
            linestyle: 2, // Linha tracejada para melhor visibilidade
            overrides: { 
              fontsize: 14,
              bold: true
            }
          }
        );
        
        // Determinando o tipo de marcador baseado na confluência e confiança
        let symbolType = "flag"; // Marcador padrão
        let symbolText = "";
        
        // Determinando os valores de corte para os diferentes níveis
        const isHighConfluence = analysis.overallConfluence >= 85 && primarySignal.confidence >= 90;
        const isMediumConfluence = analysis.overallConfluence >= 70 && primarySignal.confidence >= 75;
        
        // Selecionando o tipo de marcador e texto baseado na confluência
        if (isHighConfluence) {
          symbolType = "emoji";
          symbolText = "💀"; // Caveira para alta confluência
        } else if (isMediumConfluence) {
          symbolType = "emoji";
          symbolText = "❤️"; // Coração para média confluência
        } else {
          symbolType = primarySignal.direction === 'CALL' ? "arrow_up" : "arrow_down";
          symbolText = language === 'pt-br' ? "ENTRADA" : "ENTRY";
        }
          
        // Adiciona também um marcador no ponto exato de entrada
        chart.createShape(
          { 
            time: entryTime,
            price: 0, 
            channel: primarySignal.direction === 'CALL' ? "low" : "high"  
          },
          { 
            shape: symbolType,
            text: symbolText,
            overrides: { 
              color: signalColor,
              fontsize: 16,
              bold: true,
              size: isHighConfluence ? 3 : isMediumConfluence ? 2 : 1 // Tamanho variável para diferentes níveis
            }
          }
        );
        
        // Adiciona mais marcadores nas velas anteriores com diferentes níveis de confluência
        for (let i = 1; i <= 5; i++) {
          // Simulamos diferentes pontos de entrada com diferentes níveis de confluência
          const pastTime = currentTime - (i * 10);
          
          // Gerando valores simulados de confluência para pontos históricos
          const historicalConfluence = Math.round(70 + Math.random() * 30);
          const historicalConfidence = Math.round(70 + Math.random() * 30);
          const isHistoricalHigh = historicalConfluence > 85 && historicalConfidence > 90;
          const isHistoricalMedium = historicalConfluence > 70 && historicalConfidence > 75;
          
          let historicalSymbol = "flag";
          let historicalText = "";
          
          if (isHistoricalHigh) {
            historicalSymbol = "emoji";
            historicalText = "💀";
          } else if (isHistoricalMedium) {
            historicalSymbol = "emoji";
            historicalText = "❤️";
          } else {
            continue; // Pula pontos de baixa confluência
          }
          
          // Adiciona marcador histórico
          chart.createShape(
            { 
              time: pastTime,
              price: 0, 
              channel: i % 2 === 0 ? "high" : "low"  
            },
            { 
              shape: historicalSymbol,
              text: historicalText,
              overrides: { 
                color: i % 2 === 0 ? "#22c55e" : "#ef4444",
                fontsize: 14,
                bold: true,
                size: isHistoricalHigh ? 2 : 1
              }
            }
          );
        }
        
        // Adiciona anotação com detalhes da análise técnica e confluência
        const technicalText = `${primarySignal.strategy}\n${
          language === 'pt-br' ? 'Confiança' : 'Confidence'
        }: ${primarySignal.confidence}%\n${
          language === 'pt-br' ? 'Confluência' : 'Confluence'
        }: ${analysis.overallConfluence}%\n${
          language === 'pt-br' ? 'Força da Tendência' : 'Trend Strength'
        }: ${primarySignal.trendStrength}%`;
        
        chart.createShape(
          { 
            time: currentTime - 10,
            price: 0, 
            channel: "high"  
          },
          { 
            shape: "text",
            text: technicalText,
            overrides: { 
              color: theme === "dark" ? "#ffffff" : "#000000",
              fontsize: 12,
              bold: false
            }
          }
        );
        
        // Adiciona legenda para os símbolos
        const legendText = language === 'pt-br' 
          ? "💀 = Confluência Máxima\n❤️ = Confluência Média\n▲▼ = Confluência Regular" 
          : "💀 = Maximum Confluence\n❤️ = Medium Confluence\n▲▼ = Regular Confluence";
        
        chart.createShape(
          { 
            time: currentTime - 25,
            price: 0, 
            channel: "high"  
          },
          { 
            shape: "text",
            text: legendText,
            overrides: { 
              color: theme === "dark" ? "#ffffff" : "#000000",
              fontsize: 12,
              bold: true
            }
          }
        );
        
        // Adicionando informações de timeframes
        analysis.timeframes.forEach((tf, index) => {
          if (tf.timeframe !== interval) { // Não repetir o timeframe principal
            const tfText = `${tf.label}: ${tf.direction} (${tf.confidence}%)`;
            chart.createShape(
              { 
                time: currentTime - 10 - (index * 5),
                price: 0, 
                channel: index % 2 === 0 ? "low" : "high"
              },
              { 
                shape: "text",
                text: tfText,
                overrides: { 
                  color: tf.direction === 'CALL' ? "#22c55e" : "#ef4444",
                  fontsize: 11,
                  bold: false
                }
              }
            );
          }
        });
          
      } catch (e) {
        console.error("Erro ao criar sinal no gráfico:", e);
      }
    }
  }, [analysis, language, theme, interval]);

  return null; // This is a utility component that only has side effects
}
