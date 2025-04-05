
import { useState, useEffect } from 'react';
import { AnalysisCard } from '@/components/analysis/types';

export const useCardNavigation = (cards: AnalysisCard[]) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedCards, setSelectedCards] = useState<string[]>(['confluence', 'strategy']);
  const [viewMode, setViewMode] = useState<'carousel' | 'split'>('carousel');
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded view
  const [splitLayout, setSplitLayout] = useState<'vertical' | 'horizontal' | 'grid'>('grid'); // Default to grid for better visibility
  
  // Ensure we always have at least one selected card
  useEffect(() => {
    if (selectedCards.length === 0 && cards.length > 0) {
      setSelectedCards([cards[0].id]);
    }
  }, [selectedCards, cards]);
  
  // Automatically adjust layout based on number of selected cards
  useEffect(() => {
    if (selectedCards.length > 2) {
      setSplitLayout('grid');
    }
  }, [selectedCards.length]);
  
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
  
  // Add the current card to the selected cards when switching from carousel to split view
  const toggleViewMode = () => {
    if (viewMode === 'carousel') {
      // When switching to split view, make sure the current card is included
      if (!selectedCards.includes(cards[activeIndex].id)) {
        // If we already have 3 cards, replace the last one
        if (selectedCards.length >= 3) {
          setSelectedCards([...selectedCards.slice(0, 2), cards[activeIndex].id]);
        } else {
          setSelectedCards([...selectedCards, cards[activeIndex].id]);
        }
      }
      setViewMode('split');
    } else {
      setViewMode('carousel');
    }
  };
  
  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prev) => {
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
  
  const cycleSplitLayout = () => {
    setSplitLayout(prev => {
      if (prev === 'vertical') return 'horizontal';
      if (prev === 'horizontal') return 'grid';
      return 'vertical';
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
    splitLayout,
    setSplitLayout,
    nextCard,
    prevCard,
    handleNext,
    handlePrev,
    toggleCardSelection,
    toggleViewMode,
    cycleSplitLayout
  };
};
