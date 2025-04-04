
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TimeRangeSelector } from './TimeRangeSelector';

type DashboardHeaderProps = {
  timeRange: '7d' | '30d' | 'all';
  setTimeRange: (value: '7d' | '30d' | 'all') => void;
};

export function DashboardHeader({ timeRange, setTimeRange }: DashboardHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between mb-6">
      <h2 className="text-2xl font-bold">{t("performanceAnalytics")}</h2>
      <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
    </div>
  );
}
