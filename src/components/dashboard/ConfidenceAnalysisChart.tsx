
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ConfidenceData = Array<{
  label: string;
  winRate: number;
  count: number;
}>;

type ConfidenceAnalysisChartProps = {
  confidenceData: ConfidenceData;
};

export function ConfidenceAnalysisChart({ confidenceData }: ConfidenceAnalysisChartProps) {
  const { t } = useLanguage();
  
  return (
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
  );
}
