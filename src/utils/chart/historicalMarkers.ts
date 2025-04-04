
import { DrawHistoricalMarkersParams } from './types';

export function drawHistoricalMarkers({
  chart
}: DrawHistoricalMarkersParams): void {
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
}
