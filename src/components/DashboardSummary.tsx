
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { EmptyState } from './dashboard/EmptyState';
import { SummaryCards } from './dashboard/SummaryCards';
import { UpcomingEventsCard } from './dashboard/UpcomingEventsCard';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { ConfluenceSection } from './dashboard/ConfluenceSection';
import { AnalyticsTabs } from './dashboard/AnalyticsTabs';
import { MLStrategySelector } from './MLStrategySelector';
import { 
  filterSignalsByTimeRange, 
  getWinRateByConfidence, 
  getTimeSeriesData,
  createMockAnalysis
} from '@/utils/dashboard/dashboardDataUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';

export function DashboardSummary() {
  const { t } = useLanguage();
  const signals = getSignalHistory();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('all');
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTCUSDT");
  const [expandedSections, setExpandedSections] = useState<{
    metrics: boolean;
    confluence: boolean;
    analytics: boolean;
  }>({
    metrics: true,
    confluence: false,
    analytics: true,
  });
  
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
  
  // Toggle expansion of sections
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // If no signals, show empty state
  if (totalSignals === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="space-y-6">
      <DashboardHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      
      {/* Collapsible Metrics Section */}
      <Card className="overflow-hidden">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer bg-muted/50" 
          onClick={() => toggleSection('metrics')}>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            {t("performanceMetrics")}
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {expandedSections.metrics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {expandedSections.metrics && (
          <CardContent className="p-4">
            <SummaryCards 
              totalSignals={totalSignals}
              completedSignals={completedSignals.length}
              winningSignals={winningSignals.length}
              winRate={winRate}
              timeframeData={timeframeData}
              callSignalsPercentage={callSignalsPercentage}
              putSignalsPercentage={putSignalsPercentage}
            />
          </CardContent>
        )}
      </Card>
      
      {/* Responsive Grid Layout for Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Confluence Section - takes 8 columns on large screens */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer bg-muted/50"
              onClick={() => toggleSection('confluence')}>
              <CardTitle className="text-lg flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                {t("marketConfluence")}
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {expandedSections.confluence ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            {expandedSections.confluence && (
              <CardContent className="p-4">
                <ConfluenceSection mockAnalysis={mockAnalysis} />
              </CardContent>
            )}
          </Card>
          
          {/* Analytics Section */}
          <Card className="overflow-hidden">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer bg-muted/50"
              onClick={() => toggleSection('analytics')}>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                {t("analyticsInsights")}
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {expandedSections.analytics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            {expandedSections.analytics && (
              <CardContent className="p-4">
                <AnalyticsTabs 
                  resultData={resultData}
                  timeframeData={timeframeData}
                  timeSeriesData={timeSeriesData}
                  confidenceData={confidenceData}
                />
              </CardContent>
            )}
          </Card>
        </div>
        
        {/* Sidebar - takes 4 columns on large screens */}
        <div className="lg:col-span-4 space-y-4">
          <UpcomingEventsCard />
          <MLStrategySelector symbol={selectedSymbol} interval="1" />
        </div>
      </div>
    </div>
  );
}
