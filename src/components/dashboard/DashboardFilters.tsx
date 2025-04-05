
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TimeRangeSelector } from './TimeRangeSelector';
import { TimeframeFilter } from './TimeframeFilter';

export interface DashboardFiltersProps {
  timeRange: '7d' | '30d' | 'all';
  setTimeRange: (value: '7d' | '30d' | 'all') => void;
  timeframeFilter: string;
  setTimeframeFilter: (value: string) => void;
  timeframeOptions: string[];
  className?: string;
}

export function DashboardFilters({
  timeRange,
  setTimeRange,
  timeframeFilter,
  setTimeframeFilter,
  timeframeOptions,
  className = ""
}: DashboardFiltersProps) {
  const { t } = useLanguage();
  
  return (
    <div className={`flex flex-col xs:flex-row gap-2 items-center ${className}`}>
      <TimeRangeSelector 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        buttonClassName="h-8"
      />
      <TimeframeFilter
        timeframeFilter={timeframeFilter}
        setTimeframeFilter={setTimeframeFilter}
        timeframeOptions={timeframeOptions}
        className="h-8"
      />
    </div>
  );
}
