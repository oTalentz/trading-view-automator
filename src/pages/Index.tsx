
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { WebhookSetup } from "@/components/WebhookSetup";
import { StrategyGuide } from "@/components/StrategyGuide";
import { SignalIndicator } from "@/components/SignalIndicator";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

const symbols = [
  // Cryptocurrencies
  { value: "BINANCE:BTCUSDT", label: "Bitcoin (BTCUSDT)" },
  { value: "BINANCE:ETHUSDT", label: "Ethereum (ETHUSDT)" },
  { value: "BINANCE:SOLUSDT", label: "Solana (SOLUSDT)" },
  
  // Forex Currency Pairs
  { value: "FX:EURUSD", label: "EUR/USD" },
  { value: "FX:GBPUSD", label: "GBP/USD" },
  { value: "FX:USDJPY", label: "USD/JPY" },
  { value: "FX:AUDUSD", label: "AUD/USD" },
  { value: "FX:USDCAD", label: "USD/CAD" },
  { value: "FX:NZDUSD", label: "NZD/USD" },
  { value: "FX:USDCHF", label: "USD/CHF" },
  { value: "FX:EURGBP", label: "EUR/GBP" },
  { value: "FX:EURJPY", label: "EUR/JPY" },
  { value: "FX:GBPJPY", label: "GBP/JPY" },
  
  // Stocks
  { value: "NASDAQ:AAPL", label: "Apple (AAPL)" },
  { value: "NASDAQ:MSFT", label: "Microsoft (MSFT)" },
  { value: "NASDAQ:AMZN", label: "Amazon (AMZN)" },
];

const timeframes = [
  { value: "1", label: "1 Minute" },
  { value: "5", label: "5 Minutes" },
  { value: "15", label: "15 Minutes" },
  { value: "30", label: "30 Minutes" },
  { value: "60", label: "1 Hour" },
  { value: "240", label: "4 Hours" },
  { value: "D", label: "1 Day" },
  { value: "W", label: "1 Week" },
];

const IndexContent = () => {
  const [symbol, setSymbol] = useState("BINANCE:BTCUSDT");
  const [interval, setInterval] = useState("1");  // Alterado para 1 minuto por padrão
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">{t("tradingViewAutomator")}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="w-full sm:w-auto flex-1">
                <Select
                  value={symbol}
                  onValueChange={setSymbol}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectSymbol")} />
                  </SelectTrigger>
                  <SelectContent>
                    {symbols.map((sym) => (
                      <SelectItem key={sym.value} value={sym.value}>
                        {sym.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-[180px]">
                <Select
                  value={interval}
                  onValueChange={setInterval}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectTimeframe")} />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map((tf) => (
                      <SelectItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TradingViewWidget symbol={symbol} interval={interval} />
          </div>
          
          <div className="space-y-6">
            <SignalIndicator symbol={symbol} interval={interval} />
            <WebhookSetup />
          </div>
        </div>
        
        <StrategyGuide />
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>{t("tradingViewAutomator")} - {t("tradingMadeSimple")}</p>
        </div>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <IndexContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
