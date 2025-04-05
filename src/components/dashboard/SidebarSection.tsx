
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SectionHeader } from './SectionHeader';
import { MLStrategySelector } from '@/components/MLStrategySelector';
import { MachineLearningInsights } from '@/components/MachineLearningInsights';
import { BrainCircuit, Settings, ZapIcon } from 'lucide-react';
import { SignalIndicator } from '@/components/SignalIndicator';

type SidebarSectionProps = {
  selectedSymbol: string;
};

export function SidebarSection({ selectedSymbol }: SidebarSectionProps) {
  const { t } = useLanguage();
  
  return (
    <div className="lg:col-span-4 space-y-3">
      <div className="mb-6 transform perspective-1000 hover:scale-105 transition-transform duration-300">
        <SectionHeader icon={ZapIcon} title={t("entrySignal")} className="text-lg font-bold text-amber-500" />
        <SignalIndicator symbol={selectedSymbol} interval="1" />
      </div>
      
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
