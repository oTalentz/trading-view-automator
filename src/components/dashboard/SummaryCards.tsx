
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from 'lucide-react';

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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t("totalSignals")}</CardDescription>
          <CardTitle className="text-3xl">{totalSignals}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {completedSignals} {t("completed")}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t("winRate")}</CardDescription>
          <CardTitle className="text-3xl">{winRate}%</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {winningSignals} {t("wins")} / {completedSignals} {t("completed")}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t("bestTimeframe")}</CardDescription>
          <CardTitle className="text-3xl">
            {timeframeData.length > 0 ? timeframeData[0].timeframe : '-'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {timeframeData.length > 0 ? `${timeframeData[0].count} ${t("signals")}` : t("noData")}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t("direction")}</CardDescription>
          <CardTitle className="text-3xl flex items-center gap-2">
            {callDominant ? (
              <>
                <TrendingUp className="h-6 w-6 text-green-500" /> 
                CALL
              </>
            ) : (
              <>
                <TrendingDown className="h-6 w-6 text-red-500" /> 
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
  );
}
