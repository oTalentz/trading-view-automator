
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SectionHeader } from './SectionHeader';
import { CollapsibleCard } from './CollapsibleCard';
import { SummaryCards } from './SummaryCards';
import { BarChart2, LineChart } from 'lucide-react';

type MetricsSectionProps = {
  expanded: boolean;
  toggleSection: (section: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  totalSignals: number;
  completedSignals: number;
  winningSignals: number;
  winRate: number;
  timeframeData: any[];
  callSignalsPercentage: number;
  putSignalsPercentage: number;
};

export function MetricsSection({
  expanded,
  toggleSection,
  favorites,
  toggleFavorite,
  totalSignals,
  completedSignals,
  winningSignals,
  winRate,
  timeframeData,
  callSignalsPercentage,
  putSignalsPercentage
}: MetricsSectionProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-3">
      <SectionHeader icon={BarChart2} title={t("technicalAnalysis")} />
      
      <CollapsibleCard
        title={t("performanceMetrics")}
        icon={LineChart}
        defaultExpanded={expanded}
        id="performanceMetrics"
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      >
        <SummaryCards 
          totalSignals={totalSignals}
          completedSignals={completedSignals}
          winningSignals={winningSignals}
          winRate={winRate}
          timeframeData={timeframeData}
          callSignalsPercentage={callSignalsPercentage}
          putSignalsPercentage={putSignalsPercentage}
        />
      </CollapsibleCard>
    </div>
  );
}
