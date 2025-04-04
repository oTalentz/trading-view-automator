
import React, { useEffect, useRef } from 'react';
import { useMultiTimeframeAnalysis } from '@/hooks/useMultiTimeframeAnalysis';
import { TradingViewChart } from './TradingView/TradingViewChart';
import { SignalDrawing } from './TradingView/SignalDrawing';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { ConfluenceHeatmap } from './ConfluenceHeatmap';
import { VolumeAnalysis } from './VolumeAnalysis';
import { MachineLearningInsights } from './MachineLearningInsights';
import { AIStrategyInsights } from './AIStrategyInsights';
import { AssetComparison } from './AssetComparison';

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
          <VolumeAnalysis symbol={symbol} />
          <AssetComparison mainSymbol={symbol} />
        </div>
      )}
    </div>
  );
}
