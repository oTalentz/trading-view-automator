
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  BarChart as ReChartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface CandleAnalysisProps {
  candleAccuracyChartData: Array<{
    strategy: string;
    accuracy: number;
    samples: number;
    timeframes: Array<{
      timeframe: string;
      accuracy: number;
      samples: number;
    }>;
  }>;
}

export function CandleAnalysis({ candleAccuracyChartData }: CandleAnalysisProps) {
  const { t } = useLanguage();
  
  return (
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
  );
}
