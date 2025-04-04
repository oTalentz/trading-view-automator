
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type TimeSeriesData = Array<{
  date: string;
  totalSignals: number;
  wins: number;
  losses: number;
  draws?: number;
  pending?: number;
}>;

type PerformanceHistoryChartProps = {
  timeSeriesData: TimeSeriesData;
};

export function PerformanceHistoryChart({ timeSeriesData }: PerformanceHistoryChartProps) {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("signalPerformanceOverTime")}</CardTitle>
        <CardDescription>{t("trackingHistoricalPerformance")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
