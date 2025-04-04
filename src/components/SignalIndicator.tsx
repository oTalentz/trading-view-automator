
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useMultiTimeframeAnalysis } from '@/hooks/useMultiTimeframeAnalysis';
import { TimeframeConfluence } from '@/components/TimeframeConfluence';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIInsights } from '@/hooks/useAIInsights';

// Import refactored components
import { SignalHeader } from './signal/SignalHeader';
import { SignalDetails } from './signal/SignalDetails';
import { StrategyInfo } from './signal/StrategyInfo';
import { TechnicalAnalysis } from './signal/TechnicalAnalysis';
import { DisclaimerFooter } from './signal/DisclaimerFooter';

interface SignalIndicatorProps {
  symbol: string;
  interval?: string;
}

export function SignalIndicator({ symbol, interval = "1" }: SignalIndicatorProps) {
  const { analysis, countdown } = useMultiTimeframeAnalysis(symbol, interval);
  const { insights, isLoading: insightsLoading, generateInsights } = useAIInsights(symbol);
  const { t } = useLanguage();

  // If no analysis, show a loading indicator
  if (!analysis) {
    return (
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-800">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">{t("analyzingMarket")}</p>
        </CardContent>
      </Card>
    );
  }

  // Extract the primary signal from the analysis
  const { primarySignal } = analysis;
  
  // Convert technical scores format for compatibility
  const technicalScores = {
    overall: primarySignal.technicalScores.overallScore || 0,
    trend: primarySignal.technicalScores.priceAction || 0,
    momentum: primarySignal.technicalScores.macd || 0,
    volatility: primarySignal.technicalScores.volumeTrend || 0
  };
  
  // Handle trendStrength properly, checking its type and providing defaults
  const trendStrengthValue = typeof primarySignal.trendStrength === 'number' 
    ? primarySignal.trendStrength 
    : typeof primarySignal.trendStrength === 'object' && primarySignal.trendStrength !== null
      ? primarySignal.trendStrength.value || 0
      : 0;
      
  const trendStrengthDirection = typeof primarySignal.trendStrength === 'object' && 
                               primarySignal.trendStrength !== null && 
                               'direction' in primarySignal.trendStrength
    ? primarySignal.trendStrength.direction
    : trendStrengthValue > 60 
      ? 'bullish' 
      : trendStrengthValue < 40 
        ? 'bearish' 
        : 'neutral';
  
  // Create structured trendStrength object
  const trendStrength = {
    value: trendStrengthValue,
    direction: trendStrengthDirection as 'bullish' | 'bearish' | 'neutral'
  };

  return (
    <div className="space-y-4">
      <Card className={`shadow-lg overflow-hidden border-t-4 ${
        primarySignal.direction === 'CALL' 
          ? 'border-t-green-500 dark:border-t-green-600' 
          : 'border-t-red-500 dark:border-t-red-600'
      }`}>
        <CardContent className="p-4 relative">
          <SignalHeader direction={primarySignal.direction} />
          
          <SignalDetails 
            symbol={symbol}
            primarySignal={primarySignal}
            countdown={countdown}
            overallConfluence={analysis.overallConfluence} 
          />

          <StrategyInfo 
            strategy={primarySignal.strategy}
            indicators={primarySignal.indicators}
            supportResistance={primarySignal.supportResistance}
          />
          
          <TechnicalAnalysis 
            technicalScores={technicalScores}
            trendStrength={trendStrength}
          />

          <DisclaimerFooter />
        </CardContent>
      </Card>
      
      {/* Multi-timeframe confluence component */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-4">
          <TimeframeConfluence 
            timeframes={analysis.timeframes}
            overallConfluence={analysis.overallConfluence}
            confluenceDirection={analysis.confluenceDirection}
            currentTimeframe={interval}
          />
        </CardContent>
      </Card>
      
      {/* AI Insights Card */}
      <Card className="shadow-sm border-t-4 border-t-indigo-400 dark:border-t-indigo-600">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-semibold">{t("aiInsights")}</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateInsights}
              disabled={insightsLoading}
            >
              {insightsLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("analyzing")}
                </>
              ) : (
                t("refreshInsights")
              )}
            </Button>
          </div>
          
          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map(insight => (
                <div 
                  key={insight.key} 
                  className={`p-3 rounded-lg ${
                    insight.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-100 dark:border-green-900/20' : 
                    insight.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/20' : 
                    insight.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-100 dark:border-red-900/20' : 
                    'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900/20'
                  }`}
                >
                  <h4 className="font-medium mb-1">{insight.title}</h4>
                  <p className="text-sm opacity-90">{insight.description}</p>
                </div>
              ))}
            </div>
          ) : insightsLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">{t("noInsightsAvailable")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
