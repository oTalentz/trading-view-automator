
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/context/LanguageContext';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { TriangleAlert, Check } from 'lucide-react';

interface ConfluenceHeatmapProps {
  analysis: MultiTimeframeAnalysisResult | null;
}

export function ConfluenceHeatmap({ analysis }: ConfluenceHeatmapProps) {
  const { t } = useLanguage();
  
  if (!analysis) return null;
  
  const { overallConfluence, confluenceDirection, timeframes } = analysis;
  
  // Define color intensity based on confluence level
  const getConfluenceColor = (direction: 'CALL' | 'PUT' | 'NEUTRAL', level: number) => {
    if (direction === 'NEUTRAL') return 'bg-gray-200 dark:bg-gray-700';
    
    const intensity = Math.min(Math.round(level / 10) * 10, 90);
    
    if (direction === 'CALL') {
      return `bg-green-${intensity} dark:bg-green-${intensity}/90`;
    } else {
      return `bg-red-${intensity} dark:bg-red-${intensity}/90`;
    }
  };
  
  const getDirectionIcon = (direction: 'CALL' | 'PUT' | 'NEUTRAL') => {
    switch (direction) {
      case 'CALL':
        return <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-1">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>;
      case 'PUT':
        return <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-1">
          <Check className="h-4 w-4 text-red-600 dark:text-red-400" rotate={180} />
        </div>;
      default:
        return <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-1">
          <TriangleAlert className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </div>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {t("confluenceHeatmap")} ({overallConfluence}%)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col space-y-2">
          {/* Overall confluence */}
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium w-24">{t("overall")}</div>
            <div className={`h-6 flex-1 rounded-md ${getConfluenceColor(confluenceDirection, overallConfluence)} flex items-center justify-center`}>
              <div className="flex items-center gap-2">
                {getDirectionIcon(confluenceDirection)}
                <span className="text-xs font-medium text-white">{confluenceDirection} ({overallConfluence}%)</span>
              </div>
            </div>
          </div>
          
          {/* Timeframe specific confluences */}
          {timeframes.map((tf, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="text-xs font-medium w-24">{tf.label}</div>
              <div className={`h-6 flex-1 rounded-md ${getConfluenceColor(tf.direction, tf.confidence)} flex items-center justify-center`}>
                <div className="flex items-center gap-2">
                  {getDirectionIcon(tf.direction)}
                  <span className="text-xs font-medium text-white">{tf.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
