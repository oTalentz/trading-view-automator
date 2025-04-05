
import React from 'react';
import { DashboardHeaderTitle } from './DashboardHeaderTitle';
import { DashboardFilters } from './DashboardFilters';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Home className="h-4 w-4" />
          </Button>
        </Link>
        <DashboardHeaderTitle />
      </div>
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
