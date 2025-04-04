
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  Pie, 
  PieChart, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  Sector
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  // Calcular total de sinais e porcentagem de vitórias
  const totalSignals = resultData.reduce((sum, item) => sum + item.value, 0);
  const wins = resultData.find(item => item.name === t("wins"))?.value || 0;
  const losses = resultData.find(item => item.name === t("losses"))?.value || 0;
  const completedSignals = wins + losses;
  const winRate = completedSignals > 0 ? Math.round((wins / completedSignals) * 100) : 0;
  
  // Configurações de renderização para o setor ativo do gráfico
  const renderActiveShape = (props: any) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;
    
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} className="text-base font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-xl font-bold">
          {value}
        </text>
        <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#999" className="text-xs">
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.2}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  // Determinar a cor da taxa de vitória
  const getWinRateColor = () => {
    if (winRate >= 70) return "bg-green-500";
    if (winRate >= 55) return "bg-emerald-500";
    if (winRate >= 45) return "bg-amber-500";
    return "bg-red-500";
  };
  
  if (totalSignals === 0) {
    return (
      <Card className="col-span-1 h-full flex items-center justify-center">
        <p className="text-muted-foreground">{t("noSignalDataAvailable")}</p>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-1 h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t("signalResults")}</CardTitle>
        <CardDescription>{t("distributionByOutcome")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={resultData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {resultData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke={theme === 'dark' ? "#1e1e2d" : "#ffffff"}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [
                  `${value} ${t("signals")}`, 
                  name
                ]}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center" 
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {completedSignals > 0 && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t("winRate")}:</span>
              <span className={`font-bold ${
                winRate >= 70 ? 'text-green-600 dark:text-green-400' :
                winRate >= 55 ? 'text-emerald-600 dark:text-emerald-400' :
                winRate >= 45 ? 'text-amber-600 dark:text-amber-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {winRate}%
              </span>
            </div>
            <Progress 
              value={winRate} 
              className="h-2"
              indicatorClassName={getWinRateColor()}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            
            <div className="mt-4 flex gap-2 justify-center text-sm">
              <span className="flex gap-1 items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                {t("wins")}: {wins}
              </span>
              <span className="flex gap-1 items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                {t("losses")}: {losses}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
