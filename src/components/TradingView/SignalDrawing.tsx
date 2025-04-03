
import { useEffect, useState } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { toast } from 'sonner';

interface SignalDrawingProps {
  analysis: MultiTimeframeAnalysisResult | null;
  language: string;
  theme: string;
  interval: string;
  isChartReady: boolean;
}

export function SignalDrawing({ analysis, language, theme, interval, isChartReady }: SignalDrawingProps) {
  const [lastDrawnAnalysis, setLastDrawnAnalysis] = useState<string | null>(null);

  useEffect(() => {
    // Only proceed if we have analysis and the widget is ready
    if (!analysis || !isChartReady || !window.tvWidget || !window.tvWidget._ready) {
      return;
    }

    // Prevent redrawing the same analysis
    const analysisKey = `${analysis.primarySignal.timestamp}-${analysis.primarySignal.direction}-${analysis.overallConfluence}`;
    if (lastDrawnAnalysis === analysisKey) {
      return;
    }

    console.log("Drawing signals on chart with analysis:", analysis);
    
    try {
      // Get the chart instance
      if (!window.tvWidget.chart || typeof window.tvWidget.chart !== 'function') {
        console.error("TradingView chart function not available");
        return;
      }
      
      const chart = window.tvWidget.chart();
      if (!chart) {
        console.error("Failed to get chart from TradingView widget");
        return;
      }
      
      // Clear previous drawings
      if (chart.clearAllDrawingTools) {
        chart.clearAllDrawingTools();
      } else {
        console.warn("clearAllDrawingTools not available");
      }
      
      // Get the primary signal
      const primarySignal = analysis.primarySignal;
      
      // Determine colors based on direction
      const signalColor = primarySignal.direction === 'CALL' ? "#22c55e" : "#ef4444";
      
      // Add support and resistance lines
      if (primarySignal.supportResistance) {
        try {
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
          
          console.log("Added support and resistance lines");
        } catch (e) {
          console.error("Error creating support/resistance lines:", e);
        }
      }
      
      try {
        // Add precise direction indicator
        const signalText = primarySignal.direction === 'CALL' 
            ? `▲ ${language === 'pt-br' ? 'COMPRA' : 'BUY'} (${primarySignal.confidence}%)` 
            : `▼ ${language === 'pt-br' ? 'VENDA' : 'SELL'} (${primarySignal.confidence}%)`;
        
        // Confluence text
        const confluenceText = `[${language === 'pt-br' ? 'Confluência' : 'Confluence'}: ${analysis.overallConfluence}%]`;
          
        // Strategy description
        const strategyText = primarySignal.strategy + (language === 'pt-br' ? ' - Entrada Precisa ' : ' - Precise Entry ') + confluenceText;
        
        // Calculate timestamp for entry
        const visibleRange = chart.getVisibleRange();
        const currentTime = visibleRange.to - 5;
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
        
        console.log("Added trend line with signal text");
      } catch (e) {
        console.error("Error creating trend line:", e);
      }
      
      try {
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
          
        // Get visible range from chart for proper placement
        const visibleRange = chart.getVisibleRange();
        const currentTime = visibleRange.to - 5;
        const entryTime = currentTime + 10;
          
        // Add a marker at the exact entry point
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
        
        console.log(`Added entry marker: ${symbolType} with text: ${symbolText}`);
      } catch (e) {
        console.error("Error creating entry marker:", e);
      }
      
      try {
        // Add more markers in previous candles with different confluence levels
        for (let i = 1; i <= 5; i++) {
          // Get visible range for proper placement
          const visibleRange = chart.getVisibleRange();
          const currentTime = visibleRange.to - 5;
          
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
        
        console.log("Added historical markers");
      } catch (e) {
        console.error("Error creating historical markers:", e);
      }
      
      try {
        // Add annotation with technical analysis and confluence details
        const technicalText = `${primarySignal.strategy}\n${
          language === 'pt-br' ? 'Confiança' : 'Confidence'
        }: ${primarySignal.confidence}%\n${
          language === 'pt-br' ? 'Confluência' : 'Confluence'
        }: ${analysis.overallConfluence}%\n${
          language === 'pt-br' ? 'Força da Tendência' : 'Trend Strength'
        }: ${primarySignal.trendStrength}%`;
        
        // Get visible range for proper placement
        const visibleRange = chart.getVisibleRange();
        const currentTime = visibleRange.to - 15;
        
        chart.createShape(
          { 
            time: currentTime,
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
        
        console.log("Added technical analysis annotation");
      } catch (e) {
        console.error("Error creating technical analysis annotation:", e);
      }
      
      try {
        // Add legend for symbols
        const legendText = language === 'pt-br' 
          ? "💀 = Confluência Máxima\n❤️ = Confluência Média\n▲▼ = Confluência Regular" 
          : "💀 = Maximum Confluence\n❤️ = Medium Confluence\n▲▼ = Regular Confluence";
        
        // Get visible range for proper placement
        const visibleRange = chart.getVisibleRange();
        const currentTime = visibleRange.to - 25;
        
        chart.createShape(
          { 
            time: currentTime,
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
        
        console.log("Added legend for symbols");
      } catch (e) {
        console.error("Error creating legend:", e);
      }
      
      try {
        // Add timeframes information
        analysis.timeframes.forEach((tf, index) => {
          if (tf.timeframe !== interval) { // Don't repeat the main timeframe
            const tfText = `${tf.label}: ${tf.direction} (${tf.confidence}%)`;
            
            // Get visible range for proper placement
            const visibleRange = chart.getVisibleRange();
            const currentTime = visibleRange.to - 10 - (index * 5);
            
            chart.createShape(
              { 
                time: currentTime,
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
        
        console.log("Added timeframes information");
      } catch (e) {
        console.error("Error creating timeframes information:", e);
      }

      // Mark this analysis as drawn
      setLastDrawnAnalysis(analysisKey);
      
      // Notify that signals were drawn successfully
      toast.success(
        language === 'pt-br' ? "Sinais desenhados no gráfico" : "Signals drawn on chart",
        { duration: 2000 }
      );
          
    } catch (e) {
      console.error("Erro ao criar sinal no gráfico:", e);
      toast.error(
        language === 'pt-br' ? "Erro ao desenhar sinais no gráfico" : "Error drawing signals on chart", 
        { duration: 3000 }
      );
    }
  }, [analysis, language, theme, interval, isChartReady, lastDrawnAnalysis]);

  return null; // This is a utility component that only has side effects
}
