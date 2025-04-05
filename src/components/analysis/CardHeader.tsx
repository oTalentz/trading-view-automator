
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SplitSquareVertical, LayoutGrid, Maximize2, Minimize2, PanelLeft, PanelTop } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AnalysisCard } from '@/components/analysis/types';

interface CardHeaderProps {
  activeIndex: number;
  cards: AnalysisCard[];
  viewMode: 'carousel' | 'split';
  selectedCards: string[];
  isExpanded: boolean;
  splitLayout?: 'vertical' | 'horizontal' | 'grid';
  toggleViewMode: () => void;
  setIsExpanded: (expanded: boolean) => void;
  cycleSplitLayout?: () => void;
}

export function CardHeader({
  activeIndex,
  cards,
  viewMode,
  selectedCards,
  isExpanded,
  splitLayout = 'vertical',
  toggleViewMode,
  setIsExpanded,
  cycleSplitLayout
}: CardHeaderProps) {
  const { t } = useLanguage();
  
  const getLayoutIcon = () => {
    switch (splitLayout) {
      case 'vertical': return <PanelLeft className="h-3.5 w-3.5" />;
      case 'horizontal': return <PanelTop className="h-3.5 w-3.5" />;
      case 'grid': return <LayoutGrid className="h-3.5 w-3.5" />;
    }
  };
  
  return (
    <div className="py-3 px-4 flex flex-row items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
      <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
        {viewMode === 'carousel' ? (
          <>
            <Badge variant="outline" className="px-2 py-0.5 h-6 text-sm bg-primary/20 text-primary border-primary/30">
              {activeIndex + 1}/{cards.length}
            </Badge>
            <span>{cards[activeIndex].title}</span>
          </>
        ) : (
          <>
            <Badge variant="outline" className="px-2 py-0.5 h-6 text-sm bg-primary/20 text-primary border-primary/30">
              {selectedCards.length}/3
            </Badge>
            <span className="text-white">{t('splitView')}</span>
          </>
        )}
      </CardTitle>
      <div className="flex items-center gap-2">
        {viewMode === 'split' && cycleSplitLayout && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={cycleSplitLayout}
            title={t('changeLayout')}
          >
            {getLayoutIcon()}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={toggleViewMode}
          title={viewMode === 'carousel' ? t('switchToSplitView') : t('switchToCarousel')}
        >
          {viewMode === 'carousel' 
            ? <SplitSquareVertical className="h-4 w-4" /> 
            : <LayoutGrid className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? t('minimize') : t('maximize')}
        >
          {isExpanded 
            ? <Minimize2 className="h-4 w-4" /> 
            : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
