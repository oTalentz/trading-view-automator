
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/context/LanguageContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowRightLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ComparisonData {
  time: string;
  [key: string]: number | string;
}

const AVAILABLE_ASSETS = [
  { value: "BTCUSDT", label: "Bitcoin" },
  { value: "ETHUSDT", label: "Ethereum" },
  { value: "EURUSD", label: "EUR/USD" },
  { value: "GBPUSD", label: "GBP/USD" },
  { value: "AAPL", label: "Apple" },
  { value: "TSLA", label: "Tesla" },
];

interface AssetComparisonProps {
  mainSymbol: string;
}

export function AssetComparison({ mainSymbol }: AssetComparisonProps) {
  const { t } = useLanguage();
  const [comparisonAsset, setComparisonAsset] = useState<string>("ETHUSDT");
  const [data, setData] = useState<ComparisonData[]>([]);
  const [correlation, setCorrelation] = useState<number>(0);
  
  // Extract the asset name from the full symbol (e.g., BINANCE:BTCUSDT -> BTCUSDT)
  const mainAsset = mainSymbol.split(':')[1] || mainSymbol;
  
  useEffect(() => {
    // Gerar dados simulados de comparação
    const generateComparisonData = () => {
      const comparisonData: ComparisonData[] = [];
      const points = 20;
      
      // Gerar tendência principal para o ativo principal
      const mainTrend = Math.random() > 0.5 ? 1 : -1;
      const mainStartPrice = 100;
      
      // Gerar correlação para o ativo de comparação (-1 a 1)
      const randomCorrelation = (Math.random() * 2 - 1) * 0.8;
      setCorrelation(randomCorrelation);
      
      for (let i = 0; i < points; i++) {
        const time = `${i}m`;
        
        // Preço do ativo principal
        const mainChange = (Math.random() * 2 - 1 + 0.1 * mainTrend) * 2;
        const mainPrice = mainStartPrice + mainChange * i;
        
        // Preço do ativo de comparação com base na correlação
        const secondaryChange = mainChange * randomCorrelation + (Math.random() * 2 - 1) * (1 - Math.abs(randomCorrelation));
        const secondaryPrice = mainStartPrice + secondaryChange * i;
        
        comparisonData.push({
          time,
          [mainAsset]: parseFloat(mainPrice.toFixed(2)),
          [comparisonAsset]: parseFloat(secondaryPrice.toFixed(2))
        });
      }
      
      setData(comparisonData);
    };
    
    generateComparisonData();
  }, [mainAsset, comparisonAsset]);
  
  const getCorrelationColor = () => {
    const absCorrelation = Math.abs(correlation);
    if (absCorrelation > 0.7) {
      return correlation > 0 ? "text-green-600" : "text-red-600";
    } else if (absCorrelation > 0.3) {
      return correlation > 0 ? "text-green-500" : "text-red-500";
    } else {
      return "text-gray-500";
    }
  };
  
  const getCorrelationDescription = () => {
    const absCorrelation = Math.abs(correlation);
    if (absCorrelation > 0.7) {
      return correlation > 0 ? t("strongPositive") : t("strongNegative");
    } else if (absCorrelation > 0.3) {
      return correlation > 0 ? t("moderatePositive") : t("moderateNegative");
    } else {
      return t("weakCorrelation");
    }
  };
  
  // Cores para os ativos
  const colors = {
    "BTCUSDT": "#f7931a",
    "ETHUSDT": "#627eea",
    "EURUSD": "#0052b4",
    "GBPUSD": "#012169",
    "AAPL": "#a2aaad",
    "TSLA": "#e31937",
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            {t("assetCorrelation")}
          </div>
          <Select value={comparisonAsset} onValueChange={setComparisonAsset}>
            <SelectTrigger className="w-[120px] h-7 text-xs">
              <SelectValue placeholder={t("selectAsset")} />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_ASSETS.filter(asset => asset.value !== mainAsset).map((asset) => (
                <SelectItem key={asset.value} value={asset.value}>
                  {asset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={mainAsset} 
                stroke={colors[mainAsset as keyof typeof colors] || "#8884d8"} 
                dot={false} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey={comparisonAsset} 
                stroke={colors[comparisonAsset as keyof typeof colors] || "#82ca9d"} 
                dot={false} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <div>
            <div className="text-xs font-medium">{t("correlation")}</div>
            <div className={`text-sm font-bold ${getCorrelationColor()}`}>
              {correlation.toFixed(2)}
            </div>
          </div>
          <div className="flex items-center">
            {correlation > 0 ? (
              <TrendingUp className={`h-4 w-4 mr-1 ${getCorrelationColor()}`} />
            ) : (
              <TrendingDown className={`h-4 w-4 mr-1 ${getCorrelationColor()}`} />
            )}
            <span className="text-xs">{getCorrelationDescription()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
