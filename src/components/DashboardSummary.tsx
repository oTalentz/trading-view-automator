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
import { 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  BarChart2,
  LineChart,
  BrainCircuit,
  Settings,
  Star,
  Clock,
  Filter,
  LayoutDashboard
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

  // Available timeframe options
  const timeframeOptions = ['all', '1m', '5m', '15m', '1h', '4h', '1d'];
  
  return (
    <div className="space-y-6">
      {/* Enhanced Dashboard Header with Quick Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("performanceAnalytics")}</h2>
          <p className="text-muted-foreground text-sm">{t("dashboardDescription")}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Timeframe Quick Filters */}
          <div className="flex-1 md:flex-initial">
            <Card className="border-muted bg-background/60">
              <CardContent className="p-2">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    {t("timeframeFilter")}
                  </div>
                  <ToggleGroup 
                    type="single" 
                    value={timeframeFilter} 
                    onValueChange={(value) => setTimeframeFilter(value || 'all')}
                    className="flex flex-wrap justify-start"
                  >
                    {timeframeOptions.map(tf => (
                      <ToggleGroupItem 
                        key={tf} 
                        value={tf} 
                        size="sm"
                        className="text-xs px-2 h-6"
                      >
                        {tf === 'all' ? t('all') : tf}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Period selector */}
          <div className="flex-1 md:flex-initial">
            <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
          </div>
        </div>
      </div>
      
      {/* Category: Technical Analysis */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <BarChart2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">{t("technicalAnalysis")}</h3>
        </div>
        
        {/* Collapsible Metrics Section */}
        <Card className="overflow-hidden">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer bg-muted/50" 
            onClick={() => toggleSection('metrics')}>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              {t("performanceMetrics")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite('performanceMetrics');
                }}
              >
                <Star className={`h-4 w-4 ${favorites.includes('performanceMetrics') ? 'fill-primary text-primary' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {expandedSections.metrics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
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
      </div>
      
      {/* Responsive Grid Layout for Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Category: Market Signals */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <ExternalLink className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">{t("marketSignals")}</h3>
          </div>
          
          <Card className="overflow-hidden">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer bg-muted/50"
              onClick={() => toggleSection('confluence')}>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {t("marketConfluence")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite('marketConfluence');
                  }}
                >
                  <Star className={`h-4 w-4 ${favorites.includes('marketConfluence') ? 'fill-primary text-primary' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {expandedSections.confluence ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
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
                <LayoutDashboard className="h-5 w-5 text-primary" />
                {t("analyticsInsights")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite('analyticsInsights');
                  }}
                >
                  <Star className={`h-4 w-4 ${favorites.includes('analyticsInsights') ? 'fill-primary text-primary' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {expandedSections.analytics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
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
        
        {/* Category: AI Insights & Settings */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">{t("aiInsights")}</h3>
          </div>
          
          <UpcomingEventsCard />
          
          <div className="flex items-center gap-2 px-1 mt-6">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">{t("configuration")}</h3>
          </div>
          
          <MLStrategySelector symbol={selectedSymbol} interval="1" />
        </div>
      </div>
    </div>
  );
}

function TimeRangeSelector({ timeRange, setTimeRange }: { 
  timeRange: '7d' | '30d' | 'all'; 
  setTimeRange: (value: '7d' | '30d' | 'all') => void 
}) {
  const { t } = useLanguage();
  
  return (
    <Card className="border-muted bg-background/60">
      <CardContent className="p-2">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t("period")}
          </div>
          <ToggleGroup 
            type="single" 
            value={timeRange} 
            onValueChange={(value) => setTimeRange(value as '7d' | '30d' | 'all')}
          >
            <ToggleGroupItem value="7d" size="sm" className="text-xs px-2 h-6">
              {t("last7Days")}
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" size="sm" className="text-xs px-2 h-6">
              {t("last30Days")}
            </ToggleGroupItem>
            <ToggleGroupItem value="all" size="sm" className="text-xs px-2 h-6">
              {t("allTime")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
}
