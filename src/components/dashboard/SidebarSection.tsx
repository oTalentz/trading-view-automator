
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SectionHeader } from './SectionHeader';
import { AnalysisCarousel } from '@/components/analysis/AnalysisCarousel';
import { BrainCircuit, Settings, ZapIcon } from 'lucide-react';
import { SignalIndicator } from '@/components/SignalIndicator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

type SidebarSectionProps = {
  selectedSymbol: string;
};

export function SidebarSection({ selectedSymbol }: SidebarSectionProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(true);
  
  return (
    <div className="lg:col-span-4 space-y-3">
      <div className="mb-6 transform perspective-1000 hover:scale-105 transition-transform duration-300">
        <SectionHeader icon={ZapIcon} title={t("entrySignal")} className="text-lg font-bold text-amber-500" />
        <SignalIndicator symbol={selectedSymbol} interval="1" />
      </div>
      
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border rounded-lg shadow-lg transform perspective-1000 hover:rotate-y-2 transition-transform duration-300"
      >
        <div className="p-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-t-lg border-b">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <SectionHeader icon={BrainCircuit} title={t("aiInsights")} className="mb-0" />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="p-3">
            <AnalysisCarousel symbol={selectedSymbol} interval="1" />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="mt-4">
        <SectionHeader icon={Settings} title={t("configuration")} />
      </div>
    </div>
  );
}
