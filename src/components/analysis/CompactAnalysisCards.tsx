
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { ConfluenceHeatmap } from '@/components/ConfluenceHeatmap';
import { MLStrategySelector } from '@/components/MLStrategySelector';
import { CompactMLInsights } from '@/components/ai/CompactMLInsights';
import { CorrelationAnalysis } from '@/components/CorrelationAnalysis';
import { AIStrategyInsights } from '@/components/AIStrategyInsights';
import { createMockAnalysis } from '@/utils/dashboard/dashboardDataUtils';
import { AnalysisCard } from '@/components/analysis/types';
import { CardHeader } from '@/components/analysis/CardHeader';
import { CarouselView } from '@/components/analysis/CarouselView';
import { SplitView } from '@/components/analysis/SplitView';
import { useCardNavigation } from '@/components/analysis/useCardNavigation';

interface CompactAnalysisCardsProps {
  symbol: string;
  interval: string;
  className?: string;
}

export function CompactAnalysisCards({ symbol, interval, className = "" }: CompactAnalysisCardsProps) {
  const { t } = useLanguage();
  const mockAnalysis = createMockAnalysis();
  
  const cards: AnalysisCard[] = [
    {
      id: 'confluence',
      title: t('confluenceHeatmap'),
      component: <ConfluenceHeatmap analysis={mockAnalysis} />
    },
    {
      id: 'strategy',
      title: t('mlStrategySelector'),
      component: <MLStrategySelector symbol={symbol} interval={interval} />
    },
    {
      id: 'insights',
      title: t('machineLearningInsights'),
      component: <CompactMLInsights symbol={symbol} interval={interval} className="h-full" />
    },
    {
      id: 'correlation',
      title: t('assetCorrelation'),
      component: <CorrelationAnalysis symbol={symbol} />
    },
    {
      id: 'ai-insights',
      title: t('aiStrategyInsights'),
      component: <AIStrategyInsights symbol={symbol} />
    }
  ];
  
  const {
    activeIndex,
    setActiveIndex,
    direction,
    setDirection,
    selectedCards,
    setSelectedCards,
    viewMode,
    setViewMode,
    isExpanded,
    setIsExpanded,
    splitLayout,
    cycleSplitLayout,
    handleNext,
    handlePrev,
    toggleViewMode
  } = useCardNavigation(cards);

  return (
    <Card className={`border border-gray-800 ${className} overflow-hidden shadow-xl transform perspective-[1000px] transition-all duration-500 ${isExpanded ? 'h-[700px]' : 'h-[320px]'}`}>
      <CardHeader 
        activeIndex={activeIndex}
        cards={cards}
        viewMode={viewMode}
        selectedCards={selectedCards}
        isExpanded={isExpanded}
        splitLayout={splitLayout}
        toggleViewMode={toggleViewMode}
        setIsExpanded={setIsExpanded}
        cycleSplitLayout={cycleSplitLayout}
      />
      
      <CardContent className="p-0 relative h-full overflow-hidden">
        {viewMode === 'carousel' ? (
          <CarouselView 
            cards={cards} 
            activeIndex={activeIndex} 
            direction={direction} 
            handlePrev={handlePrev} 
            handleNext={handleNext} 
            setDirection={setDirection} 
            setActiveIndex={setActiveIndex}
          />
        ) : (
          <SplitView 
            cards={cards} 
            selectedCards={selectedCards} 
            setSelectedCards={setSelectedCards}
            splitLayout={splitLayout}
            cycleSplitLayout={cycleSplitLayout}
          />
        )}
      </CardContent>
    </Card>
  );
}
