
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  LabelList,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from 'lucide-react';

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
  const { theme } = useTheme();
  
  // Definir cores baseadas no tema
  const colors = {
    bars: {
      winRate: theme === 'dark' ? '#22c55e' : '#16a34a',
      count: theme === 'dark' ? '#8884d8' : '#6366f1',
    },
    scatter: [
      '#f97316', // laranja
      '#8b5cf6', // roxo
      '#ef4444', // vermelho
      '#22c55e'  // verde
    ],
    grid: theme === 'dark' ? '#333' : '#e5e7eb',
    tooltip: theme === 'dark' ? '#1f2937' : '#f9fafb',
  };
  
  // Transformar dados para formato de bolhas
  const bubbleData = confidenceData.map((item, index) => ({
    name: item.label,
    x: index + 1, // posição horizontal
    y: item.winRate, // posição vertical
    z: item.count, // tamanho da bolha
    winRate: item.winRate,
    count: item.count
  }));
  
  // Determinar qual nível de confiança tem melhor performance
  const getBestConfidenceLevel = () => {
    if (!confidenceData || confidenceData.length === 0) return null;
    
    return confidenceData.reduce((best, current) => {
      if (current.count >= 5 && current.winRate > best.winRate) {
        return current;
      }
      return best;
    }, { label: '', winRate: 0, count: 0 });
  };
  
  const bestConfidence = getBestConfidenceLevel();
  
  // Definir cores das barras baseadas na taxa de vitória
  const getBarColor = (winRate: number) => {
    if (winRate >= 70) return '#22c55e';
    if (winRate >= 60) return '#10b981';
    if (winRate >= 50) return '#f59e0b';
    return '#ef4444';
  };
  
  if (!confidenceData || confidenceData.length === 0) {
    return (
      <Card className="w-full h-[450px] flex items-center justify-center">
        <p className="text-muted-foreground">{t("noConfidenceDataAvailable")}</p>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t("winRateByConfidenceLevel")}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          {t("confidenceLevelPerformance")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bars" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="bars">{t("barChart")}</TabsTrigger>
            <TabsTrigger value="scatter">{t("bubbleChart")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bars" className="w-full">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={confidenceData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barGap={10}
                  barSize={32}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.2} />
                  <XAxis 
                    dataKey="label"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    domain={[0, 100]} 
                    tickFormatter={(value) => `${value}%`}
                    label={{ 
                      value: t("winRate"), 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    label={{ 
                      value: t("sampleSize"), 
                      angle: 90, 
                      position: 'insideRight',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'winRate' || name === t('winRate') ? `${value}%` : value, 
                      name === 'winRate' ? t('winRate') : t('count')
                    ]}
                    contentStyle={{ 
                      backgroundColor: colors.tooltip,
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar 
                    yAxisId="left"
                    dataKey="winRate" 
                    name={t("winRate")} 
                    radius={[4, 4, 0, 0]}
                  >
                    {confidenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.winRate)} />
                    ))}
                    <LabelList 
                      dataKey="winRate" 
                      position="top" 
                      formatter={(value: number) => `${value}%`}
                      style={{ fontSize: '11px' }}
                    />
                  </Bar>
                  <Bar 
                    yAxisId="right"
                    dataKey="count" 
                    name={t("sampleSize")} 
                    fill={colors.bars.count} 
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList 
                      dataKey="count" 
                      position="top" 
                      style={{ fontSize: '11px' }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {bestConfidence && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium mb-2">{t("bestPerformingConfidence")}</h3>
                <p className="text-muted-foreground mb-2">
                  {t("bestConfidenceExplanation")}
                </p>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="flex-1 p-3 border rounded-md bg-background">
                    <span className="text-sm text-muted-foreground block mb-1">{t("confidenceLevel")}</span>
                    <span className="text-xl font-semibold">{bestConfidence.label}</span>
                  </div>
                  <div className="flex-1 p-3 border rounded-md bg-background">
                    <span className="text-sm text-muted-foreground block mb-1">{t("winRate")}</span>
                    <span className={`text-xl font-semibold ${
                      bestConfidence.winRate >= 70 ? 'text-green-600 dark:text-green-400' :
                      bestConfidence.winRate >= 50 ? 'text-amber-600 dark:text-amber-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {bestConfidence.winRate}%
                    </span>
                  </div>
                  <div className="flex-1 p-3 border rounded-md bg-background">
                    <span className="text-sm text-muted-foreground block mb-1">{t("sampleSize")}</span>
                    <span className="text-xl font-semibold">{bestConfidence.count}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="scatter" className="w-full">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.2} />
                  <XAxis 
                    type="category" 
                    dataKey="name" 
                    name="Confidence" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Win Rate" 
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    label={{ 
                      value: t("winRate"), 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="z" 
                    range={[40, 160]} 
                    name="Sample Size" 
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name) => {
                      if (name === 'Win Rate' || name === t('winRate')) return `${value}%`;
                      if (name === 'Sample Size' || name === t('sampleSize')) return value;
                      return value;
                    }}
                    contentStyle={{ 
                      backgroundColor: colors.tooltip,
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Scatter 
                    name={t("confidenceAnalysis")} 
                    data={bubbleData} 
                    fill="#8884d8"
                  >
                    {bubbleData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.winRate)}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
