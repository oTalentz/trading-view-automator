
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { AnalysisCard } from '@/components/analysis/types';
import { useLanguage } from '@/context/LanguageContext';

interface SplitViewProps {
  cards: AnalysisCard[];
  selectedCards: string[];
  setSelectedCards: (cards: string[]) => void;
}

export function SplitView({ cards, selectedCards, setSelectedCards }: SplitViewProps) {
  const { t } = useLanguage();
  
  const selectedCardObjects = cards.filter(card => selectedCards.includes(card.id));
  
  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-1 border-b border-gray-700 bg-gray-800/50">
        <ToggleGroup 
          type="multiple" 
          value={selectedCards} 
          onValueChange={setSelectedCards} 
          variant="outline" 
          className="justify-start h-7 gap-1"
        >
          {cards.map(card => (
            <ToggleGroupItem 
              key={card.id} 
              value={card.id}
              size="sm"
              className="text-xs h-6 px-2 data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
              disabled={!selectedCards.includes(card.id) && selectedCards.length >= 3}
            >
              {card.title.length > 15 ? `${card.title.substring(0, 15)}...` : card.title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      
      <ResizablePanelGroup 
        direction={selectedCards.length > 2 ? "vertical" : "horizontal"}
        className="h-full"
      >
        {selectedCardObjects.map((card, index) => (
          <React.Fragment key={card.id}>
            <ResizablePanel defaultSize={100 / selectedCardObjects.length}>
              <div className="h-full overflow-auto p-3">
                {card.component}
              </div>
            </ResizablePanel>
            {index < selectedCardObjects.length - 1 && (
              <ResizableHandle withHandle />
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );
}
