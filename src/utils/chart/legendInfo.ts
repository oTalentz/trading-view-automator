
import { DrawLegendParams, DrawTimeframeInfoParams } from './types';

export function drawLegend({
  chart,
  language,
  theme
}: DrawLegendParams): void {
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
}

export function drawTimeframeInfo({
  chart,
  timeframes,
  interval
}: DrawTimeframeInfoParams): void {
  try {
    timeframes.forEach((tf, index) => {
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
}
