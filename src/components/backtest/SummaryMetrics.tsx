
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Progress } from "@/components/ui/progress";
import { BacktestResult } from '@/hooks/useBacktestResults';
import { TrendingUp, TrendingDown, Activity, DollarSign, Target, Award } from 'lucide-react';

interface SummaryMetricsProps {
  backtestResults: BacktestResult;
  signalCount: number;
  streaks: {
    maxWinStreak: number;
    maxLossStreak: number;
    currentStreak: number;
    currentStreakType?: 'WIN' | 'LOSS' | null;
  };
}

export function SummaryMetrics({ 
  backtestResults, 
  signalCount,
  streaks 
}: SummaryMetricsProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2 p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t("winRate")}</div>
              <div className="text-3xl font-bold">
                {backtestResults.winRate}%
              </div>
            </div>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
              <Target className="h-5 w-5 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <Progress 
            value={backtestResults.winRate} 
            className="h-2"
            indicatorClassName={
              backtestResults.winRate > 65 ? "bg-green-500" : 
              backtestResults.winRate > 50 ? "bg-amber-500" : 
              "bg-red-500"
            }
          />
          <div className="text-sm text-muted-foreground mt-1">
            {t("basedOn")} {signalCount} {t("tradingSignals")}
          </div>
        </div>
        
        <div className="space-y-2 p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t("profitFactor")}</div>
              <div className="text-3xl font-bold">
                {backtestResults.profitFactor.toFixed(2)}
              </div>
            </div>
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
          </div>
          <Progress 
            value={Math.min(backtestResults.profitFactor * 25, 100)} 
            className="h-2"
            indicatorClassName={
              backtestResults.profitFactor > 1.5 ? "bg-green-500" : 
              backtestResults.profitFactor > 1 ? "bg-amber-500" : 
              "bg-red-500"
            }
          />
          <div className="text-sm text-muted-foreground mt-1">
            {backtestResults.profitFactor > 1.5 
              ? t("excellentProfitFactor") 
              : backtestResults.profitFactor > 1.0 
                ? t("goodProfitFactor") 
                : t("improveProfitFactor")}
          </div>
        </div>
        
        <div className="space-y-2 p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t("expectancy")}</div>
              <div className="text-3xl font-bold">
                {backtestResults.expectancy.toFixed(2)}
              </div>
            </div>
            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
              <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
            </div>
          </div>
          <Progress 
            value={Math.min(Math.max((backtestResults.expectancy + 1) * 50, 0), 100)} 
            className="h-2"
            indicatorClassName={
              backtestResults.expectancy > 0.2 ? "bg-green-500" : 
              backtestResults.expectancy > 0 ? "bg-amber-500" : 
              "bg-red-500"
            }
          />
          <div className="text-sm text-muted-foreground mt-1">
            {backtestResults.expectancy > 0 
              ? t("positiveExpectancy") 
              : t("negativeExpectancy")}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("maxDrawdown")}</div>
          <div className="text-2xl font-bold flex items-center">
            {backtestResults.maxDrawdown}%
            <TrendingDown className={`ml-2 h-5 w-5 ${
              backtestResults.maxDrawdown < 15 ? "text-green-500" : 
              backtestResults.maxDrawdown < 25 ? "text-amber-500" : 
              "text-red-500"
            }`} />
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("consecutiveLosses")}</div>
          <div className="text-2xl font-bold flex items-center">
            {backtestResults.consecutiveLosses}
            <TrendingDown className={`ml-2 h-5 w-5 ${
              backtestResults.consecutiveLosses < 3 ? "text-green-500" : 
              backtestResults.consecutiveLosses < 5 ? "text-amber-500" : 
              "text-red-500"
            }`} />
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("bestWinStreak")}</div>
          <div className="text-2xl font-bold flex items-center">
            {streaks.maxWinStreak}
            <TrendingUp className={`ml-2 h-5 w-5 text-green-500`} />
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-1">{t("currentStreak")}</div>
          <div className="text-2xl font-bold flex items-center">
            {streaks.currentStreak}
            {streaks.currentStreakType === 'WIN' ? (
              <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
            ) : streaks.currentStreakType === 'LOSS' ? (
              <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
            ) : (
              <Award className="ml-2 h-5 w-5 text-blue-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
