
import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { useMultiTimeframeAnalysis } from '@/hooks/useMultiTimeframeAnalysis';
import { TradingViewChart } from './TradingView/TradingViewChart';
import { SignalDrawing } from './TradingView/SignalDrawing';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { ConfluenceHeatmap } from './ConfluenceHeatmap';
import { Skeleton } from '@/components/ui/skeleton';
import { MachineLearningInsights } from './MachineLearningInsights';
import { AIStrategyInsights } from './AIStrategyInsights';
import { CorrelationAnalysis } from './CorrelationAnalysis';
import { MLStrategySelector } from './MLStrategySelector';
import { SignalIndicator } from './SignalIndicator';

// Lazy load components for better performance
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
      {/* Entry Signal at the top */}
      <div className="mb-4 transform perspective-[1000px] hover:rotate-y-1 transition-all duration-500">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <span className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
            <span className="text-primary text-lg">🎯</span>
          </span>
          Entry Signal
        </h2>
        <SignalIndicator symbol={symbol} interval={interval} />
      </div>
      
      <div className="rounded-lg overflow-hidden border bg-card h-[600px] transform perspective-[1000px] hover:rotate-y-1 transition-all duration-500 shadow-xl">
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
        <>
          {/* ML Strategy & Confluence Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <ConfluenceHeatmap analysis={analysis} />
            <MLStrategySelector symbol={symbol} interval={interval} />
            <MachineLearningInsights symbol={symbol} interval={interval} />
          </div>
          
          {/* AI & Technical Analysis Hidden by Default */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 hidden md:grid">
            <CorrelationAnalysis symbol={symbol} />
            <AIStrategyInsights symbol={symbol} />
          </div>
        </>
      )}
    </div>
  );
}
