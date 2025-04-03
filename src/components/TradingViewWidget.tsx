
import React from 'react';
import { useMultiTimeframeAnalysis } from '@/hooks/useMultiTimeframeAnalysis';
import { TradingViewChart } from './TradingView/TradingViewChart';
import { SignalDrawing } from './TradingView/SignalDrawing';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

// Update the TradingView types
declare global {
  interface Window {
    TradingView: any;
    tvWidget: any;
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

  return (
    <>
      <TradingViewChart symbol={symbol} interval={interval} />
      <SignalDrawing 
        analysis={analysis} 
        language={language} 
        theme={theme} 
        interval={interval} 
      />
    </>
  );
}
