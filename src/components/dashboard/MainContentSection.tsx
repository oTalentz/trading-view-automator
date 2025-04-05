
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SectionHeader } from './SectionHeader';
import { CollapsibleCard } from './CollapsibleCard';
import { ConfluenceSection } from './ConfluenceSection';
import { AnalyticsTabs } from './AnalyticsTabs';
import { ExternalLink, Clock, LayoutDashboard } from 'lucide-react';

type MainContentSectionProps = {
  expandedSections: {
    confluence: boolean;
    analytics: boolean;
  };
  toggleSection: (section: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  mockAnalysis: any;
  resultData: any[];
  timeframeData: any[];
  timeSeriesData: any[];
  confidenceData: any[];
};

export function MainContentSection({
  expandedSections,
  toggleSection,
  favorites,
  toggleFavorite,
  mockAnalysis,
  resultData,
  timeframeData,
  timeSeriesData,
  confidenceData
}: MainContentSectionProps) {
  const { t } = useLanguage();
  
  return (
    <div className="lg:col-span-8 space-y-3">
      <SectionHeader icon={ExternalLink} title={t("marketSignals")} />
      
      <CollapsibleCard
        title={t("marketConfluence")}
        icon={Clock}
        defaultExpanded={expandedSections.confluence}
        id="marketConfluence"
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      >
        <ConfluenceSection mockAnalysis={mockAnalysis} />
      </CollapsibleCard>
      
      <CollapsibleCard
        title={t("analyticsInsights")}
        icon={LayoutDashboard}
        defaultExpanded={expandedSections.analytics}
        id="analyticsInsights"
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      >
        <AnalyticsTabs 
          resultData={resultData}
          timeframeData={timeframeData}
          timeSeriesData={timeSeriesData}
          confidenceData={confidenceData}
        />
      </CollapsibleCard>
    </div>
  );
}
