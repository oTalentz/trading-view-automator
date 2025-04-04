
import React from 'react';
import { SignalResultsChart } from './SignalResultsChart';
import { TimeframeBarChart } from './TimeframeBarChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BarChart2, LineChart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type ResultData = Array<{
  name: string;
  value: number;
  color: string;
}>;

type TimeframeData = Array<{
  timeframe: string;
  count: number;
}>;

type OverviewTabProps = {
  resultData: ResultData;
  timeframeData: TimeframeData;
};

export function OverviewTab({ resultData, timeframeData }: OverviewTabProps) {
  const { t } = useLanguage();
  
  // Calculate most frequently used timeframe
  const mostUsedTimeframe = timeframeData.length > 0 
    ? timeframeData.reduce((prev, current) => (prev.count > current.count) ? prev : current)
    : null;
    
  // Calculate total signals from result data
  const totalSignals = resultData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>{t("popularTimeframe")}</CardDescription>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              {mostUsedTimeframe ? mostUsedTimeframe.timeframe : '-'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {mostUsedTimeframe ? `${mostUsedTimeframe.count} ${t("signals")}` : t("noData")}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>{t("signalResults")}</CardDescription>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-green-500" />
              {totalSignals} {t("totalSignals")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {resultData.find(r => r.name === t("wins"))?.value || 0} {t("wins")}, {resultData.find(r => r.name === t("losses"))?.value || 0} {t("losses")}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>{t("analysisProgress")}</CardDescription>
            <CardTitle className="text-xl flex items-center gap-2">
              <LineChart className="h-5 w-5 text-purple-500" />
              {Math.round((resultData.find(r => r.name !== t("pending"))?.value || 0) / Math.max(1, totalSignals) * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {resultData.find(r => r.name === t("pending"))?.value || 0} {t("pendingSignals")}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignalResultsChart resultData={resultData} />
        <TimeframeBarChart timeframeData={timeframeData} />
      </div>
    </div>
  );
}
