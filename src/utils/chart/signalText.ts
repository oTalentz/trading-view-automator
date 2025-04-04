
import { DrawSignalTextParams } from './types';

export function drawSignalText({
  chart, 
  direction, 
  confidence, 
  strategy, 
  overallConfluence,
  language
}: DrawSignalTextParams): void {
  try {
    const signalColor = direction === 'CALL' ? "#22c55e" : "#ef4444";
    const signalText = direction === 'CALL' 
      ? `▲ ${language === 'pt-br' ? 'COMPRA' : 'BUY'} (${confidence}%)` 
      : `▼ ${language === 'pt-br' ? 'VENDA' : 'SELL'} (${confidence}%)`;
    
    // Confluence text
    const confluenceText = `[${language === 'pt-br' ? 'Confluência' : 'Confluence'}: ${overallConfluence}%]`;
      
    // Strategy description
    const strategyText = strategy + (language === 'pt-br' ? ' - Entrada Precisa ' : ' - Precise Entry ') + confluenceText;
    
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
}
