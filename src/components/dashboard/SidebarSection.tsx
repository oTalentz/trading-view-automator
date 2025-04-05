
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SectionHeader } from './SectionHeader';
import { MLStrategySelector } from '@/components/MLStrategySelector';
import { MachineLearningInsights } from '@/components/MachineLearningInsights';
import { BrainCircuit, Settings } from 'lucide-react';

type SidebarSectionProps = {
  selectedSymbol: string;
};

export function SidebarSection({ selectedSymbol }: SidebarSectionProps) {
  const { t } = useLanguage();
  
  return (
    <div className="lg:col-span-4 space-y-3">
      <SectionHeader icon={BrainCircuit} title={t("aiInsights")} />
      
      <div className="space-y-4">
        <MLStrategySelector symbol={selectedSymbol} interval="1" />
        <MachineLearningInsights symbol={selectedSymbol} interval="1" />
      </div>
      
      <div className="mt-4">
        <SectionHeader icon={Settings} title={t("configuration")} />
      </div>
    </div>
  );
}
