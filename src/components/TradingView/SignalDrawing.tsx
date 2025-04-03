
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
    // When we have analysis and the widget is ready
    if (analysis && window.tvWidget && window.tvWidget._ready) {
      try {
        // Get the chart instance correctly
        if (!window.tvWidget.chart) {
          console.error("TradingView chart not ready or not available");
          return;
        }
        
        const chart = window.tvWidget.chart();
        
        // Clear previous drawings
        chart.clearAllDrawingTools && chart.clearAllDrawingTools();
        
        // Get the primary signal
        const primarySignal = analysis.primarySignal;
        
        // Determine colors based on direction
        const signalColor = primarySignal.direction === 'CALL' ? "#22c55e" : "#ef4444";
        
        // Add support and resistance lines
        if (primarySignal.supportResistance) {
          // Support line
          chart.createShape(
            { price: primarySignal.supportResistance.support },
            { 
              shape: "horizontal_line", 
              lock: true,
              disableSelection: true,
              overrides: { 
                linecolor: "#22c55e",
                linestyle: 2, // dashed line
                linewidth: 1,
                showPriceLabel: true,
                text: language === 'pt-br' ? "Suporte" : "Support"
              }
            }
          );
          
          // Resistance line
          chart.createShape(
            { price: primarySignal.supportResistance.resistance },
            { 
              shape: "horizontal_line", 
              lock: true,
              disableSelection: true,
              overrides: { 
                linecolor: "#ef4444",
                linestyle: 2, // dashed line
                linewidth: 1,
                showPriceLabel: true,
                text: language === 'pt-br' ? "Resistência" : "Resistance"
              }
            }
          );
        }
        
        // Add precise direction indicator
        const signalText = primarySignal.direction === 'CALL' 
            ? `▲ ${language === 'pt-br' ? 'COMPRA' : 'BUY'} (${primarySignal.confidence}%)` 
            : `▼ ${language === 'pt-br' ? 'VENDA' : 'SELL'} (${primarySignal.confidence}%)`;
        
        // Confluence text
        const confluenceText = `[${language === 'pt-br' ? 'Confluência' : 'Confluence'}: ${analysis.overallConfluence}%]`;
          
        // Strategy description
        const strategyText = primarySignal.strategy + (language === 'pt-br' ? ' - Entrada Precisa ' : ' - Precise Entry ') + confluenceText;
        
        // Calculate timestamp for entry
        const currentTime = chart.getVisibleRange().to - 5;
        const entryTime = currentTime + 10; // Approximate time for entry
        
        // Add mark for entry point
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
            linestyle: 2, // Dashed line for better visibility
            overrides: { 
              fontsize: 14,
              bold: true
            }
          }
        );
        
        // Determining marker type based on confluence and confidence
        let symbolType = "flag"; // Default marker
        let symbolText = "";
        
        // Determining cutoff values for different levels
        const isHighConfluence = analysis.overallConfluence >= 85 && primarySignal.confidence >= 90;
        const isMediumConfluence = analysis.overallConfluence >= 70 && primarySignal.confidence >= 75;
        
        // Selecting marker type and text based on confluence
        if (isHighConfluence) {
          symbolType = "emoji";
          symbolText = "💀"; // Skull for high confluence
        } else if (isMediumConfluence) {
          symbolType = "emoji";
          symbolText = "❤️"; // Heart for medium confluence
        } else {
          symbolType = primarySignal.direction === 'CALL' ? "arrow_up" : "arrow_down";
          symbolText = language === 'pt-br' ? "ENTRADA" : "ENTRY";
        }
          
        // Also add a marker at the exact entry point
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
              size: isHighConfluence ? 3 : isMediumConfluence ? 2 : 1 // Variable size for different levels
            }
          }
        );
        
        // Add more markers in previous candles with different confluence levels
        for (let i = 1; i <= 5; i++) {
          // Simulate different entry points with different confluence levels
          const pastTime = currentTime - (i * 10);
          
          // Generate simulated confluence values for historical points
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
            continue; // Skip low confluence points
          }
          
          // Add historical marker
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
        
        // Add annotation with technical analysis and confluence details
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
        
        // Add legend for symbols
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
        
        // Add timeframes information
        analysis.timeframes.forEach((tf, index) => {
          if (tf.timeframe !== interval) { // Don't repeat the main timeframe
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
