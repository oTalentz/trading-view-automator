
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from 'lucide-react';

type TimeframeData = Array<{
  timeframe: string;
  count: number;
}>;

type TimeframeBarChartProps = {
  timeframeData: TimeframeData;
};

export function TimeframeBarChart({ timeframeData }: TimeframeBarChartProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Gerar cores para cada timeframe
  const COLORS = [
    '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', 
    '#a4de6c', '#d0ed57', '#ffc658', '#ff8042'
  ];
  
  // Ordenar timeframes numericamente para visualização mais lógica
  const sortedData = [...timeframeData].sort((a, b) => {
    const aNum = parseInt(a.timeframe);
    const bNum = parseInt(b.timeframe);
    
    // Caso especial para timeframes não numéricos como 'D' ou 'W'
    if (isNaN(aNum) && isNaN(bNum)) return a.timeframe.localeCompare(b.timeframe);
    if (isNaN(aNum)) return 1;
    if (isNaN(bNum)) return -1;
    
    return aNum - bNum;
  });
  
  // Dados para gráfico de pizza
  const pieData = sortedData.map((item, index) => ({
    name: `${item.timeframe} ${t("minute")}`,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));
  
  // Função para formatar o label do timeframe
  const formatTimeframeLabel = (value: string) => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      if (value === 'D') return t("day");
      if (value === 'W') return t("week");
      return value;
    }
    
    if (numValue === 60) return '1h';
    if (numValue === 240) return '4h';
    return `${value}m`;
  };
  
  // Calcular total de sinais
  const totalSignals = sortedData.reduce((total, item) => total + item.count, 0);
  
  if (timeframeData.length === 0 || totalSignals === 0) {
    return (
      <Card className="col-span-1 h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground text-center">{t("noTimeframeDataAvailable")}</p>
        </CardContent>
      </Card>
    );
  }
  
  // Encontrar o timeframe mais comum
  const mostUsedTimeframe = sortedData.reduce(
    (most, current) => most.count > current.count ? most : current,
    { timeframe: '', count: 0 }
  );
  
  return (
    <Card className="col-span-1 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t("signalsByTimeframe")}
        </CardTitle>
        <CardDescription>{t("distributionByDuration")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Tabs defaultValue="bar" className="h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="bar">{t("barChart")}</TabsTrigger>
            <TabsTrigger value="pie">{t("pieChart")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="flex-1">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sortedData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                  barSize={35}
                >
                  <XAxis 
                    dataKey="timeframe" 
                    tickFormatter={formatTimeframeLabel}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} ${t("signals")}`, t("count")]}
                    labelFormatter={(value) => `${formatTimeframeLabel(value)} ${t("timeframe")}`}
                    cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    name={t("signals")} 
                    radius={[4, 4, 0, 0]}
                  >
                    {sortedData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        opacity={entry.timeframe === mostUsedTimeframe.timeframe ? 1 : 0.7}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="pie" className="flex-1">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom"
                    layout="horizontal"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} ${t("signals")}`, t("count")]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 p-3 border rounded-md bg-muted/10">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("mostUsedTimeframe")}:</span>
            <span className="font-medium">
              {formatTimeframeLabel(mostUsedTimeframe.timeframe)} 
              ({Math.round((mostUsedTimeframe.count / totalSignals) * 100)}%)
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">{t("totalTimeframes")}:</span>
            <span className="font-medium">{sortedData.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
