
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SignalHistoryEntry } from '@/utils/signalHistoryUtils';
import { BacktestResult } from '@/hooks/useBacktestResults';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { SummaryMetrics } from './SummaryMetrics';
import { WinRateDistribution } from './WinRateDistribution';
import { ConfusionMatrix } from './ConfusionMatrix';
import { StrategyPerformance } from './StrategyPerformance';
import { TimeAnalysis } from './TimeAnalysis';
import { CandleAnalysis } from './CandleAnalysis';
import { calculateStreaks, determineCandleAccuracy } from './BacktestUtils';

interface BacktestTabsProps {
  backtestResults: BacktestResult;
  signals: SignalHistoryEntry[];
}

export function BacktestTabs({ backtestResults, signals }: BacktestTabsProps) {
  const { t } = useLanguage();
  
  const streaks = calculateStreaks(signals);
  const candleAccuracy = determineCandleAccuracy(signals);
  
  // Prepare candle accuracy data for charts
  const candleAccuracyChartData = Object.entries(candleAccuracy).map(([strategy, data]) => {
    const accuracyPercent = data.total > 0 ? Math.round((data.accurate / data.total) * 100) : 0;
    
    // Calculate timeframe breakdown
    const timeframeData = Object.entries(data.timeframes).map(([timeframe, tfData]) => {
      const tfAccuracy = tfData.total > 0 ? Math.round((tfData.accurate / tfData.total) * 100) : 0;
      return {
        timeframe: `${timeframe}${timeframe === 'D' ? '' : 'm'}`,
        accuracy: tfAccuracy,
        samples: tfData.total
      };
    });
    
    return {
      strategy,
      accuracy: accuracyPercent,
      samples: data.total,
      timeframes: timeframeData
    };
  }).sort((a, b) => b.accuracy - a.accuracy);
  
  return (
    <Tabs defaultValue="summary">
      <TabsList className="mb-4">
        <TabsTrigger value="summary">{t("summary")}</TabsTrigger>
        <TabsTrigger value="strategies">{t("strategies")}</TabsTrigger>
        <TabsTrigger value="timeAnalysis">{t("timeAnalysis")}</TabsTrigger>
        <TabsTrigger value="candleAnalysis">{t("candleAnalysis")}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary">
        <SummaryMetrics 
          backtestResults={backtestResults} 
          signalCount={signals.length}
          streaks={streaks}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <WinRateDistribution 
            backtestResults={backtestResults} 
            signals={signals}
          />
          
          <ConfusionMatrix
            signals={signals}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="strategies">
        <StrategyPerformance 
          candleAccuracyData={candleAccuracyChartData}
          backtestResults={backtestResults}
        />
      </TabsContent>
      
      <TabsContent value="timeAnalysis">
        <TimeAnalysis signals={signals} />
      </TabsContent>
      
      <TabsContent value="candleAnalysis">
        <CandleAnalysis candleAccuracyChartData={candleAccuracyChartData} />
      </TabsContent>
    </Tabs>
  );
}
