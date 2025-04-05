
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { AnalysisCard } from '@/components/analysis/types';
import { useLanguage } from '@/context/LanguageContext';

interface CarouselViewProps {
  cards: AnalysisCard[];
  activeIndex: number;
  direction: number;
  handlePrev: () => void;
  handleNext: () => void;
  setDirection: (direction: number) => void;
  setActiveIndex: (index: number) => void;
}

export function CarouselView({ 
  cards, 
  activeIndex, 
  direction, 
  handlePrev, 
  handleNext, 
  setDirection, 
  setActiveIndex 
}: CarouselViewProps) {
  const { t } = useLanguage();
  
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

  return (
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
    </div>
  );
}
