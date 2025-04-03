
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface TradingViewWidgetProps {
  symbol?: string;
  interval?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export function TradingViewWidget({ 
  symbol = "BINANCE:BTCUSDT", 
  interval = "1D" 
}: TradingViewWidgetProps) {
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
      new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: interval,
        timezone: "Etc/UTC",
        theme: theme,
        style: "1",
        locale: language === 'pt-br' ? 'br' : 'en',
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview-widget-container",
        hide_side_toolbar: false,
        studies: [
          "MASimple@tv-basicstudies", // Média móvel simples
          "RSI@tv-basicstudies",      // Índice de Força Relativa
          "MACD@tv-basicstudies",     // MACD para tendências
          "AwesomeOscillator@tv-basicstudies", // Awesome Oscillator para força de tendência
          "PivotPointsStandard@tv-basicstudies" // Pontos de suporte e resistência
        ],
        drawings_access: { 
          type: 'rectangle',
          tools: { 
            rectangle: true,
            trend_line: true,
            fibonacci_retracement: true 
          }
        },
        saved_data: {
          // Configuração salva para destacar tendências e pontos de entrada/saída
          fibonacci_retracement: {
            levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
          }
        }
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
