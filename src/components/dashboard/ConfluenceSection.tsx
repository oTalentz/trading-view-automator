
import React from 'react';
import { ConfluenceHeatmap } from '@/components/ConfluenceHeatmap';
import { TimeframeConfluence } from '@/components/TimeframeConfluence';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { Card, CardContent } from "@/components/ui/card";

type ConfluenceSectionProps = {
  mockAnalysis: MultiTimeframeAnalysisResult;
};

export function ConfluenceSection({ mockAnalysis }: ConfluenceSectionProps) {
  return (
    <div className="space-y-4">
      <ConfluenceHeatmap analysis={mockAnalysis} />
      
      <Card className="bg-orange-500/90 dark:bg-orange-600/80 border-none text-white">
        <CardContent className="p-6 min-h-[140px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Card Content Area 1</h3>
            <p>Este é o primeiro cartão de conteúdo na área vermelha</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-orange-500/90 dark:bg-orange-600/80 border-none text-white">
        <CardContent className="p-6 min-h-[140px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Card Content Area 2</h3>
            <p>Este é o segundo cartão de conteúdo na área vermelha</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
