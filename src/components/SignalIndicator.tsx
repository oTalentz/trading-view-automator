
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
  
  // Properly handle trendStrength with correct type definition
  let trendStrengthValue = 0;
  let trendStrengthDirection: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  
  if (primarySignal.trendStrength !== null && primarySignal.trendStrength !== undefined) {
    if (typeof primarySignal.trendStrength === 'number') {
      trendStrengthValue = primarySignal.trendStrength;
      trendStrengthDirection = trendStrengthValue > 60 
        ? 'bullish' 
        : trendStrengthValue < 40 
          ? 'bearish' 
          : 'neutral';
    } else if (typeof primarySignal.trendStrength === 'object' && primarySignal.trendStrength !== null) {
      // Handle object with value property - make sure we check if the properties exist
      const trendObj = primarySignal.trendStrength as { value?: number; direction?: 'bullish' | 'bearish' | 'neutral' };
      trendStrengthValue = trendObj.value || 0;
      trendStrengthDirection = trendObj.direction || 
        (trendStrengthValue > 60 
          ? 'bullish' 
          : trendStrengthValue < 40 
            ? 'bearish' 
            : 'neutral');
    }
  }
  
  // Create structured trendStrength object with the correct types
  const trendStrength = {
    value: trendStrengthValue,
    direction: trendStrengthDirection
  };

  // Filter primary signal direction type before passing it to components
  const signalDirection = primarySignal.direction === 'NEUTRAL' ? 'CALL' : primarySignal.direction;

  return (
    <div className="space-y-4">
      <Card className={`shadow-lg overflow-hidden border-t-4 ${
        signalDirection === 'CALL' 
          ? 'border-t-green-500 dark:border-t-green-600' 
          : 'border-t-red-500 dark:border-t-red-600'
      }`}>
        <CardContent className="p-4 relative">
          <SignalHeader direction={signalDirection} />
          
          <SignalDetails 
            symbol={symbol}
            primarySignal={{
              ...primarySignal,
              direction: signalDirection
            }}
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
    </div>
  );
}
