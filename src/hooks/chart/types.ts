
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';

export interface ChartSignalDrawingOptions {
  analysis: MultiTimeframeAnalysisResult | null;
  language: string;
  theme: string;
  interval: string;
  isChartReady: boolean;
  showLegend?: boolean;
}

export interface ChartColors {
  support: string;
  resistance: string;
  entry: {
    call: string;
    put: string;
  };
  expiry: string;
  label: string;
}
