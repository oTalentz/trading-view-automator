
import React from 'react';
import { TimeRangeSelector } from './TimeRangeSelector';
import { TimeframeFilter } from './TimeframeFilter';

type DashboardFiltersProps = {
  timeRange: '7d' | '30d' | 'all';
  setTimeRange: (value: '7d' | '30d' | 'all') => void;
  timeframeFilter: string;
  setTimeframeFilter: (value: string) => void;
  timeframeOptions: string[];
};

export function DashboardFilters({
  timeRange,
  setTimeRange,
  timeframeFilter,
  setTimeframeFilter,
  timeframeOptions
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
      {/* Timeframe Quick Filters */}
      <div className="flex-1 md:flex-initial">
        <TimeframeFilter 
          timeframeFilter={timeframeFilter} 
          setTimeframeFilter={setTimeframeFilter} 
          timeframeOptions={timeframeOptions} 
        />
      </div>
      
      {/* Period selector */}
      <div className="flex-1 md:flex-initial">
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>
    </div>
  );
}
