
import { Theme } from '@/context/ThemeContext';

export interface TradingViewConfig {
  symbol: string;
  interval: string;
  theme: Theme;
  language: string;
  container: string;
}

export function initTradingViewWidget(config: TradingViewConfig): void {
  if (!window.TradingView) return;

  const { symbol, interval, theme, language, container } = config;
  
  window.tvWidget = new window.TradingView.widget({
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
    container_id: container,
    hide_side_toolbar: false,
    studies: [
      // Indicadores mais avançados para melhor análise
      "MASimple@tv-basicstudies", // Média móvel simples
      "MAExp@tv-basicstudies",    // Média móvel exponencial
      "RSI@tv-basicstudies",      // Índice de Força Relativa
      "MACD@tv-basicstudies",     // MACD para tendências
      "AwesomeOscillator@tv-basicstudies", // Awesome Oscillator para força de tendência
      "PivotPointsStandard@tv-basicstudies", // Pontos de suporte e resistência
      "IchimokuCloud@tv-basicstudies", // Nuvem de Ichimoku
      "BB@tv-basicstudies",       // Bandas de Bollinger
      "VolumeProfile@tv-basicstudies" // Perfil de Volume
    ],
    drawings_access: { 
      type: 'rectangle',
      tools: { 
        rectangle: true,
        trend_line: true,
        fibonacci_retracement: true,
        horizontal_line: true,
        vertical_line: true
      }
    },
    saved_data: {
      // Configuração salva para destacar tendências e pontos de entrada/saída
      fibonacci_retracement: {
        levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
      }
    },
    overrides: {
      // Customizações para destacar melhor os sinais e tendências
      "mainSeriesProperties.candleStyle.upColor": "#22c55e",
      "mainSeriesProperties.candleStyle.downColor": "#ef4444",
      "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
      "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
      "mainSeriesProperties.candleStyle.borderUpColor": "#22c55e",
      "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
      "paneProperties.backgroundType": "solid",
      "paneProperties.background": theme === "dark" ? "#1e1e2d" : "#ffffff",
      "paneProperties.vertGridProperties.color": theme === "dark" ? "#2a2a3c" : "#f0f0f0",
      "paneProperties.horzGridProperties.color": theme === "dark" ? "#2a2a3c" : "#f0f0f0",
    }
  });
}
