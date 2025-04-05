
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TimeRangeSelector } from './TimeRangeSelector';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

type DashboardHeaderProps = {
  timeRange: '7d' | '30d' | 'all';
  setTimeRange: (value: '7d' | '30d' | 'all') => void;
};

export function DashboardHeader({ timeRange, setTimeRange }: DashboardHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">{t("performanceAnalytics")}</h2>
        <Link to="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            {t("returnToHome")}
          </Button>
        </Link>
      </div>
      <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
    </div>
  );
}
