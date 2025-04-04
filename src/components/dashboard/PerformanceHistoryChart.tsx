
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Area,
  AreaChart,
  ComposedChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimeSeriesData = Array<{
  date: string;
  totalSignals: number;
  wins: number;
  losses: number;
  draws?: number;
  pending?: number;
  winRate?: number;
}>;

type PerformanceHistoryChartProps = {
  timeSeriesData: TimeSeriesData;
};

export function PerformanceHistoryChart({ timeSeriesData }: PerformanceHistoryChartProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Calcular taxa de vitória para cada ponto de dados
  const dataWithWinRate = timeSeriesData.map(item => {
    const totalCompleted = item.wins + item.losses;
    const winRate = totalCompleted > 0 ? Math.round((item.wins / totalCompleted) * 100) : 0;
    return {
      ...item,
      winRate
    };
  });
  
  // Calcular média móvel da taxa de vitória (3 períodos)
  const dataWithMovingAverage = dataWithWinRate.map((item, index, arr) => {
    if (index < 2) return item;
    
    const movingAvgWinRate = Math.round(
      (arr[index].winRate + arr[index-1].winRate + arr[index-2].winRate) / 3
    );
    
    return {
      ...item,
      movingAvgWinRate
    };
  });
  
  // Cores para o tema
  const colors = {
    win: theme === 'dark' ? '#22c55e' : '#16a34a',
    loss: theme === 'dark' ? '#ef4444' : '#dc2626',
    total: theme === 'dark' ? '#8884d8' : '#6366f1',
    winRate: theme === 'dark' ? '#f59e0b' : '#d97706',
    movingAvg: theme === 'dark' ? '#06b6d4' : '#0891b2',
    grid: theme === 'dark' ? '#333' : '#e5e7eb',
    tooltip: theme === 'dark' ? '#1f2937' : '#f9fafb',
  };
  
  // Não renderizar se não houver dados
  if (!timeSeriesData || timeSeriesData.length < 2) {
    return (
      <Card className="w-full h-[450px] flex items-center justify-center">
        <p className="text-muted-foreground">{t("insufficientDataForChart")}</p>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("signalPerformanceOverTime")}</span>
        </CardTitle>
        <CardDescription>{t("trackingHistoricalPerformance")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signals" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="signals">{t("signals")}</TabsTrigger>
            <TabsTrigger value="winrate">{t("winRate")}</TabsTrigger>
            <TabsTrigger value="combined">{t("combined")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signals" className="w-full">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={dataWithWinRate} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorWin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.win} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={colors.win} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.loss} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={colors.loss} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      // Abreviar datas para formato mais curto
                      return value.split('-').slice(1).join('/');
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.tooltip,
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone" 
                    dataKey="wins"
                    name={t("wins")}
                    stroke={colors.win}
                    fillOpacity={1}
                    fill="url(#colorWin)"
                    activeDot={{ r: 8 }}
                  />
                  <Area
                    type="monotone" 
                    dataKey="losses"
                    name={t("losses")}
                    stroke={colors.loss}
                    fillOpacity={1}
                    fill="url(#colorLoss)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="winrate" className="w-full">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={dataWithMovingAverage}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      return value.split('-').slice(1).join('/');
                    }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, t("winRate")]}
                    contentStyle={{ 
                      backgroundColor: colors.tooltip,
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="winRate"
                    name={t("winRate")}
                    stroke={colors.winRate}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="movingAvgWinRate"
                    name={t("movingAverage")}
                    stroke={colors.movingAvg}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="combined" className="w-full">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dataWithMovingAverage}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      return value.split('-').slice(1).join('/');
                    }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left"
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.tooltip,
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => {
                      if (name === 'winRate' || name === t("winRate") || name === t("movingAverage")) {
                        return [`${value}%`, name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar 
                    yAxisId="left"
                    dataKey="totalSignals"
                    name={t("totalSignals")}
                    barSize={20}
                    fill={colors.total}
                    fillOpacity={0.6}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="winRate"
                    name={t("winRate")}
                    stroke={colors.winRate}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
