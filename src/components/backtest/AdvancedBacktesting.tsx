
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SignalHistoryEntry } from '@/utils/signalHistoryUtils';
import { 
  BarChart3, 
  PlayCircle, 
  Calendar, 
  Sliders, 
  LineChart,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  XCircle,
  History,
  Filter,
  Download
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBacktestResults } from '@/hooks/useBacktestResults';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { 
  LineChart as ReChartsLineChart, 
  Line, 
  BarChart as ReChartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Scatter,
  ScatterChart
} from 'recharts';
import { formatDate } from '@/utils/dateUtils';
import { StrategyPerformance } from './StrategyPerformance';
import { WinRateDistribution } from './WinRateDistribution';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { SummaryMetrics } from './SummaryMetrics';
import { ConfusionMatrix } from './ConfusionMatrix';

// Export main component
export function AdvancedBacktesting() {
  const { t } = useLanguage();
  const signals = getSignalHistory();
  const { runBacktest, backtestResults, isLoading } = useBacktestResults();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('all');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
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
    setDateRange({});
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
  
  // Calculate consecutive wins/losses streaks
  const calculateStreaks = () => {
    if (!strategyFilteredSignals.length) return { maxWinStreak: 0, maxLossStreak: 0, currentStreak: 0 };
    
    // Sort signals by timestamp
    const sortedSignals = [...strategyFilteredSignals].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let currentStreak = 0;
    let currentStreakType: 'WIN' | 'LOSS' | null = null;
    
    sortedSignals.forEach(signal => {
      if (signal.result === 'WIN') {
        currentWinStreak++;
        currentLossStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
        
        if (currentStreakType === 'WIN') {
          currentStreak++;
        } else {
          currentStreakType = 'WIN';
          currentStreak = 1;
        }
      } else if (signal.result === 'LOSS') {
        currentLossStreak++;
        currentWinStreak = 0;
        maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
        
        if (currentStreakType === 'LOSS') {
          currentStreak++;
        } else {
          currentStreakType = 'LOSS';
          currentStreak = 1;
        }
      }
    });
    
    return { 
      maxWinStreak, 
      maxLossStreak, 
      currentStreak,
      currentStreakType 
    };
  };
  
  const streaks = calculateStreaks();
  
  // Determine candle accuracy of strategies
  const determineCandleAccuracy = () => {
    const candleAccuracy: Record<string, { accurate: number, total: number, timeframes: Record<string, { accurate: number, total: number }> }> = {};
    
    // Group by strategy
    strategyFilteredSignals.forEach(signal => {
      if (!signal.result) return;
      
      const strategy = signal.strategy || 'Unknown';
      const timeframe = signal.timeframe || '1';
      
      if (!candleAccuracy[strategy]) {
        candleAccuracy[strategy] = { 
          accurate: 0, 
          total: 0,
          timeframes: {}
        };
      }
      
      if (!candleAccuracy[strategy].timeframes[timeframe]) {
        candleAccuracy[strategy].timeframes[timeframe] = {
          accurate: 0,
          total: 0
        };
      }
      
      candleAccuracy[strategy].total++;
      candleAccuracy[strategy].timeframes[timeframe].total++;
      
      if (signal.result === 'WIN') {
        candleAccuracy[strategy].accurate++;
        candleAccuracy[strategy].timeframes[timeframe].accurate++;
      }
    });
    
    return candleAccuracy;
  };
  
  const candleAccuracy = determineCandleAccuracy();
  
  // Prepare candle accuracy data for charts
  const candleAccuracyChartData = Object.entries(candleAccuracy).map(([strategy, data]) => {
    const accuracyPercent = data.total > 0 ? Math.round((data.accurate / data.total) * 100) : 0;
    
    // Calculate timeframe breakdown
    const timeframeData = Object.entries(data.timeframes).map(([timeframe, tfData]) => {
      const tfAccuracy = tfData.total > 0 ? Math.round((tfData.accurate / tfData.total) * 100) : 0;
      return {
        timeframe: `${timeframe}${timeframe === 'D' ? '' : 'm'}`,
        accuracy: tfAccuracy,
        samples: tfData.total
      };
    });
    
    return {
      strategy,
      accuracy: accuracyPercent,
      samples: data.total,
      timeframes: timeframeData
    };
  }).sort((a, b) => b.accuracy - a.accuracy);
  
  // Calculate wins by weekday
  const calculateWinsByDay = () => {
    const dayData: Record<number, { wins: number, losses: number, total: number }> = {
      0: { wins: 0, losses: 0, total: 0 }, // Sunday
      1: { wins: 0, losses: 0, total: 0 },
      2: { wins: 0, losses: 0, total: 0 },
      3: { wins: 0, losses: 0, total: 0 },
      4: { wins: 0, losses: 0, total: 0 },
      5: { wins: 0, losses: 0, total: 0 },
      6: { wins: 0, losses: 0, total: 0 }  // Saturday
    };
    
    strategyFilteredSignals.forEach(signal => {
      if (!signal.result) return;
      
      const date = new Date(signal.timestamp);
      const day = date.getDay();
      
      dayData[day].total++;
      
      if (signal.result === 'WIN') {
        dayData[day].wins++;
      } else if (signal.result === 'LOSS') {
        dayData[day].losses++;
      }
    });
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return Object.entries(dayData).map(([day, data]) => {
      const winRate = data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0;
      return {
        day: dayNames[parseInt(day)],
        winRate,
        wins: data.wins,
        losses: data.losses,
        total: data.total
      };
    });
  };
  
  const winsByDay = calculateWinsByDay();
  
  // Calculate wins by hour
  const calculateWinsByHour = () => {
    const hourData: Record<number, { wins: number, losses: number, total: number }> = {};
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourData[i] = { wins: 0, losses: 0, total: 0 };
    }
    
    strategyFilteredSignals.forEach(signal => {
      if (!signal.result) return;
      
      const date = new Date(signal.timestamp);
      const hour = date.getHours();
      
      hourData[hour].total++;
      
      if (signal.result === 'WIN') {
        hourData[hour].wins++;
      } else if (signal.result === 'LOSS') {
        hourData[hour].losses++;
      }
    });
    
    return Object.entries(hourData).map(([hour, data]) => {
      const winRate = data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0;
      return {
        hour: `${hour.padStart(2, '0')}:00`,
        winRate,
        wins: data.wins,
        losses: data.losses,
        total: data.total
      };
    });
  };
  
  const winsByHour = calculateWinsByHour();
  
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
          {/* Filters Section */}
          <Accordion type="single" collapsible className="mb-4" defaultValue="filters">
            <AccordionItem value="filters">
              <AccordionTrigger className="text-sm font-medium">
                {t("backtestFilters")} ({strategyFilteredSignals.length} {t("signals")})
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
          
          {!backtestResults ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Sliders className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("runBacktestToSeeResults")}</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {t("advancedBacktestInstructions")}
              </p>
            </div>
          ) : (
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">{t("summary")}</TabsTrigger>
                <TabsTrigger value="strategies">{t("strategies")}</TabsTrigger>
                <TabsTrigger value="timeAnalysis">{t("timeAnalysis")}</TabsTrigger>
                <TabsTrigger value="candleAnalysis">{t("candleAnalysis")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <SummaryMetrics 
                  backtestResults={backtestResults} 
                  signalCount={strategyFilteredSignals.length}
                  streaks={streaks}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <WinRateDistribution 
                    backtestResults={backtestResults} 
                    signals={strategyFilteredSignals}
                  />
                  
                  <ConfusionMatrix
                    signals={strategyFilteredSignals}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="strategies">
                <StrategyPerformance 
                  candleAccuracyData={candleAccuracyChartData}
                  backtestResults={backtestResults}
                />
              </TabsContent>
              
              <TabsContent value="timeAnalysis">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">{t("winRateByWeekday")}</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReChartsBarChart data={winsByDay}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="day" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip 
                            formatter={(value, name, props) => {
                              if (name === "winRate") return [`${value}%`, t("winRate")];
                              return [value, name];
                            }}
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background p-3 border shadow-sm rounded-md">
                                    <p className="font-medium">{label}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {t("winRate")}: <span className="font-mono">{data.winRate}%</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {t("wins")}: <span className="font-mono text-green-500">{data.wins}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {t("losses")}: <span className="font-mono text-red-500">{data.losses}</span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="winRate" 
                            name={t("winRate")} 
                            fill="#22c55e" 
                            radius={[4, 4, 0, 0]}
                          />
                        </ReChartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">{t("winRateByHour")}</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReChartsBarChart data={winsByHour}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="hour" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip
                            formatter={(value, name, props) => {
                              if (name === "winRate") return [`${value}%`, t("winRate")];
                              return [value, name];
                            }}
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background p-3 border shadow-sm rounded-md">
                                    <p className="font-medium">{label}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {t("winRate")}: <span className="font-mono">{data.winRate}%</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {t("wins")}: <span className="font-mono text-green-500">{data.wins}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {t("losses")}: <span className="font-mono text-red-500">{data.losses}</span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="winRate" 
                            name={t("winRate")} 
                            fill="#22c55e" 
                            radius={[4, 4, 0, 0]}
                          />
                        </ReChartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="candleAnalysis">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">{t("strategyCandleAccuracy")}</h3>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReChartsBarChart 
                          data={candleAccuracyChartData} 
                          layout="vertical"
                          margin={{ left: 120 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="strategy" type="category" width={120} />
                          <Tooltip 
                            formatter={(value, name, props) => {
                              if (name === "accuracy") return [`${value}%`, t("accuracy")];
                              return [value, name];
                            }}
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background p-3 border shadow-sm rounded-md">
                                    <p className="font-medium">{label}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {t("accuracy")}: <span className="font-mono">{data.accuracy}%</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {t("sampleSize")}: <span className="font-mono">{data.samples}</span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="accuracy" 
                            name={t("accuracy")} 
                            fill="#22c55e" 
                            radius={[0, 4, 4, 0]}
                          />
                        </ReChartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">{t("timeframeAccuracyBreakdown")}</h3>
                    <div className="space-y-6">
                      {candleAccuracyChartData.map(strategy => (
                        <div key={strategy.strategy} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">{strategy.strategy}</h4>
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <ReChartsBarChart data={strategy.timeframes}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="timeframe" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip 
                                  formatter={(value, name, props) => {
                                    if (name === "accuracy") return [`${value}%`, t("accuracy")];
                                    return [value, name];
                                  }}
                                  content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-background p-3 border shadow-sm rounded-md">
                                          <p className="font-medium">{label}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {t("accuracy")}: <span className="font-mono">{data.accuracy}%</span>
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {t("sampleSize")}: <span className="font-mono">{data.samples}</span>
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Bar 
                                  dataKey="accuracy" 
                                  name={t("accuracy")} 
                                  fill="#3b82f6" 
                                  radius={[4, 4, 0, 0]}
                                />
                                <Bar 
                                  dataKey="samples" 
                                  name={t("samples")} 
                                  fill="#cbd5e1"
                                  radius={[4, 4, 0, 0]}
                                  yAxisId="right"
                                  hide
                                />
                              </ReChartsBarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AdvancedBacktesting;
