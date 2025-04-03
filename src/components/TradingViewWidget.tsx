
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useMarketAnalysis } from '@/hooks/useMarketAnalysis';

interface TradingViewWidgetProps {
  symbol?: string;
  interval?: string;
}

declare global {
  interface Window {
    TradingView: any;
    tvWidget: any;
  }
}

export function TradingViewWidget({ 
  symbol = "BINANCE:BTCUSDT", 
  interval = "1D" 
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { analysis, countdown } = useMarketAnalysis(symbol, interval);

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

  // Função para adicionar sinais e análises ao gráfico
  useEffect(() => {
    // Quando temos uma análise e o widget está pronto
    if (analysis && window.tvWidget && window.tvWidget._ready) {
      try {
        // Limpa desenhos anteriores
        window.tvWidget.activeChart().clearAllDrawingTools();
        
        // Determina cores com base na direção
        const signalColor = analysis.direction === 'CALL' ? "#22c55e" : "#ef4444";
        
        // Adiciona linha de suporte e resistência
        if (analysis.supportResistance) {
          // Linha de suporte
          window.tvWidget.activeChart().createShape(
            { price: analysis.supportResistance.support },
            { 
              shape: "horizontal_line", 
              lock: true,
              disableSelection: true,
              overrides: { 
                linecolor: "#22c55e",
                linestyle: 2, // linha tracejada
                linewidth: 1,
                showPriceLabel: true,
                text: language === 'pt-br' ? "Suporte" : "Support"
              }
            }
          );
          
          // Linha de resistência
          window.tvWidget.activeChart().createShape(
            { price: analysis.supportResistance.resistance },
            { 
              shape: "horizontal_line", 
              lock: true,
              disableSelection: true,
              overrides: { 
                linecolor: "#ef4444",
                linestyle: 2, // linha tracejada
                linewidth: 1,
                showPriceLabel: true,
                text: language === 'pt-br' ? "Resistência" : "Resistance"
              }
            }
          );
        }
        
        // Adiciona um indicador de direção preciso
        const signalText = analysis.direction === 'CALL' 
            ? `▲ ${language === 'pt-br' ? 'COMPRA' : 'BUY'} (${analysis.confidence}%)` 
            : `▼ ${language === 'pt-br' ? 'VENDA' : 'SELL'} (${analysis.confidence}%)`;
          
        // Descrição da estratégia
        const strategyText = analysis.strategy + (language === 'pt-br' ? ' - Entrada Precisa' : ' - Precise Entry');
        
        // Calcula o timestamp para a entrada
        const currentTime = window.tvWidget.activeChart().getVisibleRange().to - 5;
        const entryTime = currentTime + 10; // Tempo aproximado para entrada
        
        // Adiciona marca para o ponto de entrada
        window.tvWidget.activeChart().createMultipointShape(
          [
            { time: currentTime, price: 0 },
            { time: entryTime + 20, price: 0 }
          ],
          { 
            shape: "trend_line",
            text: signalText + "\n" + strategyText,
            textcolor: signalColor,
            linewidth: 2,
            linecolor: signalColor,
            linestyle: 2, // Linha tracejada para melhor visibilidade
            overrides: { 
              fontsize: 14,
              bold: true
            }
          }
        );
          
        // Adiciona também um marcador no ponto exato de entrada
        window.tvWidget.activeChart().createShape(
          { 
            time: entryTime,
            price: 0, 
            channel: analysis.direction === 'CALL' ? "low" : "high"  
          },
          { 
            shape: analysis.direction === 'CALL' ? "arrow_up" : "arrow_down",
            text: language === 'pt-br' ? "ENTRADA AGORA" : "ENTRY NOW",
            overrides: { 
              color: signalColor,
              fontsize: 12,
              bold: true
            }
          }
        );
        
        // Adiciona anotação com detalhes da análise técnica
        const technicalText = `${analysis.strategy}\n${
          language === 'pt-br' ? 'Confiança' : 'Confidence'
        }: ${analysis.confidence}%\n${
          language === 'pt-br' ? 'Força da Tendência' : 'Trend Strength'
        }: ${analysis.trendStrength}%`;
        
        window.tvWidget.activeChart().createShape(
          { 
            time: currentTime - 10,
            price: 0, 
            channel: "high"  
          },
          { 
            shape: "text",
            text: technicalText,
            overrides: { 
              color: theme === "dark" ? "#ffffff" : "#000000",
              fontsize: 12,
              bold: false
            }
          }
        );
          
      } catch (e) {
        console.error("Erro ao criar sinal no gráfico:", e);
      }
    }
  }, [analysis, language, theme]);

  const initWidget = () => {
    if (container.current && window.TradingView) {
      container.current.innerHTML = '';
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
        container_id: "tradingview-widget-container",
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
