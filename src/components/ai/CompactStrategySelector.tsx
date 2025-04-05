
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap } from 'lucide-react';
import { useMarketAnalysis } from '@/hooks/useMarketAnalysis';

interface CompactStrategySelectorProps {
  symbol: string;
  interval?: string;
  className?: string;
}

export function CompactStrategySelector({
  symbol,
  interval = "1",
  className = ""
}: CompactStrategySelectorProps) {
  const { analysis } = useMarketAnalysis(symbol, interval);
  const { t } = useLanguage();
  
  if (!analysis) {
    return (
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            {t("mlStrategySelector")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[100px] flex items-center justify-center text-muted-foreground text-sm">
            {t("analyzingMarket")}...
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          {t("recommendedStrategy")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{analysis.strategy}</h3>
          <Badge className="bg-primary/20 text-primary border-0 text-xs">
            {analysis.mlConfidenceScore || Math.round(analysis.confidence / 1.2)}%
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>{t("strategyConfidence")}</span>
            <span>{analysis.confidence}%</span>
          </div>
          <Progress 
            value={analysis.confidence} 
            className="h-1.5"
            indicatorClassName={
              analysis.confidence > 80 ? "bg-green-500" : 
              analysis.confidence > 65 ? "bg-amber-500" : 
              "bg-red-500"
            }
          />
        </div>
        
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-muted-foreground text-xs">
            <Zap className="h-3 w-3" />
            <span>{t("topIndicators")}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {analysis.indicators.slice(0, 3).map((indicator, index) => (
              <Badge 
                key={index}
                variant="outline"
                className="font-normal bg-muted/40 text-xs"
              >
                {indicator}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
