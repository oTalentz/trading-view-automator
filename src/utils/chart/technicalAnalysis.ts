
import { DrawTechnicalAnalysisParams } from './types';

export function drawTechnicalAnalysis({
  chart,
  strategy,
  confidence,
  overallConfluence,
  trendStrength,
  language,
  theme
}: DrawTechnicalAnalysisParams): void {
  try {
    // Add annotation with technical analysis and confluence details
    const technicalText = `${strategy}\n${
      language === 'pt-br' ? 'Confiança' : 'Confidence'
    }: ${confidence}%\n${
      language === 'pt-br' ? 'Confluência' : 'Confluence'
    }: ${overallConfluence}%\n${
      language === 'pt-br' ? 'Força da Tendência' : 'Trend Strength'
    }: ${trendStrength}%`;
    
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
}
