
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/context/LanguageContext';
import { Brain, TrendingUp, TrendingDown, CandlestickChart, ArrowRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CompactMLInsightsProps {
  symbol: string;
  interval: string;
}

export function CompactMLInsights({ symbol, interval }: CompactMLInsightsProps) {
  const { t } = useLanguage();
  const [mlPrediction, setMlPrediction] = React.useState<{
    direction: 'CALL' | 'PUT';
    probability: number;
    patterns: { name: string; reliability: number }[];
  } | null>(null);
  
  React.useEffect(() => {
    // Simulação de dados de previsão de ML
    const generatePrediction = () => {
      const probability = 65 + Math.random() * 25;
      const direction = probability > 75 ? 'CALL' : 'PUT';
      
      const patterns = [
        { 
          name: Math.random() > 0.5 ? 'Hammer' : 'Doji', 
          reliability: 60 + Math.random() * 30 
        },
        { 
          name: Math.random() > 0.5 ? 'Engulfing' : 'Morning Star', 
          reliability: 60 + Math.random() * 30 
        }
      ];
      
      setMlPrediction({
        direction,
        probability,
        patterns
      });
    };
    
    generatePrediction();
    const interval = setInterval(generatePrediction, 60000); // Atualizar a cada minuto
    
    return () => clearInterval(interval);
  }, [symbol, interval]);
  
  if (!mlPrediction) return null;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" /> {t("machineLearningInsights")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mlPrediction.direction === 'CALL' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium text-sm">{symbol}</span>
          </div>
          <Badge className={mlPrediction.direction === 'CALL' ? 'bg-green-500' : 'bg-red-500'}>
            {mlPrediction.direction}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>{t("confidence")}</span>
            <span>{Math.round(mlPrediction.probability)}%</span>
          </div>
          <Progress 
            value={mlPrediction.probability} 
            className="h-1.5" 
            indicatorClassName={mlPrediction.probability > 80 ? "bg-green-500" : mlPrediction.probability > 65 ? "bg-amber-500" : "bg-red-500"}
          />
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {mlPrediction.patterns.map((pattern, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {pattern.name}
            </Badge>
          ))}
        </div>
        
        <div className="text-right">
          <Link to="/dashboard">
            <Button variant="link" size="sm" className="text-xs p-0 h-auto">
              {t("viewAnalytics")} <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
