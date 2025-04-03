
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/context/LanguageContext';
import { Brain, TrendingUp, TrendingDown, CandlestickChart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface MachineLearningInsightsProps {
  symbol: string;
  interval: string;
}

export function MachineLearningInsights({ symbol, interval }: MachineLearningInsightsProps) {
  const { t } = useLanguage();
  const [mlPrediction, setMlPrediction] = React.useState<{
    direction: 'CALL' | 'PUT';
    probability: number;
    patterns: { name: string; reliability: number }[];
    timeframes: { timeframe: string; prediction: 'CALL' | 'PUT'; confidence: number }[];
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
        },
        { 
          name: Math.random() > 0.5 ? 'RSI Divergence' : 'MACD Crossover', 
          reliability: 60 + Math.random() * 30 
        }
      ];
      
      const timeframes = [
        { timeframe: '1m', prediction: Math.random() > 0.5 ? 'CALL' : 'PUT', confidence: 60 + Math.random() * 30 },
        { timeframe: '5m', prediction: Math.random() > 0.5 ? 'CALL' : 'PUT', confidence: 60 + Math.random() * 30 },
        { timeframe: '15m', prediction: Math.random() > 0.5 ? 'CALL' : 'PUT', confidence: 60 + Math.random() * 30 }
      ];
      
      setMlPrediction({
        direction,
        probability,
        patterns,
        timeframes
      });
    };
    
    generatePrediction();
    const interval = setInterval(generatePrediction, 30000); // Atualizar a cada 30 segundos
    
    return () => clearInterval(interval);
  }, [symbol, interval]);
  
  if (!mlPrediction) return null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4" /> {t("machineLearningInsights")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Previsão principal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mlPrediction.direction === 'CALL' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium">{t("mlPrediction")}</span>
          </div>
          <div className={`font-bold ${mlPrediction.direction === 'CALL' ? 'text-green-500' : 'text-red-500'}`}>
            {mlPrediction.direction}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>{t("predictionConfidence")}</span>
            <span>{Math.round(mlPrediction.probability)}%</span>
          </div>
          <Progress value={mlPrediction.probability} className="h-1.5" />
        </div>
        
        {/* Padrões detectados */}
        <div>
          <h4 className="text-xs font-medium mb-2">{t("detectedPatterns")}</h4>
          <div className="space-y-2">
            {mlPrediction.patterns.map((pattern, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center">
                    <CandlestickChart className="h-3 w-3 mr-1" />
                    {pattern.name}
                  </span>
                  <span>{Math.round(pattern.reliability)}%</span>
                </div>
                <Progress 
                  value={pattern.reliability} 
                  className="h-1.5" 
                  indicatorClassName={pattern.reliability > 80 ? "bg-green-500" : pattern.reliability > 65 ? "bg-amber-500" : "bg-gray-500"}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Previsões por timeframe */}
        <div>
          <h4 className="text-xs font-medium mb-2">{t("predictionsAcrossTimeframes")}</h4>
          <div className="grid grid-cols-3 gap-2">
            {mlPrediction.timeframes.map((tf, idx) => (
              <div key={idx} className="rounded-md border p-2 text-center">
                <div className="text-xs font-medium">{tf.timeframe}</div>
                <div className={`text-sm font-bold ${tf.prediction === 'CALL' ? 'text-green-500' : 'text-red-500'}`}>
                  {tf.prediction}
                </div>
                <div className="text-xs text-muted-foreground">{Math.round(tf.confidence)}%</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
