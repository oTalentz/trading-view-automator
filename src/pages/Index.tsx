import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Settings } from "lucide-react";

const symbols = [
  // Criptomoedas
  { value: "BINANCE:BTCUSDT", label: "Bitcoin (BTCUSDT)" },
  { value: "BINANCE:ETHUSDT", label: "Ethereum (ETHUSDT)" },
  { value: "BINANCE:SOLUSDT", label: "Solana (SOLUSDT)" },
  { value: "BINANCE:BNBUSDT", label: "Binance Coin (BNBUSDT)" },
  { value: "BINANCE:ADAUSDT", label: "Cardano (ADAUSDT)" },
  { value: "BINANCE:DOGEUSDT", label: "Dogecoin (DOGEUSDT)" },
  
  // Pares de Moedas Forex - Major
  { value: "FX:EURUSD", label: "EUR/USD - Euro / Dólar" },
  { value: "FX:GBPUSD", label: "GBP/USD - Libra / Dólar" },
  { value: "FX:USDJPY", label: "USD/JPY - Dólar / Iene" },
  { value: "FX:AUDUSD", label: "AUD/USD - Dólar Australiano / Dólar" },
  { value: "FX:USDCAD", label: "USD/CAD - Dólar / Dólar Canadense" },
  { value: "FX:NZDUSD", label: "NZD/USD - Dólar Neo-Zelandês / Dólar" },
  { value: "FX:USDCHF", label: "USD/CHF - Dólar / Franco Suíço" },
  
  // Pares de Moedas Forex - Cross
  { value: "FX:EURGBP", label: "EUR/GBP - Euro / Libra" },
  { value: "FX:EURJPY", label: "EUR/JPY - Euro / Iene" },
  { value: "FX:GBPJPY", label: "GBP/JPY - Libra / Iene" },
  { value: "FX:CADJPY", label: "CAD/JPY - Dólar Canadense / Iene" },
  { value: "FX:AUDNZD", label: "AUD/NZD - Dólar Australiano / Dólar NZ" },
  { value: "FX:AUDCAD", label: "AUD/CAD - Dólar Australiano / Dólar Canadense" },
  { value: "FX:EURAUD", label: "EUR/AUD - Euro / Dólar Australiano" },
  { value: "FX:GBPCAD", label: "GBP/CAD - Libra / Dólar Canadense" },
  
  // Pares de Moedas Forex - Exóticos
  { value: "FX:USDBRL", label: "USD/BRL - Dólar / Real Brasileiro" },
  { value: "FX:EURBRL", label: "EUR/BRL - Euro / Real Brasileiro" },
  { value: "FX:USDMXN", label: "USD/MXN - Dólar / Peso Mexicano" },
  { value: "FX:USDZAR", label: "USD/ZAR - Dólar / Rand Sul-Africano" },
  { value: "FX:USDTRY", label: "USD/TRY - Dólar / Lira Turca" },
  { value: "FX:EURPLN", label: "EUR/PLN - Euro / Zloty Polonês" },
  
  // Ações
  { value: "NASDAQ:AAPL", label: "Apple (AAPL)" },
  { value: "NASDAQ:MSFT", label: "Microsoft (MSFT)" },
  { value: "NASDAQ:AMZN", label: "Amazon (AMZN)" },
  { value: "NASDAQ:GOOGL", label: "Google (GOOGL)" },
  { value: "NASDAQ:META", label: "Meta / Facebook (META)" },
  { value: "NYSE:TSLA", label: "Tesla (TSLA)" },
];

const timeframes = [
  { value: "1", label: "1 Minuto" },
  { value: "5", label: "5 Minutos" },
  { value: "15", label: "15 Minutos" },
  { value: "30", label: "30 Minutos" },
  { value: "60", label: "1 Hora" },
  { value: "240", label: "4 Horas" },
  { value: "D", label: "1 Dia" },
  { value: "W", label: "1 Semana" },
];

const IndexContent = () => {
  const [symbol, setSymbol] = useState("BINANCE:BTCUSDT");
  const [interval, setInterval] = useState("1");
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t("tradingViewAutomator")}</h1>
          <div className="flex gap-2">
            <Link to="/configuration">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t("configuration")}
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t("dashboard")}
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="w-full sm:w-auto flex-1">
                <Select
                  value={symbol}
                  onValueChange={setSymbol}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("selectSymbol")} />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-[300px] overflow-y-auto">
                      <div className="py-2 px-2 text-xs font-medium text-muted-foreground">Criptomoedas</div>
                      {symbols
                        .filter(s => s.value.includes('BINANCE:'))
                        .map((sym) => (
                          <SelectItem key={sym.value} value={sym.value}>
                            {sym.label}
                          </SelectItem>
                        ))
                      }
                      
                      <div className="py-2 px-2 text-xs font-medium text-muted-foreground">Forex - Major</div>
                      {symbols
                        .filter(s => s.value.includes('FX:') && 
                          ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'USDCHF'].some(
                            pair => s.value.includes(pair)
                          )
                        )
                        .map((sym) => (
                          <SelectItem key={sym.value} value={sym.value}>
                            {sym.label}
                          </SelectItem>
                        ))
                      }
                      
                      <div className="py-2 px-2 text-xs font-medium text-muted-foreground">Forex - Cross</div>
                      {symbols
                        .filter(s => s.value.includes('FX:') && 
                          ['EURGBP', 'EURJPY', 'GBPJPY', 'CADJPY', 'AUDNZD', 'AUDCAD', 'EURAUD', 'GBPCAD'].some(
                            pair => s.value.includes(pair)
                          )
                        )
                        .map((sym) => (
                          <SelectItem key={sym.value} value={sym.value}>
                            {sym.label}
                          </SelectItem>
                        ))
                      }
                      
                      <div className="py-2 px-2 text-xs font-medium text-muted-foreground">Forex - Exóticos</div>
                      {symbols
                        .filter(s => s.value.includes('FX:') && 
                          ['USDBRL', 'EURBRL', 'USDMXN', 'USDZAR', 'USDTRY', 'EURPLN'].some(
                            pair => s.value.includes(pair)
                          )
                        )
                        .map((sym) => (
                          <SelectItem key={sym.value} value={sym.value}>
                            {sym.label}
                          </SelectItem>
                        ))
                      }
                      
                      <div className="py-2 px-2 text-xs font-medium text-muted-foreground">Ações</div>
                      {symbols
                        .filter(s => s.value.includes('NASDAQ:') || s.value.includes('NYSE:'))
                        .map((sym) => (
                          <SelectItem key={sym.value} value={sym.value}>
                            {sym.label}
                          </SelectItem>
                        ))
                      }
                    </div>
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
        </div>
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
