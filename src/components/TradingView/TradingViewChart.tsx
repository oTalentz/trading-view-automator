
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { initTradingViewWidget } from '@/utils/tradingViewUtils';

interface TradingViewChartProps {
  symbol: string;
  interval: string;
  onChartReady?: () => void;
}

export function TradingViewChart({ symbol, interval, onChartReady }: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { language } = useLanguage();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => initWidget();
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (window.TradingView) {
      initWidget();
    }
  }, [theme, symbol, interval, language]);

  const initWidget = () => {
    if (container.current && window.TradingView) {
      // Clear the container before initializing a new widget
      container.current.innerHTML = '';
      
      // Initialize the TradingView widget with the correct configuration
      initTradingViewWidget({
        symbol,
        interval,
        theme,
        language,
        container: "tradingview-widget-container",
        onChartReady
      });
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] rounded-lg overflow-hidden border">
      <div
        id="tradingview-widget-container"
        ref={container}
        className="tradingview-widget-container"
      />
    </div>
  );
}
