
// Define the Theme type locally instead of importing it
type Theme = "dark" | "light";

export interface TradingViewConfig {
  symbol: string;
  interval: string;
  theme: Theme;
  language: string;
  container: string;
  onChartReady?: () => void;
}

export function initTradingViewWidget(config: TradingViewConfig): void {
  if (!window.TradingView) return;

  const { symbol, interval, theme, language, container, onChartReady } = config;
  
  // Create the TradingView widget with all configuration in one place
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
      // Advanced indicators for better analysis
      "MASimple@tv-basicstudies", // Simple Moving Average
      "MAExp@tv-basicstudies",    // Exponential Moving Average
      "RSI@tv-basicstudies",      // Relative Strength Index
      "MACD@tv-basicstudies",     // MACD for trends
      "AwesomeOscillator@tv-basicstudies", // Awesome Oscillator for trend strength
      "PivotPointsStandard@tv-basicstudies", // Support and resistance points
      "IchimokuCloud@tv-basicstudies", // Ichimoku Cloud
      "BB@tv-basicstudies",       // Bollinger Bands
      "VolumeProfile@tv-basicstudies" // Volume Profile
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
      // Saved configuration to highlight trends and entry/exit points
      fibonacci_retracement: {
        levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
      }
    },
    overrides: {
      // Customizations to better highlight signals and trends
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
    },
    // THIS IS THE FIX: Add the onChartReady callback directly to the widget configuration
    // instead of trying to call it as a method on the widget instance later
    onChartReady: function() {
      console.log("TradingView chart is ready!");
      window.tvWidget._ready = true;
      window.tvWidget.chart = function() {
        return window.tvWidget.activeChart();
      };
      
      // Call the onChartReady callback if provided
      if (onChartReady) {
        setTimeout(() => {
          onChartReady();
        }, 1000); // Small delay to ensure chart is fully initialized
      }
    }
  });
}
