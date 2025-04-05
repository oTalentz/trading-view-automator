
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { Gauge } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { SignalIndicator } from '@/components/SignalIndicator';
import { CompactAnalysisCards } from '@/components/analysis/CompactAnalysisCards';

type SidebarSectionProps = {
  selectedSymbol: string;
};

export function SidebarSection({ selectedSymbol }: SidebarSectionProps) {
  const { t } = useLanguage();
  
  return (
    <div className="lg:col-span-4 space-y-4">
      <SectionHeader 
        icon={Gauge} 
        title={t("currentSignal")} 
      />
      
      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <CardContent className="p-4">
          <div className="space-y-4">
            <SignalIndicator 
              symbol={`BINANCE:${selectedSymbol}`} 
              interval="15" 
            />
            
            <CompactAnalysisCards 
              symbol={selectedSymbol} 
              interval="15"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
