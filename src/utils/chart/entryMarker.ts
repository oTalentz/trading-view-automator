
import { DrawEntryMarkerParams } from './types';

export function drawEntryMarker({
  chart,
  direction,
  overallConfluence,
  confidence,
  language
}: DrawEntryMarkerParams): void {
  try {
    // Determining marker type based on confluence and confidence
    let symbolType = "flag"; // Default marker
    let symbolText = "";
    
    const signalColor = direction === 'CALL' ? "#22c55e" : "#ef4444";
    
    // Determining cutoff values for different levels
    const isHighConfluence = overallConfluence >= 85 && confidence >= 90;
    const isMediumConfluence = overallConfluence >= 70 && confidence >= 75;
    
    // Selecting marker type and text based on confluence
    if (isHighConfluence) {
      symbolType = "emoji";
      symbolText = "💀"; // Skull for high confluence
    } else if (isMediumConfluence) {
      symbolType = "emoji";
      symbolText = "❤️"; // Heart for medium confluence
    } else {
      symbolType = direction === 'CALL' ? "arrow_up" : "arrow_down";
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
        channel: direction === 'CALL' ? "low" : "high"
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
}
