
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ResultData = Array<{
  name: string;
  value: number;
  color: string;
}>;

type SignalResultsChartProps = {
  resultData: ResultData;
};

export function SignalResultsChart({ resultData }: SignalResultsChartProps) {
  const { t } = useLanguage();
  
  return (
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
  );
}
