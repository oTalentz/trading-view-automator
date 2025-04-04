
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface BacktestFiltersProps {
  timeRange: '7d' | '30d' | 'all';
  setTimeRange: (value: '7d' | '30d' | 'all') => void;
  selectedStrategy: string;
  setSelectedStrategy: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  advancedFilters: {
    minConfidence: number;
    maxConfidence: number;
    direction: string;
    symbols: string[];
  };
  setAdvancedFilters: (value: any) => void;
  strategies: string[];
  symbols: string[];
  toggleSymbolFilter: (symbol: string) => void;
  signalCount: number;
}

export function BacktestFilters({
  timeRange,
  setTimeRange,
  selectedStrategy,
  setSelectedStrategy,
  dateRange,
  setDateRange,
  advancedFilters,
  setAdvancedFilters,
  strategies,
  symbols,
  toggleSymbolFilter,
  signalCount
}: BacktestFiltersProps) {
  const { t } = useLanguage();
  
  return (
    <Accordion type="single" collapsible className="mb-4" defaultValue="filters">
      <AccordionItem value="filters">
        <AccordionTrigger className="text-sm font-medium">
          {t("backtestFilters")} ({signalCount} {t("signals")})
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-1">
            <div>
              <label className="text-xs font-medium block mb-1">{t("timeRange")}</label>
              <Select value={timeRange} onValueChange={(value: '7d' | '30d' | 'all') => setTimeRange(value)}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">{t("last7Days")}</SelectItem>
                  <SelectItem value="30d">{t("last30Days")}</SelectItem>
                  <SelectItem value="all">{t("allTime")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs font-medium block mb-1">{t("strategy")}</label>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map(strategy => (
                    <SelectItem key={strategy} value={strategy}>
                      {strategy === 'all' ? t("allStrategies") : strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs font-medium block mb-1">{t("direction")}</label>
              <Select 
                value={advancedFilters.direction} 
                onValueChange={(value) => setAdvancedFilters({...advancedFilters, direction: value})}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("bothDirections")}</SelectItem>
                  <SelectItem value="call">{t("callOnly")}</SelectItem>
                  <SelectItem value="put">{t("putOnly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:col-span-2">
              <label className="text-xs font-medium block mb-1">{t("confidenceRange")}</label>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={advancedFilters.minConfidence}
                  onChange={(e) => setAdvancedFilters({
                    ...advancedFilters, 
                    minConfidence: parseInt(e.target.value)
                  })}
                  className="w-full"
                />
                <span className="text-xs font-mono w-8 text-right">
                  {advancedFilters.minConfidence}%
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={advancedFilters.maxConfidence}
                  onChange={(e) => setAdvancedFilters({
                    ...advancedFilters, 
                    maxConfidence: parseInt(e.target.value)
                  })}
                  className="w-full"
                />
                <span className="text-xs font-mono w-8 text-right">
                  {advancedFilters.maxConfidence}%
                </span>
              </div>
            </div>
            
            <div className="col-span-full">
              <label className="text-xs font-medium block mb-1">{t("customDateRange")}</label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            
            <div className="col-span-full">
              <label className="text-xs font-medium block mb-1">{t("symbols")}</label>
              <div className="flex flex-wrap gap-1">
                {symbols.map(symbol => (
                  <Button
                    key={symbol}
                    variant={advancedFilters.symbols.includes(symbol) ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => toggleSymbolFilter(symbol)}
                  >
                    {symbol.split(':')[1]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
