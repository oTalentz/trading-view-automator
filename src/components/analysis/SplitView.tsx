
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
      <div className="p-2 border-b border-gray-700 bg-gray-800/50">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {t('selectedCards')}: <Badge variant="outline" className="ml-1 px-1.5 py-0 h-5 text-xs bg-primary/20 text-primary border-0">
                {selectedCards.length}/3
              </Badge>
            </span>
            {cycleSplitLayout && (
              <Button
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-muted-foreground"
                onClick={cycleSplitLayout}
                title={t('changeLayout')}
              >
                {getLayoutIcon()}
              </Button>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {t('clickToToggle')}
          </span>
        </div>
        
        <ScrollArea className="h-10">
          <div className="flex gap-1.5 flex-wrap">
            {cards.map(card => {
              const isSelected = selectedCards.includes(card.id);
              return (
                <Badge 
                  key={card.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`
                    cursor-pointer transition-all duration-200 py-1 px-2 flex items-center gap-1
                    ${isSelected ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'hover:bg-primary/10'}
                    ${!isSelected && selectedCards.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => handleToggleCard(card.id)}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                  {card.title}
                </Badge>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      
      {splitLayout === 'grid' && selectedCardObjects.length > 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 h-full overflow-auto">
          {selectedCardObjects.map((card) => (
            <div key={card.id} className="flex flex-col border border-gray-700 rounded-md overflow-hidden">
              <div className="px-3 py-2 bg-gray-800/30 flex items-center justify-between">
                <h3 className="text-sm font-medium">{card.title}</h3>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer h-5 w-5 p-0 flex items-center justify-center hover:bg-destructive/20 hover:text-destructive"
                  onClick={() => handleToggleCard(card.id)}
                >
                  <X className="h-3 w-3" />
                </Badge>
              </div>
              <div className="flex-1 overflow-auto p-3 min-h-[100px]">
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
              <ResizablePanel defaultSize={100 / selectedCardObjects.length}>
                <div className="h-full flex flex-col">
                  <div className="px-3 py-2 bg-gray-800/30 flex items-center justify-between">
                    <h3 className="text-sm font-medium">{card.title}</h3>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer h-5 w-5 p-0 flex items-center justify-center hover:bg-destructive/20 hover:text-destructive"
                      onClick={() => handleToggleCard(card.id)}
                    >
                      <X className="h-3 w-3" />
                    </Badge>
                  </div>
                  <div className="flex-1 overflow-auto p-3">
                    {card.component}
                  </div>
                </div>
              </ResizablePanel>
              {index < selectedCardObjects.length - 1 && (
                <ResizableHandle withHandle className="bg-gray-700" />
              )}
            </React.Fragment>
          ))}
        </ResizablePanelGroup>
      )}
    </div>
  );
}
