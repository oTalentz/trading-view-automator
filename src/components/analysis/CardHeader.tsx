
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SplitSquareVertical, LayoutGrid, Maximize2, Minimize2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AnalysisCard } from '@/components/analysis/types';

interface CardHeaderProps {
  activeIndex: number;
  cards: AnalysisCard[];
  viewMode: 'carousel' | 'split';
  selectedCards: string[];
  isExpanded: boolean;
  setViewMode: (mode: 'carousel' | 'split') => void;
  setIsExpanded: (expanded: boolean) => void;
}

export function CardHeader({
  activeIndex,
  cards,
  viewMode,
  selectedCards,
  isExpanded,
  setViewMode,
  setIsExpanded
}: CardHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="py-2 px-3 flex flex-row items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        {viewMode === 'carousel' ? (
          <>
            <Badge variant="outline" className="px-1.5 py-0 h-5 text-xs bg-primary/20 text-primary border-0">
              {activeIndex + 1}/{cards.length}
            </Badge>
            <span>{cards[activeIndex].title}</span>
          </>
        ) : (
          <>
            <Badge variant="outline" className="px-1.5 py-0 h-5 text-xs bg-primary/20 text-primary border-0">
              {selectedCards.length}
            </Badge>
            <span>{t('splitView')}</span>
          </>
        )}
      </CardTitle>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground"
          onClick={() => setViewMode(viewMode === 'carousel' ? 'split' : 'carousel')}
          title={viewMode === 'carousel' ? t('switchToSplitView') : t('switchToCarousel')}
        >
          {viewMode === 'carousel' 
            ? <SplitSquareVertical className="h-3.5 w-3.5" /> 
            : <LayoutGrid className="h-3.5 w-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? t('minimize') : t('maximize')}
        >
          {isExpanded 
            ? <Minimize2 className="h-3.5 w-3.5" /> 
            : <Maximize2 className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}
