
import { useCallback } from 'react';
import { ChartSignalDrawingOptions } from './types';

export function useAIDrawing() {
  const drawAIInsights = useCallback((
    chart: any,
    { analysis, language, theme, isChartReady }: ChartSignalDrawingOptions
  ) => {
    if (!chart || !isChartReady || !analysis) {
      return;
    }
    
    // Check if the analysis has AI optimization applied
    const hasAIOptimization = analysis.primarySignal.indicators.includes('AI Optimization');
    
    if (hasAIOptimization) {
      // Add a AI marker to the chart
      const currentSeries = chart.series[0];
      const lastPointIndex = currentSeries?.data?.length - 1;
      
      if (lastPointIndex && lastPointIndex > 0) {
        // Get the highest high and lowest low from recent data points
        let highPoint = -Infinity;
        let highPointIndex = 0;
        
        for (let i = Math.max(0, lastPointIndex - 10); i <= lastPointIndex; i++) {
          const point = currentSeries.data[i];
          if (point && point.high > highPoint) {
            highPoint = point.high;
            highPointIndex = i;
          }
        }
        
        // Add marker at the high point with AI icon
        if (highPointIndex > 0) {
          const markerColor = theme === 'dark' ? '#6366f1' : '#4f46e5';
          
          chart.addAnnotation({
            id: 'ai-marker',
            labels: [{
              point: {
                x: currentSeries.data[highPointIndex].x,
                y: currentSeries.data[highPointIndex].high + 
                   (currentSeries.data[highPointIndex].high * 0.002), // Slight offset
                xAxis: 0,
                yAxis: 0
              },
              text: '🧠',
              style: {
                fontSize: '16px',
                color: markerColor
              }
            }]
          });
        }
      }
    }
    
    return () => {
      // Clean up the annotation
      try {
        chart.removeAnnotation('ai-marker');
      } catch (e) {
        // Ignore errors if annotation doesn't exist
      }
    };
  }, []);
  
  return {
    drawAIInsights
  };
}
