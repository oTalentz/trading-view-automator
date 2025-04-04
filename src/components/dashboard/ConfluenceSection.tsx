
import React from 'react';
import { ConfluenceHeatmap } from '@/components/ConfluenceHeatmap';
import { TimeframeConfluence } from '@/components/TimeframeConfluence';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';

type ConfluenceSectionProps = {
  mockAnalysis: MultiTimeframeAnalysisResult;
};

export function ConfluenceSection({ mockAnalysis }: ConfluenceSectionProps) {
  return (
    <div>
      <ConfluenceHeatmap analysis={mockAnalysis} />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <TimeframeConfluence 
          timeframes={mockAnalysis.timeframes}
          overallConfluence={mockAnalysis.overallConfluence}
          confluenceDirection={mockAnalysis.confluenceDirection}
          currentTimeframe="5m"
        />
      </div>
    </div>
  );
}
