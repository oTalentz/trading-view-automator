
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { useLanguage } from "@/context/LanguageContext";
import { PageHeader } from "./PageHeader";
import { ChartControls } from "./ChartControls";
import { Footer } from "./Footer";

export function IndexContent() {
  const [symbol, setSymbol] = useState("BINANCE:BTCUSDT");
  const [interval, setInterval] = useState("1");
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <PageHeader title={t("tradingViewAutomator")} />
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-4">
            <ChartControls 
              symbol={symbol} 
              setSymbol={setSymbol} 
              interval={interval} 
              setInterval={setInterval} 
            />
            
            <TradingViewWidget symbol={symbol} interval={interval} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
