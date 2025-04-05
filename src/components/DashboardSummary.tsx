
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { EmptyState } from './dashboard/EmptyState';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { MetricsSection } from './dashboard/MetricsSection';
import { MainContentSection } from './dashboard/MainContentSection';
import { SidebarSection } from './dashboard/SidebarSection';
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
  
  const [timeframeFilter, setTimeframeFilter] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Available timeframe options
  const timeframeOptions = ['all', '1m', '5m', '15m', '1h', '4h', '1d'];
  
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
  
  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // If no signals, show empty state
  if (totalSignals === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="space-y-6">
      {/* Enhanced Dashboard Header with Quick Filters */}
      <DashboardHeader
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        timeframeFilter={timeframeFilter}
        setTimeframeFilter={setTimeframeFilter}
        timeframeOptions={timeframeOptions}
      />
      
      {/* Performance Metrics Section */}
      <MetricsSection
        expanded={expandedSections.metrics}
        toggleSection={() => toggleSection('metrics')}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        totalSignals={totalSignals}
        completedSignals={completedSignals.length}
        winningSignals={winningSignals.length}
        winRate={winRate}
        timeframeData={timeframeData}
        callSignalsPercentage={callSignalsPercentage}
        putSignalsPercentage={putSignalsPercentage}
      />
      
      {/* Responsive Grid Layout for Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Content Section */}
        <MainContentSection
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          mockAnalysis={mockAnalysis}
          resultData={resultData}
          timeframeData={timeframeData}
          timeSeriesData={timeSeriesData}
          confidenceData={confidenceData}
        />
        
        {/* Sidebar Section */}
        <SidebarSection selectedSymbol={selectedSymbol} />
      </div>
    </div>
  );
}
