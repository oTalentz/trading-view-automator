
import React from 'react';
import { Hash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Direction, DirectionColors } from '@/utils/colorSystem';

interface SignalCounts {
  CALL: number;
  PUT: number;
  NEUTRAL: number;
}

interface SignalCountBadgesProps {
  signalCounts: SignalCounts;
  getTicketName: (direction: Direction) => string;
}

export function SignalCountBadges({ signalCounts, getTicketName }: SignalCountBadgesProps) {
  return (
    <div className="flex justify-center gap-3 mb-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
      <div className="flex items-center gap-1">
        <Hash className={`h-3.5 w-3.5 ${DirectionColors.CALL.text}`} />
        <span className={`text-xs font-medium ${DirectionColors.CALL.text} ${DirectionColors.CALL.darkText}`}>
          {getTicketName('CALL')}: {signalCounts.CALL || 0}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Hash className={`h-3.5 w-3.5 ${DirectionColors.PUT.text}`} />
        <span className={`text-xs font-medium ${DirectionColors.PUT.text} ${DirectionColors.PUT.darkText}`}>
          {getTicketName('PUT')}: {signalCounts.PUT || 0}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Hash className={`h-3.5 w-3.5 ${DirectionColors.NEUTRAL.text}`} />
        <span className={`text-xs font-medium ${DirectionColors.NEUTRAL.text} ${DirectionColors.NEUTRAL.darkText}`}>
          {getTicketName('NEUTRAL')}: {signalCounts.NEUTRAL || 0}
        </span>
      </div>
    </div>
  );
}
