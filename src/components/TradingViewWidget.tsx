
import React, { useEffect, useRef } from 'react';
import { useMultiTimeframeAnalysis } from '@/hooks/useMultiTimeframeAnalysis';
import { TradingViewChart } from './TradingView/TradingViewChart';
import { SignalDrawing } from './TradingView/SignalDrawing';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

// Update the TradingView types
declare global {
  interface Window {
    TradingView: any;
    tvWidget: any & {
      chart?: () => any;
      activeChart?: () => any;
      _ready?: boolean;
      onChartReady?: (callback: () => void) => void;
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
    chartReadyRef.current = true;
  };

  return (
    <>
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
    </>
  );
}
