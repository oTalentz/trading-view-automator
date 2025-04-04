
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from './OverviewTab';
import { PerformanceHistoryChart } from './PerformanceHistoryChart';
import { ConfidenceAnalysisChart } from './ConfidenceAnalysisChart';

type AnalyticsTabsProps = {
  resultData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  timeframeData: Array<{
    timeframe: string;
    count: number;
  }>;
  timeSeriesData: any[];
  confidenceData: Array<{
    label: string;
    winRate: number;
    count: number;
  }>;
};

export function AnalyticsTabs({ 
  resultData, 
  timeframeData, 
  timeSeriesData, 
  confidenceData 
}: AnalyticsTabsProps) {
  const { t } = useLanguage();
  
  return (
    <Tabs defaultValue="overview" className="w-full mb-6">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
        <TabsTrigger value="performance">{t("performanceHistory")}</TabsTrigger>
        <TabsTrigger value="confidence">{t("confidenceAnalysis")}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTab 
          resultData={resultData}
          timeframeData={timeframeData}
        />
      </TabsContent>
      
      <TabsContent value="performance">
        <PerformanceHistoryChart timeSeriesData={timeSeriesData} />
      </TabsContent>
      
      <TabsContent value="confidence">
        <ConfidenceAnalysisChart confidenceData={confidenceData} />
      </TabsContent>
    </Tabs>
  );
}
