
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { EmptyState } from './dashboard/EmptyState';
import { SummaryCards } from './dashboard/SummaryCards';
import { UpcomingEventsCard } from './dashboard/UpcomingEventsCard';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { ConfluenceSection } from './dashboard/ConfluenceSection';
import { AnalyticsTabs } from './dashboard/AnalyticsTabs';
import { 
  filterSignalsByTimeRange, 
  getWinRateByConfidence, 
  getTimeSeriesData,
  createMockAnalysis
} from '@/utils/dashboard/dashboardDataUtils';

export function DashboardSummary() {
  const { t } = useLanguage();
  const signals = getSignalHistory();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('all');
  
  // Filter signals by time range
  const filteredSignals = filterSignalsByTimeRange(signals, timeRange);
  
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
  .map(([timeframe, count]) => ({ timeframe, count: count as number }))
  .sort((a, b) => {
    // Sort by numeric value (1, 5, 15, etc.)
    const numA = parseInt(a.timeframe);
    const numB = parseInt(b.timeframe);
    return numA - numB;
  });
  
  // Data for performance tracking
  const timeSeriesData = getTimeSeriesData(filteredSignals);
  
  // Data for confidence analysis
  const confidenceData = getWinRateByConfidence(completedSignals);
  
  // Mock analysis for the ConfluenceHeatmap component
  const mockAnalysis = createMockAnalysis();
  
  // If no signals, show empty state
  if (totalSignals === 0) {
    return <EmptyState />;
  }
  
  return (
    <>
      <DashboardHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      
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
        <ConfluenceSection mockAnalysis={mockAnalysis} />
        <UpcomingEventsCard />
      </div>
      
      <AnalyticsTabs 
        resultData={resultData}
        timeframeData={timeframeData}
        timeSeriesData={timeSeriesData}
        confidenceData={confidenceData}
      />
    </>
  );
}
