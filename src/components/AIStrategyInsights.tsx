
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAIInsights } from '@/hooks/useAIInsights';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BarChart2, RefreshCw, Info } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { InsightCard } from './ai/InsightCard';
import { RecommendationList } from './ai/RecommendationList';

interface AIStrategyInsightsProps {
  symbol: string;
}

export function AIStrategyInsights({ symbol }: AIStrategyInsightsProps) {
  const { insights, isLoading, generateInsights } = useAIInsights(symbol);
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t("aiStrategyInsights")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {t("aiStrategyInsights")}
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateInsights}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          {t("refresh")}
        </Button>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-6">
            <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {t("noInsightsYet")}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="insights">
            <TabsList className="mb-4">
              <TabsTrigger value="insights">{t("insights")}</TabsTrigger>
              <TabsTrigger value="recommendations">{t("recommendations")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights">
              <div className="space-y-4">
                {insights.map(insight => (
                  <InsightCard
                    key={insight.key}
                    title={insight.title}
                    description={insight.description}
                    type={insight.type}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">{t("aiRecommendations")}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("basedOnHistoricalData")}
                  </p>
                  <ul className="space-y-2 text-sm">
                    <RecommendationList hasInsights={insights.length > 0} />
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
