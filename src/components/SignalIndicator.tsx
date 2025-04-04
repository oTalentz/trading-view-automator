
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useMultiTimeframeAnalysis } from '@/hooks/useMultiTimeframeAnalysis';
import { TimeframeConfluence } from '@/components/TimeframeConfluence';

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

  // Se não houver análise, mostre um indicador de carregamento
  if (!analysis) {
    return (
      <div className="p-4 border rounded-lg flex items-center justify-center">
        <div className="animate-pulse">{useLanguage().t("analyzingMarket")}</div>
      </div>
    );
  }

  // Extrair o sinal principal da análise
  const { primarySignal } = analysis;

  return (
    <div>
      <div className={`p-4 border rounded-lg shadow-sm ${
        primarySignal.direction === 'CALL' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
      }`}>
        <SignalHeader direction={primarySignal.direction} />
        
        <SignalDetails 
          symbol={symbol}
          primarySignal={primarySignal}
          countdown={countdown}
          overallConfluence={analysis.overallConfluence} 
        />

        <div className="border-t pt-2 mt-2">
          <StrategyInfo 
            strategy={primarySignal.strategy}
            indicators={primarySignal.indicators}
            supportResistance={primarySignal.supportResistance}
          />
          
          <TechnicalAnalysis 
            technicalScores={primarySignal.technicalScores}
            trendStrength={primarySignal.trendStrength}
          />
        </div>

        <DisclaimerFooter />
      </div>
      
      {/* Componente de confluência de timeframes */}
      <TimeframeConfluence 
        timeframes={analysis.timeframes}
        overallConfluence={analysis.overallConfluence}
        confluenceDirection={analysis.confluenceDirection}
        currentTimeframe={interval}
      />
    </div>
  );
}
