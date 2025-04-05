
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, TrendingDown, CandlestickChart } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { MLPrediction } from '@/context/AIAnalysisContext';

interface MLPredictionViewProps {
  prediction: MLPrediction | null;
  isLoading: boolean;
}

export function MLPredictionView({ prediction, isLoading }: MLPredictionViewProps) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="h-4 w-4" /> {t("machineLearningInsights")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (!prediction) return null;
  
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
            {prediction.direction === 'CALL' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium">{t("mlPrediction")}</span>
          </div>
          <div className={`font-bold ${prediction.direction === 'CALL' ? 'text-green-500' : 'text-red-500'}`}>
            {prediction.direction}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>{t("predictionConfidence")}</span>
            <span>{Math.round(prediction.probability)}%</span>
          </div>
          <Progress value={prediction.probability} className="h-1.5" />
        </div>
        
        {/* Padrões detectados */}
        <div>
          <h4 className="text-xs font-medium mb-2">{t("detectedPatterns")}</h4>
          <div className="space-y-2">
            {prediction.patterns.map((pattern, idx) => (
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
            {prediction.timeframes.map((tf, idx) => (
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
