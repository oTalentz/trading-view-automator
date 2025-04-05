
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
      <Card className={`hover:shadow-md transition-shadow transform perspective-[1000px] hover:rotate-y-2 ${className}`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
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
    <Card className={`hover:shadow-xl transition-all transform perspective-[1000px] hover:rotate-y-2 ${className}`}>
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary animate-pulse" />
          {t("mlStrategySelector")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{analysis.strategy}</h3>
          <Badge className="bg-primary/20 text-primary border-0 text-xs transform hover:scale-110 transition-transform shadow-md">
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
            className="h-1.5 shadow-inner"
            indicatorClassName={
              analysis.confidence > 80 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : 
              analysis.confidence > 65 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" : 
              "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
            }
          />
        </div>
        
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-muted-foreground text-xs">
            <Zap className="h-3 w-3 animate-pulse" />
            <span>{t("topIndicators")}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {analysis.indicators.slice(0, 3).map((indicator, index) => (
              <Badge 
                key={index}
                variant="outline"
                className="font-normal bg-muted/40 text-xs transform hover:scale-110 transition-transform shadow-sm"
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
