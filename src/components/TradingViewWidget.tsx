
import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { useMultiTimeframeAnalysis } from '@/hooks/useMultiTimeframeAnalysis';
import { TradingViewChart } from './TradingView/TradingViewChart';
import { SignalDrawing } from './TradingView/SignalDrawing';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { ConfluenceHeatmap } from './ConfluenceHeatmap';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components for better performance
const VolumeAnalysis = lazy(() => import('./VolumeAnalysis').then(mod => ({ default: mod.VolumeAnalysis })));
const MachineLearningInsights = lazy(() => import('./MachineLearningInsights').then(mod => ({ default: mod.MachineLearningInsights })));
const AssetComparison = lazy(() => import('./AssetComparison').then(mod => ({ default: mod.AssetComparison })));
const AIStrategyInsights = lazy(() => import('./AIStrategyInsights').then(mod => ({ default: mod.AIStrategyInsights })));
const AdvancedBacktesting = lazy(() => import('./backtest/AdvancedBacktesting').then(mod => ({ default: mod.AdvancedBacktesting })));
const CustomAlerts = lazy(() => import('./alerts/CustomAlerts').then(mod => ({ default: mod.CustomAlerts })));

// Update the TradingView types
declare global {
  interface Window {
    TradingView: any;
    tvWidget: any & {
      chart?: () => any;
      activeChart?: () => any;
      _ready?: boolean;
    };
  }
}

interface TradingViewWidgetProps {
  symbol?: string;
  interval?: string;
}

export function TradingViewWidget({ 
  symbol = "BINANCE:BTCUSDT", 
  interval = "1" 
}: TradingViewWidgetProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { analysis } = useMultiTimeframeAnalysis(symbol, interval);
  const chartReadyRef = useRef(false);

  useEffect(() => {
    // Reset chart ready ref when symbol or interval changes
    chartReadyRef.current = false;
  }, [symbol, interval]);

  // Handler for when chart is ready
  const handleChartReady = () => {
    console.log("Chart is ready - setting chartReadyRef to true");
    chartReadyRef.current = true;
  };

  // Suspense fallback component
  const AnalyticsSkeleton = () => (
    <div className="border rounded-lg p-4 w-full">
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-[150px] w-full mb-4" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg overflow-hidden border bg-card h-[800px]">
        <TradingViewChart 
          symbol={symbol} 
          interval={interval} 
          onChartReady={handleChartReady} 
        />
        <SignalDrawing 
          analysis={analysis} 
          language={language} 
          theme={theme} 
          interval={interval} 
          isChartReady={chartReadyRef.current}
        />
      </div>
      
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <ConfluenceHeatmap analysis={analysis} />
          
          <Suspense fallback={<AnalyticsSkeleton />}>
            <CustomAlerts symbol={symbol} interval={interval} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
