
import { useState } from 'react';
import { AnalysisCard } from '@/components/analysis/types';

export const useCardNavigation = (cards: AnalysisCard[]) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedCards, setSelectedCards] = useState<string[]>(['confluence', 'strategy']);
  const [viewMode, setViewMode] = useState<'carousel' | 'split'>('carousel');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };
  
  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };
  
  const handleNext = () => {
    setDirection(1);
    nextCard();
  };
  
  const handlePrev = () => {
    setDirection(-1);
    prevCard();
  };
  
  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== cardId);
      }
      if (prev.length < 3) {
        return [...prev, cardId];
      }
      return prev;
    });
  };
  
  return {
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
    nextCard,
    prevCard,
    handleNext,
    handlePrev,
    toggleCardSelection
  };
};
