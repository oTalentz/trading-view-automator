
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, List, Lightbulb } from 'lucide-react';
import { useMarketAnalysis } from '@/hooks/useMarketAnalysis';
import { SentimentAnalysis } from './SentimentAnalysis';

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
  
  // Strategy might not have ML details
  const hasMLDetails = analysis?.strategy && analysis.validationDetails?.reasons?.length > 0;
  
  // Check for strategy selection reasons
  const selectionReasons = hasMLDetails ? 
    analysis?.validationDetails?.reasons.filter(reason => 
      !reason.includes('RSI') && !reason.includes('volume') && !reason.includes('MACD')
    ) : [];
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t("mlStrategySelector")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!analysis ? (
            <div className="h-[180px] flex items-center justify-center text-muted-foreground">
              {t("analyzingMarket")}...
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{analysis.strategy}</h3>
                  <p className="text-sm text-muted-foreground">{t("aiSelectedStrategy")}</p>
                </div>
                {hasMLDetails && (
                  <div className="ml-auto">
                    <Badge className="px-3 py-1 bg-primary/20 text-primary border-0">
                      {analysis.mlConfidenceScore || Math.round(analysis.confidence / 1.2)}% ML Score
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("strategyConfidence")}</span>
                    <span className="font-medium">{analysis.confidence}%</span>
                  </div>
                  <Progress 
                    value={analysis.confidence} 
                    className="h-2"
                    indicatorClassName={
                      analysis.confidence > 80 ? "bg-green-500" : 
                      analysis.confidence > 65 ? "bg-amber-500" : 
                      "bg-red-500"
                    }
                  />
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center gap-1.5 mb-2 text-muted-foreground text-sm">
                    <Zap className="h-4 w-4" />
                    <span>{t("indicators")}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.indicators.map((indicator, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="font-normal bg-muted/40"
                      >
                        {indicator}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectionReasons.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-1.5 mb-2 text-muted-foreground text-sm">
                      <List className="h-4 w-4" />
                      <span>{t("selectionRationale")}</span>
                    </div>
                    <ul className="space-y-1 pl-5 list-disc text-sm">
                      {selectionReasons.slice(0, 3).map((reason, index) => (
                        <li key={index} className="text-muted-foreground">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {analysis.alternativeStrategies && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">{t("alternativeStrategies")}</h4>
                    <div className="space-y-2">
                      {analysis.alternativeStrategies.map((altStrategy, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{altStrategy.name}</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                            {altStrategy.confidenceScore}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Componente de análise de sentimento */}
      <SentimentAnalysis symbol={symbol} />
    </div>
  );
}
