
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TimeRangeProps = {
  timeRange: '7d' | '30d' | 'all';
  setTimeRange: (value: '7d' | '30d' | 'all') => void;
};

export function TimeRangeSelector({ timeRange, setTimeRange }: TimeRangeProps) {
  const { t } = useLanguage();
  
  return (
    <Select value={timeRange} onValueChange={(value: '7d' | '30d' | 'all') => setTimeRange(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("selectTimeRange")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">{t("last7Days")}</SelectItem>
        <SelectItem value="30d">{t("last30Days")}</SelectItem>
        <SelectItem value="all">{t("allTime")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
