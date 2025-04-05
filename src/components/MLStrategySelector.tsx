
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, List, Lightbulb } from 'lucide-react';
import { useMarketAnalysis } from '@/hooks/useMarketAnalysis';

interface MLStrategySelectorProps {
  symbol: string;
  interval?: string;
}

export function MLStrategySelector({
  symbol,
  interval = "1"
}: MLStrategySelectorProps) {
  const { analysis } = useMarketAnalysis(symbol, interval);
  const { t } = useLanguage();
  
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4" />
          {t("mlStrategySelector")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        {!analysis ? (
          <div className="h-[120px] flex items-center justify-center text-muted-foreground">
            {t("analyzingMarket")}...
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h3 className="font-medium">{analysis.strategy}</h3>
                <p className="text-xs text-muted-foreground">{t("aiSelectedStrategy")}</p>
              </div>
              <div className="ml-auto">
                <Badge className="px-2 py-1 bg-primary/20 text-primary border-0">
                  {analysis.mlConfidenceScore || Math.round(analysis.confidence / 1.2)}% {t("mlScore")}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs text-muted-foreground">{t("strategyConfidence")}</span>
                  <span className="text-xs font-medium">{analysis.confidence}%</span>
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
              
              <div className="mt-2">
                <div className="flex items-center gap-1.5 mb-1 text-muted-foreground text-xs">
                  <Zap className="h-3 w-3" />
                  <span>{t("indicators")}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
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
              
              {analysis.validationDetails?.reasons && (
                <div className="mt-2">
                  <div className="flex items-center gap-1.5 mb-1 text-muted-foreground text-xs">
                    <List className="h-3 w-3" />
                    <span>{t("selectionRationale")}</span>
                  </div>
                  <ul className="space-y-1 pl-4 list-disc text-xs">
                    {analysis.validationDetails.reasons.slice(0, 3).map((reason, index) => (
                      <li key={index} className="text-muted-foreground">
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
