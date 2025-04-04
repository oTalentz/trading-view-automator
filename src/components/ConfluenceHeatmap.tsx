
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/context/LanguageContext';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { CheckCircle2 } from 'lucide-react';

interface ConfluenceHeatmapProps {
  analysis: MultiTimeframeAnalysisResult | null;
}

export function ConfluenceHeatmap({ analysis }: ConfluenceHeatmapProps) {
  const { t } = useLanguage();
  
  if (!analysis) return null;
  
  const { overallConfluence, confluenceDirection, timeframes } = analysis;
  
  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-medium">
          {t("confluenceHeatmap")} ({overallConfluence}%)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0">
        <div className="flex flex-col space-y-2">
          {/* Overall confluence */}
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium w-24">overall</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium">{confluenceDirection} ({overallConfluence}%)</span>
            </div>
          </div>
          
          {/* Timeframe specific confluences */}
          {timeframes.map((tf, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="text-xs font-medium w-24">{tf.label}</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium">{tf.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
