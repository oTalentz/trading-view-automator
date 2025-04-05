
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SectionHeader } from './SectionHeader';
import { UpcomingEventsCard } from './UpcomingEventsCard';
import { MLStrategySelector } from '@/components/MLStrategySelector';
import { BrainCircuit, Settings } from 'lucide-react';

type SidebarSectionProps = {
  selectedSymbol: string;
};

export function SidebarSection({ selectedSymbol }: SidebarSectionProps) {
  const { t } = useLanguage();
  
  return (
    <div className="lg:col-span-4 space-y-3">
      <SectionHeader icon={BrainCircuit} title={t("aiInsights")} />
      
      <UpcomingEventsCard />
      
      <div className="mt-6">
        <SectionHeader icon={Settings} title={t("configuration")} />
      </div>
      
      <MLStrategySelector symbol={selectedSymbol} interval="1" />
    </div>
  );
}
