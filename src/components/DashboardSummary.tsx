
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, TrendingDown, TrendingUp, Clock } from 'lucide-react';

export function DashboardSummary() {
  const { t } = useLanguage();
  const signals = getSignalHistory();
  
  // Calculate performance metrics
  const totalSignals = signals.length;
  const completedSignals = signals.filter(s => s.result !== null && s.result !== undefined);
  const winningSignals = signals.filter(s => s.result === 'WIN');
  const losingSignals = signals.filter(s => s.result === 'LOSS');
  const drawSignals = signals.filter(s => s.result === 'DRAW');
  const pendingSignals = signals.filter(s => s.result === null || s.result === undefined);
  
  const winRate = completedSignals.length > 0 
    ? Math.round((winningSignals.length / completedSignals.length) * 100) 
    : 0;
  
  // Data for direction distribution
  const directionData = [
    { name: t("callSignals"), value: signals.filter(s => s.direction === 'CALL').length },
    { name: t("putSignals"), value: signals.filter(s => s.direction === 'PUT').length },
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
    signals.reduce((acc: Record<string, number>, signal) => {
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
              {signals.filter(s => s.direction === 'CALL').length > signals.filter(s => s.direction === 'PUT').length ? (
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
              {Math.round((signals.filter(s => s.direction === 'CALL').length / totalSignals) * 100)}% CALL / 
              {Math.round((signals.filter(s => s.direction === 'PUT').length / totalSignals) * 100)}% PUT
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {resultData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
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
                <BarChart data={timeframeData}>
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
    </>
  );
}
