
import React from 'react';
import { DashboardHeaderTitle } from './DashboardHeaderTitle';
import { DashboardFilters } from './DashboardFilters';

type DashboardHeaderProps = {
  timeRange: '7d' | '30d' | 'all';
  setTimeRange: (value: '7d' | '30d' | 'all') => void;
  timeframeFilter: string;
  setTimeframeFilter: (value: string) => void;
  timeframeOptions: string[];
};

export function DashboardHeader({
  timeRange,
  setTimeRange,
  timeframeFilter,
  setTimeframeFilter,
  timeframeOptions
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <DashboardHeaderTitle />
      <DashboardFilters 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        timeframeFilter={timeframeFilter}
        setTimeframeFilter={setTimeframeFilter}
        timeframeOptions={timeframeOptions}
      />
    </div>
  );
}
