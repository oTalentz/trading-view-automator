
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PanelTop, LayoutGrid } from 'lucide-react';
import { ConfluenceHeatmap } from '@/components/ConfluenceHeatmap';
import { MLStrategySelector } from '@/components/MLStrategySelector';
import { CompactMLInsights } from '@/components/ai/CompactMLInsights';
import { CorrelationAnalysis } from '@/components/CorrelationAnalysis';
import { AIStrategyInsights } from '@/components/AIStrategyInsights';
import { createMockAnalysis } from '@/utils/dashboard/dashboardDataUtils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompactAnalysisCardsProps {
  symbol: string;
  interval: string;
  className?: string;
}

export function CompactAnalysisCards({ symbol, interval, className = "" }: CompactAnalysisCardsProps) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const mockAnalysis = createMockAnalysis();
  
  const cards = [
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
  
  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };
  
  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      rotateY: direction > 0 ? -15 : 15,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
      rotateY: direction < 0 ? -15 : 15,
      scale: 0.95,
      transition: {
        duration: 0.4,
      },
    }),
  };
  
  const [direction, setDirection] = useState(0);
  
  const handleNext = () => {
    setDirection(1);
    nextCard();
  };
  
  const handlePrev = () => {
    setDirection(-1);
    prevCard();
  };

  return (
    <Card className={`border border-gray-800 ${className} overflow-hidden shadow-xl transform perspective-[1000px] transition-all duration-500 ${isExpanded ? 'h-[500px]' : 'h-[280px]'}`}>
      <CardHeader className="py-2 px-3 flex flex-row items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Badge variant="outline" className="px-1.5 py-0 h-5 text-xs bg-primary/20 text-primary border-0">
            {activeIndex + 1}/{cards.length}
          </Badge>
          <span>{cards[activeIndex].title}</span>
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <LayoutGrid className="h-3.5 w-3.5" /> : <PanelTop className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 relative h-full overflow-hidden">
        <div className="relative h-full overflow-hidden">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full p-3"
          >
            {cards[activeIndex].component}
          </motion.div>
          
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 h-6 w-6 bg-background/60 backdrop-blur-sm hover:bg-background/80 shadow-lg"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 h-6 w-6 bg-background/60 backdrop-blur-sm hover:bg-background/80 shadow-lg"
            onClick={handleNext}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
          {cards.map((card, index) => (
            <Button
              key={card.id}
              variant="ghost"
              size="sm"
              className={`h-1.5 w-1.5 p-0 rounded-full ${index === activeIndex ? "bg-primary" : "bg-muted"}`}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
