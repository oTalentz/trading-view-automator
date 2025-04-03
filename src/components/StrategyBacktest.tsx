
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import { useBacktestResults } from '@/hooks/useBacktestResults';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { BarChart3, PlayCircle, Calendar, Sliders } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function StrategyBacktest() {
  const { t } = useLanguage();
  const signals = getSignalHistory();
  const { runBacktest, backtestResults, isLoading } = useBacktestResults();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('all');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  
  // Filter signals by time range
  const filteredSignals = signals.filter(signal => {
    if (timeRange === 'all') return true;
    
    const signalDate = new Date(signal.timestamp);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - signalDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (timeRange === '7d') return daysDiff <= 7;
    if (timeRange === '30d') return daysDiff <= 30;
    
    return true;
  });
  
  // Further filter by strategy if needed
  const strategyFilteredSignals = selectedStrategy === 'all' 
    ? filteredSignals 
    : filteredSignals.filter(s => (s as any).strategy === selectedStrategy);
  
  const handleRunBacktest = () => {
    runBacktest(strategyFilteredSignals);
  };
  
  // Extract unique strategies from signals
  const strategies = ['all', ...Array.from(new Set(signals.map(s => (s as any).strategy || 'Unknown')))];
  
  // Generate monthly performance data
  const getMonthlyPerformanceData = () => {
    const months: Record<string, { month: string, wins: number, losses: number, winRate: number }> = {};
    
    filteredSignals.forEach(signal => {
      if (!signal.result) return;
      
      const date = new Date(signal.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      if (!months[monthKey]) {
        months[monthKey] = { month: monthName, wins: 0, losses: 0, winRate: 0 };
      }
      
      if (signal.result === 'WIN') {
        months[monthKey].wins += 1;
      } else if (signal.result === 'LOSS') {
        months[monthKey].losses += 1;
      }
      
      const total = months[monthKey].wins + months[monthKey].losses;
      months[monthKey].winRate = total > 0 ? Math.round((months[monthKey].wins / total) * 100) : 0;
    });
    
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  };
  
  // Convert to array sorted by date
  const monthlyPerformance = getMonthlyPerformanceData();
  
  if (signals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("strategyBacktesting")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">{t("noSignalsYet")}</h3>
          <p className="text-muted-foreground text-center max-w-md mx-auto">
            {t("startGeneratingSignals")}
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
            {t("strategyBacktesting")}
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value: '7d' | '30d' | 'all') => setTimeRange(value)}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder={t("timeRange")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">{t("last7Days")}</SelectItem>
                <SelectItem value="30d">{t("last30Days")}</SelectItem>
                <SelectItem value="all">{t("allTime")}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
              <SelectTrigger className="w-[150px] h-8 text-xs">
                <SelectValue placeholder={t("strategy")} />
              </SelectTrigger>
              <SelectContent>
                {strategies.map(strategy => (
                  <SelectItem key={strategy} value={strategy}>
                    {strategy === 'all' ? t("allStrategies") : strategy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="secondary" 
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
        {!backtestResults ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Sliders className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t("runBacktestToSeeResults")}</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {t("backtestInstructions")}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="performance">
            <TabsList className="mb-4">
              <TabsTrigger value="performance">{t("performance")}</TabsTrigger>
              <TabsTrigger value="by-confidence">{t("byConfidence")}</TabsTrigger>
              <TabsTrigger value="monthly">{t("monthlyResults")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">{t("winRate")}</div>
                  <div className="text-3xl font-bold">
                    {backtestResults.winRate}%
                  </div>
                  <Progress 
                    value={backtestResults.winRate} 
                    className="h-2"
                    indicatorClassName={
                      backtestResults.winRate > 65 ? "bg-green-500" : 
                      backtestResults.winRate > 50 ? "bg-amber-500" : 
                      "bg-red-500"
                    }
                  />
                </div>
                
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">{t("profitFactor")}</div>
                  <div className="text-3xl font-bold">
                    {backtestResults.profitFactor.toFixed(2)}
                  </div>
                  <Progress 
                    value={Math.min(backtestResults.profitFactor * 25, 100)} 
                    className="h-2"
                    indicatorClassName={
                      backtestResults.profitFactor > 1.5 ? "bg-green-500" : 
                      backtestResults.profitFactor > 1 ? "bg-amber-500" : 
                      "bg-red-500"
                    }
                  />
                </div>
                
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">{t("maxDrawdown")}</div>
                  <div className="text-3xl font-bold">
                    {backtestResults.maxDrawdown}%
                  </div>
                  <Progress 
                    value={Math.min(backtestResults.maxDrawdown, 100)} 
                    className="h-2"
                    indicatorClassName={
                      backtestResults.maxDrawdown < 10 ? "bg-green-500" : 
                      backtestResults.maxDrawdown < 20 ? "bg-amber-500" : 
                      "bg-red-500"
                    }
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">{t("winRateByTimeframe")}</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(backtestResults.winRateByTimeframe).map(([tf, rate]) => ({ 
                        timeframe: tf, 
                        winRate: rate 
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="timeframe" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, t("winRate")]} />
                        <Bar 
                          dataKey="winRate" 
                          name={t("winRate")} 
                          fill="#22c55e" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">{t("winRateBySymbol")}</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(backtestResults.winRateBySymbol).map(([symbol, rate]) => ({ 
                        symbol: symbol.split(':').pop(), 
                        winRate: rate 
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="symbol" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, t("winRate")]} />
                        <Bar 
                          dataKey="winRate" 
                          name={t("winRate")} 
                          fill="#8884d8" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="by-confidence">
              <h3 className="text-sm font-medium mb-4">{t("winRateByConfidenceLevel")}</h3>
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { level: t("lowConfidence"), winRate: backtestResults.winRateByConfidence.low },
                    { level: t("mediumConfidence"), winRate: backtestResults.winRateByConfidence.medium },
                    { level: t("highConfidence"), winRate: backtestResults.winRateByConfidence.high }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="level" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, t("winRate")]} />
                    <Bar 
                      dataKey="winRate" 
                      name={t("winRate")} 
                      fill="#22c55e" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium mb-2">{t("optimalConfidenceThreshold")}</div>
                  <div className="text-muted-foreground text-sm">
                    {backtestResults.winRateByConfidence.high > backtestResults.winRateByConfidence.medium && 
                     backtestResults.winRateByConfidence.high > backtestResults.winRateByConfidence.low ? (
                      <p>{t("highConfidenceRecommended")}</p>
                    ) : backtestResults.winRateByConfidence.medium > backtestResults.winRateByConfidence.low ? (
                      <p>{t("mediumConfidenceRecommended")}</p>
                    ) : (
                      <p>{t("lowConfidenceRecommended")}</p>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium mb-2">{t("expectancy")}</div>
                  <div className="text-xl font-medium">
                    {backtestResults.expectancy.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {backtestResults.expectancy > 0 ? 
                      t("positiveExpectancyExplanation") : 
                      t("negativeExpectancyExplanation")
                    }
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="monthly">
              <h3 className="text-sm font-medium mb-4">{t("monthlyPerformance")}</h3>
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, t("winRate")]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="winRate" 
                      name={t("winRate")}
                      stroke="#22c55e" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">{t("month")}</th>
                      <th className="text-center p-3 text-sm font-medium">{t("wins")}</th>
                      <th className="text-center p-3 text-sm font-medium">{t("losses")}</th>
                      <th className="text-right p-3 text-sm font-medium">{t("winRate")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyPerformance.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3 text-sm">{item.month}</td>
                        <td className="p-3 text-sm text-center">{item.wins}</td>
                        <td className="p-3 text-sm text-center">{item.losses}</td>
                        <td className={`p-3 text-sm text-right font-medium ${
                          item.winRate > 65 ? "text-green-600" : 
                          item.winRate > 50 ? "text-amber-600" : 
                          "text-red-600"
                        }`}>
                          {item.winRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
