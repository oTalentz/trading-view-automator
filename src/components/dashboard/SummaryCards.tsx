
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, LineChart, Clock, Trophy, BarChart3 } from 'lucide-react';

type SummaryCardsProps = {
  totalSignals: number;
  completedSignals: number;
  winningSignals: number;
  winRate: number;
  timeframeData: Array<{ timeframe: string; count: number }>;
  callSignalsPercentage: number;
  putSignalsPercentage: number;
};

export function SummaryCards({
  totalSignals,
  completedSignals,
  winningSignals,
  winRate,
  timeframeData,
  callSignalsPercentage,
  putSignalsPercentage
}: SummaryCardsProps) {
  const { t } = useLanguage();
  
  const callSignalsCount = Math.round((callSignalsPercentage / 100) * totalSignals);
  const putSignalsCount = Math.round((putSignalsPercentage / 100) * totalSignals);
  const callDominant = callSignalsCount > putSignalsCount;
  
  // Calculate average signals per day
  const avgSignalsPerDay = Math.round(totalSignals / (totalSignals > 30 ? 30 : Math.max(1, totalSignals / 3)));
  
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>{t("totalSignals")}</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              {totalSignals}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {completedSignals} {t("completed")}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>{t("winRate")}</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              {winRate}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {winningSignals} {t("wins")} / {completedSignals} {t("completed")}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>{t("bestTimeframe")}</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              {timeframeData.length > 0 ? timeframeData[0].timeframe : '-'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {timeframeData.length > 0 ? `${timeframeData[0].count} ${t("signals")}` : t("noData")}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>{t("direction")}</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {callDominant ? (
                <>
                  <TrendingUp className="h-5 w-5 text-green-500" /> 
                  CALL
                </>
              ) : (
                <>
                  <TrendingDown className="h-5 w-5 text-red-500" /> 
                  PUT
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {callSignalsPercentage}% CALL / {putSignalsPercentage}% PUT
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription>{t("averageActivity")}</CardDescription>
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            {avgSignalsPerDay} {t("signalsPerDay")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {t("basedOnRecentActivity")}
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-2">
            <div 
              className="h-full bg-purple-500 rounded-full" 
              style={{ width: `${Math.min(100, avgSignalsPerDay * 10)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

