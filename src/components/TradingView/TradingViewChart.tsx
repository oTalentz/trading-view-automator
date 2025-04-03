
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { initTradingViewWidget } from '@/utils/tradingViewUtils';

interface TradingViewChartProps {
  symbol: string;
  interval: string;
}

export function TradingViewChart({ symbol, interval }: TradingViewChartProps) {
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
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.TradingView) {
      initWidget();
    }
  }, [theme, symbol, interval, language]);

  const initWidget = () => {
    if (container.current && window.TradingView) {
      container.current.innerHTML = '';
      initTradingViewWidget({
        symbol,
        interval,
        theme,
        language,
        container: "tradingview-widget-container"
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
