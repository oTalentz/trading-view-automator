
import { useState, useEffect } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { 
  getChartFromWidget,
  clearChartDrawings,
  drawSupportResistanceLines,
  drawSignalText,
  drawEntryMarker,
  drawHistoricalMarkers,
  drawTechnicalAnalysis,
  drawLegend,
  drawTimeframeInfo,
  notifyDrawingSuccess,
  notifyDrawingError
} from '@/utils/chartDrawingUtils';

interface UseChartSignalDrawingProps {
  analysis: MultiTimeframeAnalysisResult | null;
  language: string;
  theme: string;
  interval: string;
  isChartReady: boolean;
}

export function useChartSignalDrawing({
  analysis,
  language,
  theme,
  interval,
  isChartReady
}: UseChartSignalDrawingProps) {
  const [lastDrawnAnalysis, setLastDrawnAnalysis] = useState<string | null>(null);

  useEffect(() => {
    // Only proceed if we have analysis and the widget is ready
    if (!analysis || !isChartReady) {
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
      const chart = getChartFromWidget();
      if (!chart) {
        return;
      }
      
      // Clear previous drawings
      clearChartDrawings(chart);
      
      // Get the primary signal
      const primarySignal = analysis.primarySignal;
      
      // Draw support and resistance lines
      if (primarySignal.supportResistance) {
        drawSupportResistanceLines({
          chart,
          supportResistance: primarySignal.supportResistance,
          language
        });
      }
      
      // Draw signal text and direction
      drawSignalText({
        chart,
        direction: primarySignal.direction,
        confidence: primarySignal.confidence,
        strategy: primarySignal.strategy,
        overallConfluence: analysis.overallConfluence,
        language
      });
      
      // Draw entry marker based on confidence
      drawEntryMarker({
        chart,
        direction: primarySignal.direction,
        overallConfluence: analysis.overallConfluence,
        confidence: primarySignal.confidence,
        language
      });
      
      // Draw historical markers for past signals
      drawHistoricalMarkers({
        chart
      });
      
      // Draw technical analysis information
      drawTechnicalAnalysis({
        chart,
        strategy: primarySignal.strategy,
        confidence: primarySignal.confidence,
        overallConfluence: analysis.overallConfluence,
        trendStrength: primarySignal.trendStrength,
        language,
        theme
      });
      
      // Draw legend for symbols
      drawLegend({
        chart,
        language,
        theme
      });
      
      // Draw timeframes information
      drawTimeframeInfo({
        chart,
        timeframes: analysis.timeframes,
        interval
      });

      // Mark this analysis as drawn
      setLastDrawnAnalysis(analysisKey);
      
      // Notify success
      notifyDrawingSuccess(language);
          
    } catch (e) {
      console.error("Error drawing signals on chart:", e);
      notifyDrawingError(language);
    }
  }, [analysis, language, theme, interval, isChartReady, lastDrawnAnalysis]);

  return {
    lastDrawnAnalysis,
    clearLastDrawnAnalysis: () => setLastDrawnAnalysis(null)
  };
}
