
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart as RechartsLineChart, Line, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, TrendingDown, TrendingUp, Clock, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function DashboardSummary() {
  const { t } = useLanguage();
  const signals = getSignalHistory();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('all');
  
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
  
  // Calculate performance metrics
  const totalSignals = filteredSignals.length;
  const completedSignals = filteredSignals.filter(s => s.result !== null && s.result !== undefined);
  const winningSignals = filteredSignals.filter(s => s.result === 'WIN');
  const losingSignals = filteredSignals.filter(s => s.result === 'LOSS');
  const drawSignals = filteredSignals.filter(s => s.result === 'DRAW');
  const pendingSignals = filteredSignals.filter(s => s.result === null || s.result === undefined);
  
  const winRate = completedSignals.length > 0 
    ? Math.round((winningSignals.length / completedSignals.length) * 100) 
    : 0;
  
  // Data for direction distribution
  const directionData = [
    { name: t("callSignals"), value: filteredSignals.filter(s => s.direction === 'CALL').length },
    { name: t("putSignals"), value: filteredSignals.filter(s => s.direction === 'PUT').length },
  ];
  
  // Data for result distribution
  const resultData = [
    { name: t("wins"), value: winningSignals.length, color: '#22c55e' },
    { name: t("losses"), value: losingSignals.length, color: '#ef4444' },
    { name: t("draws"), value: drawSignals.length, color: '#94a3b8' },
    { name: t("pending"), value: pendingSignals.length, color: '#f59e0b' },
  ];
  
  // Data for timeframe distribution
  const timeframeData = Object.entries(
    filteredSignals.reduce((acc: Record<string, number>, signal) => {
      acc[signal.timeframe] = (acc[signal.timeframe] || 0) + 1;
      return acc;
    }, {})
  )
  .map(([timeframe, count]) => ({ timeframe, count }))
  .sort((a, b) => {
    // Sort by numeric value (1, 5, 15, etc.)
    const numA = parseInt(a.timeframe);
    const numB = parseInt(b.timeframe);
    return numA - numB;
  });
  
  // Generate time series data for performance tracking
  const getTimeSeriesData = () => {
    // Group signals by day
    const signalsByDay: Record<string, any> = {};
    
    filteredSignals.forEach(signal => {
      const date = new Date(signal.timestamp);
      const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD format
      
      if (!signalsByDay[dateStr]) {
        signalsByDay[dateStr] = {
          date: dateStr,
          totalSignals: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          pending: 0
        };
      }
      
      signalsByDay[dateStr].totalSignals += 1;
      
      if (signal.result === 'WIN') {
        signalsByDay[dateStr].wins += 1;
      } else if (signal.result === 'LOSS') {
        signalsByDay[dateStr].losses += 1;
      } else if (signal.result === 'DRAW') {
        signalsByDay[dateStr].draws += 1;
      } else {
        signalsByDay[dateStr].pending += 1;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(signalsByDay).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };
  
  // Data for performance tracking
  const timeSeriesData = getTimeSeriesData();
  
  // Calculate win rate by confidence level
  const getWinRateByConfidence = () => {
    // Define confidence levels
    const levels = [
      { min: 0, max: 70, label: '<70%' },
      { min: 70, max: 80, label: '70-80%' },
      { min: 80, max: 90, label: '80-90%' },
      { min: 90, max: 100, label: '>90%' }
    ];
    
    // Calculate win rate for each level
    return levels.map(level => {
      const signalsInLevel = completedSignals.filter(
        s => s.confidence >= level.min && s.confidence < level.max
      );
      
      const winsInLevel = signalsInLevel.filter(s => s.result === 'WIN').length;
      const winRate = signalsInLevel.length > 0 
        ? Math.round((winsInLevel / signalsInLevel.length) * 100) 
        : 0;
      
      return {
        label: level.label,
        winRate: winRate,
        count: signalsInLevel.length
      };
    });
  };
  
  const confidenceData = getWinRateByConfidence();
  
  // If no signals, show empty state
  if (totalSignals === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{t("dashboardSummary")}</CardTitle>
          <CardDescription>{t("performanceMetrics")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">{t("noSignalsYet")}</h3>
          <p className="text-muted-foreground text-center max-w-md">
            {t("startGeneratingSignals")}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("performanceAnalytics")}</h2>
        <Select value={timeRange} onValueChange={(value: '7d' | '30d' | 'all') => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("selectTimeRange")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">{t("last7Days")}</SelectItem>
            <SelectItem value="30d">{t("last30Days")}</SelectItem>
            <SelectItem value="all">{t("allTime")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("totalSignals")}</CardDescription>
            <CardTitle className="text-3xl">{totalSignals}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {completedSignals.length} {t("completed")}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("winRate")}</CardDescription>
            <CardTitle className="text-3xl">{winRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {winningSignals.length} {t("wins")} / {completedSignals.length} {t("completed")}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("bestTimeframe")}</CardDescription>
            <CardTitle className="text-3xl">
              {timeframeData.length > 0 ? timeframeData[0].timeframe : '-'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {timeframeData.length > 0 ? `${timeframeData[0].count} ${t("signals")}` : t("noData")}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("direction")}</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {filteredSignals.filter(s => s.direction === 'CALL').length > filteredSignals.filter(s => s.direction === 'PUT').length ? (
                <>
                  <TrendingUp className="h-6 w-6 text-green-500" /> 
                  CALL
                </>
              ) : (
                <>
                  <TrendingDown className="h-6 w-6 text-red-500" /> 
                  PUT
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {Math.round((filteredSignals.filter(s => s.direction === 'CALL').length / totalSignals) * 100)}% CALL / 
              {Math.round((filteredSignals.filter(s => s.direction === 'PUT').length / totalSignals) * 100)}% PUT
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="performance">{t("performanceHistory")}</TabsTrigger>
          <TabsTrigger value="confidence">{t("confidenceAnalysis")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("signalResults")}</CardTitle>
                <CardDescription>{t("distributionByOutcome")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resultData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={true}
                        label={({ name, percent }) => {
                          // Only show label if percent is significant (>5%)
                          return percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : '';
                        }}
                      >
                        {resultData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center" 
                        wrapperStyle={{ paddingTop: '20px' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value} ${t("signals")}`, 
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("signalsByTimeframe")}</CardTitle>
                <CardDescription>{t("distributionByDuration")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeframeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="timeframe" />
                      <YAxis />
                      <Tooltip labelFormatter={(value) => `${value} ${t("minute")}`} />
                      <Bar dataKey="count" name={t("signals")} fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>{t("signalPerformanceOverTime")}</CardTitle>
              <CardDescription>{t("trackingHistoricalPerformance")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalSignals"
                      name={t("totalSignals")}
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone" 
                      dataKey="wins"
                      name={t("wins")}
                      stroke="#22c55e"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone" 
                      dataKey="losses"
                      name={t("losses")}
                      stroke="#ef4444"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="confidence">
          <Card>
            <CardHeader>
              <CardTitle>{t("winRateByConfidenceLevel")}</CardTitle>
              <CardDescription>{t("confidenceLevelPerformance")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={confidenceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="label" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value}%`, 
                        name === 'winRate' ? t('winRate') : t('count')
                      ]}
                    />
                    <Legend />
                    <Bar 
                      dataKey="winRate" 
                      name={t("winRate")} 
                      fill="#22c55e" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="count" 
                      name={t("sampleSize")} 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> {t("upcomingEvents")}
          </CardTitle>
          <CardDescription>{t("marketEventsAndCalendar")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>{t("economicCalendarIntegration")}</p>
            <p className="text-sm">{t("comingSoon")}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
