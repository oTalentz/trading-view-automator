
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Brain, Zap, List, Lightbulb, RefreshCw, Check } from 'lucide-react';
import { useMarketAnalysis } from '@/hooks/useMarketAnalysis';
import { toast } from "sonner";

interface MLStrategySelectorProps {
  symbol: string;
  interval?: string;
}

export function MLStrategySelector({
  symbol,
  interval = "1"
}: MLStrategySelectorProps) {
  const { analysis, refreshAnalysis, isLoading } = useMarketAnalysis(symbol, interval);
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Set up auto-refresh for strategy insights
  useEffect(() => {
    // Set initial last updated time
    if (analysis && !lastUpdated) {
      setLastUpdated(new Date());
    }
    
    // Auto-refresh every 2 minutes
    const refreshInterval = setInterval(() => {
      if (refreshAnalysis && !isLoading && !isRefreshing) {
        handleRefresh();
      }
    }, 120000); // 2 minutes
    
    return () => clearInterval(refreshInterval);
  }, [analysis, refreshAnalysis, isLoading, isRefreshing, lastUpdated]);
  
  const handleRefresh = () => {
    if (!refreshAnalysis || isLoading || isRefreshing) return;
    
    setIsRefreshing(true);
    toast.info(t("updatingStrategy"), {
      description: t("analyzingMarketConditions"),
    });
    
    // Call the refresh function
    refreshAnalysis();
    
    // Show visual confirmation after a delay
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
      toast.success(t("strategyUpdated"), {
        description: t("optimalStrategySelected"),
      });
    }, 1500);
  };
  
  const isRealTime = lastUpdated && (Date.now() - lastUpdated.getTime() < 30000);
  
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4" />
          {t("mlStrategySelector")}
        </CardTitle>
        <div className="flex items-center gap-2">
          {isRealTime && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 text-[10px] px-1.5 py-0 h-5 border-green-500/20">
              <Check className="h-3 w-3 mr-0.5" /> 
              {t('realTime')}
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing || !refreshAnalysis}
            className="h-8"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="sr-only">{t('refresh')}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        {!analysis || isLoading ? (
          <div className="h-[120px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Brain className="h-6 w-6 mx-auto text-primary animate-pulse mb-2" />
              {t("analyzingMarket")}...
            </div>
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
              
              <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="h-3 w-3" />
                  <span>{t("lastUpdated")}: {lastUpdated ? lastUpdated.toLocaleTimeString() : t("justNow")}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
