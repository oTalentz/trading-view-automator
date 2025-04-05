
import React from "react";
import { SymbolSelector } from "./SymbolSelector";
import { TimeframeSelector } from "./TimeframeSelector";

interface ChartControlsProps {
  symbol: string;
  setSymbol: (value: string) => void;
  interval: string;
  setInterval: (value: string) => void;
}

export function ChartControls({ 
  symbol, 
  setSymbol, 
  interval, 
  setInterval 
}: ChartControlsProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <SymbolSelector symbol={symbol} setSymbol={setSymbol} />
      <TimeframeSelector interval={interval} setInterval={setInterval} />
    </div>
  );
}
