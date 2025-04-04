import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBacktestResults } from '@/hooks/useBacktestResults';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { toast } from 'sonner';
import { BarChart3, PlayCircle, Calendar, Filter, Download } from 'lucide-react';
import { DateRange } from "react-day-picker";
import { BacktestTabs } from './BacktestTabs';
import { BacktestFilters } from './BacktestFilters';
import { EmptyBacktestState } from './EmptyBacktestState';

// Export main component
export function AdvancedBacktesting() {
  const { t } = useLanguage();
  const signals = getSignalHistory();
  const { runBacktest, backtestResults, isLoading } = useBacktestResults();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('all');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [advancedFilters, setAdvancedFilters] = useState({
    minConfidence: 0,
    maxConfidence: 100,
    direction: 'all',
    symbols: [] as string[]
  });
  
  // Filter signals by time range
  const filteredSignals = signals.filter(signal => {
    // Skip signals without results
    if (!signal.result) return false;
    
    const signalDate = new Date(signal.timestamp);
    
    // Custom date range filter
    if (dateRange.from && signalDate < dateRange.from) return false;
    if (dateRange.to) {
      const endDate = new Date(dateRange.to);
      endDate.setDate(endDate.getDate() + 1); // Include the end date
      if (signalDate > endDate) return false;
    }
    
    // Predefined time range filter
    if (timeRange !== 'all') {
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - signalDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (timeRange === '7d' && daysDiff > 7) return false;
      if (timeRange === '30d' && daysDiff > 30) return false;
    }
    
    // Apply advanced filters
    if (signal.confidence < advancedFilters.minConfidence || 
        signal.confidence > advancedFilters.maxConfidence) {
      return false;
    }
    
    if (advancedFilters.direction !== 'all' && 
        signal.direction.toLowerCase() !== advancedFilters.direction) {
      return false;
    }
    
    if (advancedFilters.symbols.length > 0 && 
        !advancedFilters.symbols.includes(signal.symbol)) {
      return false;
    }
    
    return true;
  });
  
  // Further filter by strategy if needed
  const strategyFilteredSignals = selectedStrategy === 'all' 
    ? filteredSignals 
    : filteredSignals.filter(s => s.strategy === selectedStrategy);
  
  // Handle running backtest
  const handleRunBacktest = () => {
    if (strategyFilteredSignals.length === 0) {
      toast.error(t("noSignalsToBacktest"), {
        description: t("adjustFiltersOrGenerateMoreSignals")
      });
      return;
    }
    
    runBacktest(strategyFilteredSignals);
    
    toast.success(t("backtestStarted"), {
      description: t("analyzing") + ` ${strategyFilteredSignals.length} ` + t("signals")
    });
  };
  
  // Extract unique strategies from signals
  const strategies = ['all', ...Array.from(new Set(signals.map(s => s.strategy || 'Unknown')))];
  
  // Extract unique symbols from signals
  const symbols = Array.from(new Set(signals.map(s => s.symbol)));
  
  // Toggle symbol filter
  const toggleSymbolFilter = (symbol: string) => {
    setAdvancedFilters(prev => {
      if (prev.symbols.includes(symbol)) {
        return { ...prev, symbols: prev.symbols.filter(s => s !== symbol) };
      } else {
        return { ...prev, symbols: [...prev.symbols, symbol] };
      }
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setTimeRange('all');
    setSelectedStrategy('all');
    setDateRange({ from: undefined, to: undefined }); // Fixed: use proper DateRange type
    setAdvancedFilters({
      minConfidence: 0,
      maxConfidence: 100,
      direction: 'all',
      symbols: []
    });
    
    toast.info(t("filtersReset"), {
      description: t("allFiltersHaveBeenReset")
    });
  };
  
  // Function to export results
  const exportResults = () => {
    if (!backtestResults) {
      toast.error(t("noResultsToExport"));
      return;
    }
    
    const results = {
      backtestResults,
      signals: strategyFilteredSignals,
      filters: {
        timeRange,
        selectedStrategy,
        dateRange,
        advancedFilters
      },
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtest-results-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(t("resultsExported"), {
      description: t("backtestResultsExportedSuccessfully")
    });
  };
  
  // Calculate streaks has been moved to BacktestUtils.ts
  
  if (signals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("advancedBacktesting")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">{t("noSignalsYet")}</h3>
          <p className="text-muted-foreground text-center max-w-md mx-auto">
            {t("startGeneratingSignalsForBacktesting")}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("advancedBacktesting")}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-1" />
              {t("resetFilters")}
            </Button>
            
            {backtestResults && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportResults}
                className="h-8"
              >
                <Download className="h-4 w-4 mr-1" />
                {t("exportResults")}
              </Button>
            )}
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleRunBacktest} 
              disabled={isLoading || filteredSignals.length === 0}
              className="h-8"
            >
              <PlayCircle className="h-4 w-4 mr-1" />
              {t("runBacktest")}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <BacktestFilters
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            selectedStrategy={selectedStrategy}
            setSelectedStrategy={setSelectedStrategy}
            dateRange={dateRange}
            setDateRange={setDateRange}
            advancedFilters={advancedFilters}
            setAdvancedFilters={setAdvancedFilters}
            strategies={strategies}
            symbols={symbols}
            toggleSymbolFilter={toggleSymbolFilter}
            signalCount={strategyFilteredSignals.length}
          />
          
          {!backtestResults ? (
            <EmptyBacktestState />
          ) : (
            <BacktestTabs 
              backtestResults={backtestResults}
              signals={strategyFilteredSignals}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AdvancedBacktesting;
