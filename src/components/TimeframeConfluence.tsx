
import React, { useState, useEffect } from 'react';
import { TimeframeAnalysis } from '@/types/timeframeAnalysis';
import { AlertTriangle, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Import refactored components
import { TimeframeCard } from './timeframe/TimeframeCard';
import { ConfluenceProgress } from './timeframe/ConfluenceProgress';
import { SignalCountBadges } from './timeframe/SignalCountBadges';
import { DirectionBadge } from './timeframe/DirectionBadge';
import { getMarketConditionDisplay, getTicketName } from './timeframe/utils';

interface TimeframeConfluenceProps {
  timeframes: TimeframeAnalysis[];
  overallConfluence: number;
  confluenceDirection: 'CALL' | 'PUT' | 'NEUTRAL';
  currentTimeframe: string;
}

interface SignalCounts {
  CALL: number;
  PUT: number;
  NEUTRAL: number;
}

export function TimeframeConfluence({ 
  timeframes,
  overallConfluence,
  confluenceDirection,
  currentTimeframe 
}: TimeframeConfluenceProps) {
  const { t, language } = useLanguage();
  const [signalCounts, setSignalCounts] = useState<SignalCounts>({
    CALL: 0,
    PUT: 0,
    NEUTRAL: 0
  });

  // Effect to count signals when timeframes change
  useEffect(() => {
    const counts: SignalCounts = {
      CALL: 0,
      PUT: 0,
      NEUTRAL: 0
    };
    
    // Count occurrences of each signal type
    timeframes.forEach(tf => {
      counts[tf.direction] = (counts[tf.direction] || 0) + 1;
    });
    
    // Add the overall confluence direction
    counts[confluenceDirection] = (counts[confluenceDirection] || 0) + 1;
    
    setSignalCounts(counts);
  }, [timeframes, confluenceDirection]);

  return (
    <div className="border rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" /> {t("timeframeConfluence")}
        </h3>
        <DirectionBadge direction={confluenceDirection} />
      </div>
      
      <ConfluenceProgress 
        overallConfluence={overallConfluence} 
        confluenceDirection={confluenceDirection} 
      />
      
      <SignalCountBadges 
        signalCounts={signalCounts}
        getTicketName={(direction) => getTicketName(direction, language)}
      />
      
      <div className="grid grid-cols-2 gap-3">
        {timeframes.map((tf) => (
          <TimeframeCard
            key={tf.timeframe}
            timeframeData={tf}
            isCurrentTimeframe={tf.timeframe === currentTimeframe}
            getMarketConditionDisplay={(condition) => getMarketConditionDisplay(condition, language)}
            getTicketName={(direction) => getTicketName(direction, language)}
          />
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {t("confluenceDisclaimer")}
      </div>
    </div>
  );
}
