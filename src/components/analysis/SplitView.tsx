
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { AnalysisCard } from '@/components/analysis/types';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, LayoutGrid, PanelLeft, PanelTop } from "lucide-react";

interface SplitViewProps {
  cards: AnalysisCard[];
  selectedCards: string[];
  setSelectedCards: React.Dispatch<React.SetStateAction<string[]>>;
  splitLayout?: 'vertical' | 'horizontal' | 'grid';
  cycleSplitLayout?: () => void;
}

export function SplitView({ 
  cards, 
  selectedCards, 
  setSelectedCards,
  splitLayout = 'vertical',
  cycleSplitLayout
}: SplitViewProps) {
  const { t } = useLanguage();
  
  const selectedCardObjects = cards.filter(card => selectedCards.includes(card.id));
  
  const handleToggleCard = (cardId: string) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        // Don't remove if it's the last card
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== cardId);
      }
      
      // Don't add if we already have 3 cards
      if (prev.length >= 3) return prev;
      
      return [...prev, cardId];
    });
  };

  const getLayoutIcon = () => {
    switch (splitLayout) {
      case 'vertical': return <PanelLeft className="h-3.5 w-3.5" />;
      case 'horizontal': return <PanelTop className="h-3.5 w-3.5" />;
      case 'grid': return <LayoutGrid className="h-3.5 w-3.5" />;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-700 bg-gray-800/80">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">
              {t('selectedCards')}: <Badge variant="outline" className="ml-1 px-2 py-0.5 h-6 text-sm bg-primary/30 text-primary border-primary/30">
                {selectedCards.length}/3
              </Badge>
            </span>
            {cycleSplitLayout && (
              <Button
                variant="outline" 
                size="sm" 
                className="h-7 ml-2 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-gray-600 hover:text-white"
                onClick={cycleSplitLayout}
                title={t('changeLayout')}
              >
                {getLayoutIcon()}
                <span className="ml-1 text-xs">{
                  splitLayout === 'vertical' ? t('verticalLayout') : 
                  splitLayout === 'horizontal' ? t('horizontalLayout') : 
                  t('gridLayout')
                }</span>
              </Button>
            )}
          </div>
          <span className="text-xs text-gray-300">
            {t('clickToToggle')}
          </span>
        </div>
        
        <ScrollArea className="h-12 pb-1">
          <div className="flex gap-2 flex-wrap">
            {cards.map(card => {
              const isSelected = selectedCards.includes(card.id);
              return (
                <Badge 
                  key={card.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`
                    cursor-pointer transition-all duration-200 py-1.5 px-3 text-sm flex items-center gap-1.5
                    ${isSelected ? 'bg-primary/30 text-primary border border-primary/30 hover:bg-primary/40' : 'hover:bg-gray-700/60 border border-gray-600'}
                    ${!isSelected && selectedCards.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => handleToggleCard(card.id)}
                >
                  {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                  {card.title}
                </Badge>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      
      {splitLayout === 'grid' && selectedCardObjects.length > 0 ? (
        <div className={`grid gap-4 p-4 h-full overflow-auto ${
          selectedCardObjects.length === 1 ? 'grid-cols-1' : 
          selectedCardObjects.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
          'grid-cols-1 md:grid-cols-3'
        }`}>
          {selectedCardObjects.map((card) => (
            <div key={card.id} className="flex flex-col border border-gray-600 rounded-md overflow-hidden shadow-lg bg-gray-800/30 transition-all duration-300 hover:shadow-xl hover:border-gray-500">
              <div className="px-4 py-3 bg-gray-800/70 flex items-center justify-between border-b border-gray-700">
                <h3 className="text-base font-medium text-white">{card.title}</h3>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer h-6 w-6 p-0 flex items-center justify-center hover:bg-destructive/20 hover:text-destructive border-gray-600"
                  onClick={() => handleToggleCard(card.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Badge>
              </div>
              <div className="flex-1 overflow-auto p-4 min-h-[250px]">
                {card.component}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ResizablePanelGroup 
          direction={splitLayout === 'horizontal' ? "vertical" : "horizontal"}
          className="h-full"
        >
          {selectedCardObjects.map((card, index) => (
            <React.Fragment key={card.id}>
              <ResizablePanel defaultSize={100 / selectedCardObjects.length} minSize={25}>
                <div className="h-full flex flex-col border-gray-700 bg-gray-800/20">
                  <div className="px-4 py-3 bg-gray-800/70 flex items-center justify-between border-b border-gray-700">
                    <h3 className="text-base font-medium text-white">{card.title}</h3>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer h-6 w-6 p-0 flex items-center justify-center hover:bg-destructive/20 hover:text-destructive border-gray-600"
                      onClick={() => handleToggleCard(card.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Badge>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    {card.component}
                  </div>
                </div>
              </ResizablePanel>
              {index < selectedCardObjects.length - 1 && (
                <ResizableHandle withHandle className="bg-gray-600 hover:bg-gray-500" />
              )}
            </React.Fragment>
          ))}
        </ResizablePanelGroup>
      )}
    </div>
  );
}
