
import React from 'react';
import { Hash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SignalCounts {
  CALL: number;
  PUT: number;
  NEUTRAL: number;
}

interface SignalCountBadgesProps {
  signalCounts: SignalCounts;
  getTicketName: (direction: 'CALL' | 'PUT' | 'NEUTRAL') => string;
}

export function SignalCountBadges({ signalCounts, getTicketName }: SignalCountBadgesProps) {
  return (
    <div className="flex justify-center gap-3 mb-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
      <div className="flex items-center gap-1">
        <Hash className="h-3.5 w-3.5 text-green-500" />
        <span className="text-xs font-medium text-green-600 dark:text-green-400">
          {getTicketName('CALL')}: {signalCounts.CALL || 0}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Hash className="h-3.5 w-3.5 text-red-500" />
        <span className="text-xs font-medium text-red-600 dark:text-red-400">
          {getTicketName('PUT')}: {signalCounts.PUT || 0}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Hash className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
          {getTicketName('NEUTRAL')}: {signalCounts.NEUTRAL || 0}
        </span>
      </div>
    </div>
  );
}
