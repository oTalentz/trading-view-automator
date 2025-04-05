
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ConfluenceHeatmap } from '@/components/ConfluenceHeatmap';
import { CompactStrategySelector } from '@/components/ai/CompactStrategySelector';
import { CompactMLInsights } from '@/components/ai/CompactMLInsights';
import { AIStrategyInsights } from '@/components/AIStrategyInsights';
import { createMockAnalysis } from '@/utils/dashboard/dashboardDataUtils';
import { motion } from 'framer-motion';

interface AnalysisCarouselProps {
  symbol: string;
  interval: string;
}

export function AnalysisCarousel({ symbol, interval }: AnalysisCarouselProps) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
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
      component: <CompactStrategySelector symbol={symbol} interval={interval} className="h-full" />
    },
    {
      id: 'insights',
      title: t('machineLearningInsights'),
      component: <CompactMLInsights symbol={symbol} interval={interval} className="h-full" />
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
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      rotateY: direction > 0 ? -20 : 20,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      rotateY: direction < 0 ? -20 : 20,
      transition: {
        duration: 0.5,
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
    <div className="space-y-4">
      <div className="relative h-[300px] overflow-hidden rounded-lg shadow-xl perspective-1000">
        <motion.div
          key={activeIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {cards[activeIndex].component}
        </motion.div>
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-lg"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-lg"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-center gap-1">
        {cards.map((card, index) => (
          <Button
            key={card.id}
            variant={index === activeIndex ? "default" : "outline"}
            size="sm"
            className={`h-2 w-2 p-0 rounded-full ${index === activeIndex ? "bg-primary" : "bg-muted"}`}
            onClick={() => {
              setDirection(index > activeIndex ? 1 : -1);
              setActiveIndex(index);
            }}
          />
        ))}
      </div>
      
      <div className="text-center text-sm font-medium">
        {cards[activeIndex].title}
      </div>
    </div>
  );
}
