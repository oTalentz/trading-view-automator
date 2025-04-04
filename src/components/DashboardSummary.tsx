import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarketCondition } from '@/utils/technicalAnalysis';

// Import our components
import { EmptyState } from './dashboard/EmptyState';
import { SummaryCards } from './dashboard/SummaryCards';
import { OverviewTab } from './dashboard/OverviewTab';
import { PerformanceHistoryChart } from './dashboard/PerformanceHistoryChart';
import { ConfidenceAnalysisChart } from './dashboard/ConfidenceAnalysisChart';
import { UpcomingEventsCard } from './dashboard/UpcomingEventsCard';
import { ConfluenceHeatmap } from './ConfluenceHeatmap';
import { TimeframeConfluence } from './TimeframeConfluence';

export function DashboardSummary() {
  const { t } = useLanguage();
  const signals = getSignalHistory();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('all');
  
  // Filter signals by time range
  const filteredSignals = signals.filter(signal => {
    if (timeRange === 'all') return true;
    
    const signalDate = new Date(signal.timestamp);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - signalDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (timeRange === '7d') return daysDiff <= 7;
    if (timeRange === '30d') return daysDiff <= 30;
    
    return true;
  });
  
  // Calculate performance metrics
  const totalSignals = filteredSignals.length;
  const completedSignals = filteredSignals.filter(s => s.result !== null && s.result !== undefined);
  const winningSignals = filteredSignals.filter(s => s.result === 'WIN');
  const losingSignals = filteredSignals.filter(s => s.result === 'LOSS');
  const drawSignals = filteredSignals.filter(s => s.result === 'DRAW');
  const pendingSignals = filteredSignals.filter(s => s.result === null || s.result === undefined);
  
  const winRate = completedSignals.length > 0 
    ? Math.round((winningSignals.length / completedSignals.length) * 100) 
    : 0;
  
  // Data for direction distribution
  const callSignals = filteredSignals.filter(s => s.direction === 'CALL').length;
  const putSignals = filteredSignals.filter(s => s.direction === 'PUT').length;
  const callSignalsPercentage = totalSignals > 0 ? Math.round((callSignals / totalSignals) * 100) : 0;
  const putSignalsPercentage = totalSignals > 0 ? Math.round((putSignals / totalSignals) * 100) : 0;
  
  // Data for result distribution
  const resultData = [
    { name: t("wins"), value: winningSignals.length, color: '#22c55e' },
    { name: t("losses"), value: losingSignals.length, color: '#ef4444' },
    { name: t("draws"), value: drawSignals.length, color: '#94a3b8' },
    { name: t("pending"), value: pendingSignals.length, color: '#f59e0b' },
  ];
  
  // Data for timeframe distribution
  const timeframeData = Object.entries(
    filteredSignals.reduce((acc: Record<string, number>, signal) => {
      acc[signal.timeframe] = (acc[signal.timeframe] || 0) + 1;
      return acc;
    }, {})
  )
  .map(([timeframe, count]) => ({ timeframe, count }))
  .sort((a, b) => {
    // Sort by numeric value (1, 5, 15, etc.)
    const numA = parseInt(a.timeframe);
    const numB = parseInt(b.timeframe);
    return numA - numB;
  });
  
  // Generate time series data for performance tracking
  const getTimeSeriesData = () => {
    // Group signals by day
    const signalsByDay: Record<string, any> = {};
    
    filteredSignals.forEach(signal => {
      const date = new Date(signal.timestamp);
      const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD format
      
      if (!signalsByDay[dateStr]) {
        signalsByDay[dateStr] = {
          date: dateStr,
          totalSignals: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          pending: 0
        };
      }
      
      signalsByDay[dateStr].totalSignals += 1;
      
      if (signal.result === 'WIN') {
        signalsByDay[dateStr].wins += 1;
      } else if (signal.result === 'LOSS') {
        signalsByDay[dateStr].losses += 1;
      } else if (signal.result === 'DRAW') {
        signalsByDay[dateStr].draws += 1;
      } else {
        signalsByDay[dateStr].pending += 1;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(signalsByDay).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };
  
  // Data for performance tracking
  const timeSeriesData = getTimeSeriesData();
  
  // Calculate win rate by confidence level
  const getWinRateByConfidence = () => {
    // Define confidence levels
    const levels = [
      { min: 0, max: 70, label: '<70%' },
      { min: 70, max: 80, label: '70-80%' },
      { min: 80, max: 90, label: '80-90%' },
      { min: 90, max: 100, label: '>90%' }
    ];
    
    // Calculate win rate for each level
    return levels.map(level => {
      const signalsInLevel = completedSignals.filter(
        s => s.confidence >= level.min && s.confidence < level.max
      );
      
      const winsInLevel = signalsInLevel.filter(s => s.result === 'WIN').length;
      const winRate = signalsInLevel.length > 0 
        ? Math.round((winsInLevel / signalsInLevel.length) * 100) 
        : 0;
      
      return {
        label: level.label,
        winRate: winRate,
        count: signalsInLevel.length
      };
    });
  };
  
  const confidenceData = getWinRateByConfidence();
  
  // For ConfluenceHeatmap component - fixed to include all required properties
  const mockAnalysis = {
    primarySignal: {
      direction: 'CALL' as 'CALL' | 'PUT',
      confidence: 78,
      timestamp: new Date().toISOString(),
      entryTime: new Date().toISOString(),
      expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      strategy: "Multi-Timeframe Confluence",
      indicators: ["RSI", "MACD", "Bollinger Bands"],
      trendStrength: 65,
      marketCondition: MarketCondition.STRONG_TREND_UP,
      supportResistance: {
        support: 100,
        resistance: 110
      },
      technicalScores: {
        rsi: 70,
        macd: 65,
        bollingerBands: 75,
        volumeTrend: 60,
        priceAction: 80,
        overallScore: 70
      }
    },
    overallConfluence: 78,
    confluenceDirection: 'CALL' as 'CALL' | 'PUT' | 'NEUTRAL',
    timeframes: [
      { 
        label: '1m', 
        timeframe: '1', 
        confidence: 65, 
        direction: 'CALL' as 'CALL' | 'PUT' | 'NEUTRAL', 
        strength: 60,
        marketCondition: MarketCondition.TREND_UP 
      },
      { 
        label: '5m', 
        timeframe: '5', 
        confidence: 82, 
        direction: 'CALL' as 'CALL' | 'PUT' | 'NEUTRAL', 
        strength: 75,
        marketCondition: MarketCondition.STRONG_TREND_UP
      },
      { 
        label: '15m', 
        timeframe: '15', 
        confidence: 75, 
        direction: 'NEUTRAL' as 'CALL' | 'PUT' | 'NEUTRAL', 
        strength: 65,
        marketCondition: MarketCondition.SIDEWAYS 
      },
      { 
        label: '1h', 
        timeframe: '60', 
        confidence: 90, 
        direction: 'CALL' as 'CALL' | 'PUT' | 'NEUTRAL', 
        strength: 85,
        marketCondition: MarketCondition.STRONG_TREND_UP
      },
    ],
    countdown: 60
  };
  
  // If no signals, show empty state
  if (totalSignals === 0) {
    return <EmptyState />;
  }
  
  return (
    <>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("performanceAnalytics")}</h2>
        <Select value={timeRange} onValueChange={(value: '7d' | '30d' | 'all') => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("selectTimeRange")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">{t("last7Days")}</SelectItem>
            <SelectItem value="30d">{t("last30Days")}</SelectItem>
            <SelectItem value="all">{t("allTime")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <SummaryCards 
        totalSignals={totalSignals}
        completedSignals={completedSignals.length}
        winningSignals={winningSignals.length}
        winRate={winRate}
        timeframeData={timeframeData}
        callSignalsPercentage={callSignalsPercentage}
        putSignalsPercentage={putSignalsPercentage}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <ConfluenceHeatmap analysis={mockAnalysis} />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <TimeframeConfluence 
              timeframes={mockAnalysis.timeframes}
              overallConfluence={mockAnalysis.overallConfluence}
              confluenceDirection={mockAnalysis.confluenceDirection}
              currentTimeframe="5m"
            />
          </div>
        </div>
        
        <UpcomingEventsCard />
      </div>
      
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
    </>
  );
}
