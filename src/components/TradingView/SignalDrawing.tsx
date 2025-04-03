
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { useChartSignalDrawing } from '@/hooks/useChartSignalDrawing';

interface SignalDrawingProps {
  analysis: MultiTimeframeAnalysisResult | null;
  language: string;
  theme: string;
  interval: string;
  isChartReady: boolean;
}

export function SignalDrawing({ 
  analysis, 
  language, 
  theme, 
  interval, 
  isChartReady 
}: SignalDrawingProps) {
  // Use the custom hook to handle all drawing logic
  useChartSignalDrawing({
    analysis,
    language,
    theme,
    interval,
    isChartReady
  });

  return null; // This is a utility component that only has side effects
}
