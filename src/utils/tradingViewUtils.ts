
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
  
  // Check if this is a Pocket Option OTC symbol
  const isPocketOptionOTC = symbol.includes("POCKETOPTION:") && symbol.includes("-OTC");

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
    height: "800",
    fullscreen: false,
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
      "VolumeProfile@tv-basicstudies", // Volume Profile
      "VWAP@tv-basicstudies",     // Volume Weighted Average Price
      "ZigZag@tv-basicstudies",   // ZigZag pattern detection
      "WilliamsR@tv-basicstudies" // Williams %R
    ],
    drawings_access: { 
      type: 'rectangle',
      tools: { 
        rectangle: true,
        trend_line: true,
        fibonacci_retracement: true,
        horizontal_line: true,
        vertical_line: true,
        pitchfork: true,
        elliott_wave: true,
        fibonacci_fan: true,
        fibonacci_arc: true,
        fibonacci_timezone: true,
        gann_fan: true
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
      "scalesProperties.lineColor": theme === "dark" ? "#2a2a3c" : "#f0f0f0",
      "scalesProperties.textColor": theme === "dark" ? "#fff" : "#333",
      
      // RSI settings
      "RSI.upper_line.color": "#f43f5e",
      "RSI.lower_line.color": "#0ea5e9",
      "RSI.middle.color": "#9ca3af",
      
      // Bollinger Bands settings
      "BB.upper.color": "#6366f1",
      "BB.lower.color": "#6366f1",
      "BB.background.color": theme === "dark" ? "#6366f112" : "#6366f108",
      
      // MACD settings
      "MACD.histogram.color": "#22c55e",
      "MACD.signal.color": "#ef4444",
      "MACD.macd.color": "#60a5fa",
      
      // Moving Averages
      "MA.color.0": "#f97316", // Orange
      "MA.color.1": "#8b5cf6", // Purple
      "MA.color.2": "#06b6d4", // Cyan
      "MA.color.3": "#eab308", // Yellow
      
      // OTC specific settings
      ...(isPocketOptionOTC ? {
        "mainSeriesProperties.priceAxisProperties.autoScale": true,
        "mainSeriesProperties.priceAxisProperties.percentage": false,
        "mainSeriesProperties.priceAxisProperties.log": false,
      } : {})
    },
    // Correct way to set the onChartReady callback
    onChartReady: function() {
      console.log("TradingView chart is ready!");
      // Set ready flag on widget
      if (window.tvWidget) {
        window.tvWidget._ready = true;
        
        // Add chart method for compatibility
        window.tvWidget.chart = function() {
          return window.tvWidget.activeChart();
        };
        
        // Call the onChartReady callback if provided
        if (onChartReady && typeof onChartReady === 'function') {
          setTimeout(() => {
            onChartReady();
          }, 1000); // Small delay to ensure chart is fully initialized
        }
      }
    }
  });
}
