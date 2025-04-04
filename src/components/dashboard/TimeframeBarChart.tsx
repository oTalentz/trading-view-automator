
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type TimeframeData = Array<{
  timeframe: string;
  count: number;
}>;

type TimeframeBarChartProps = {
  timeframeData: TimeframeData;
};

export function TimeframeBarChart({ timeframeData }: TimeframeBarChartProps) {
  const { t } = useLanguage();
  
  return (
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
  );
}
