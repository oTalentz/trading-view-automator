
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the symbols data (moved from Index.tsx)
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

interface SymbolSelectorProps {
  symbol: string;
  setSymbol: (value: string) => void;
}

export function SymbolSelector({ symbol, setSymbol }: SymbolSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full sm:w-auto flex-1">
      <Select value={symbol} onValueChange={setSymbol}>
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
  );
}
