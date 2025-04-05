
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/context/LanguageContext';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ConfluenceHeatmapProps {
  analysis: MultiTimeframeAnalysisResult | null;
}

export function ConfluenceHeatmap({ analysis }: ConfluenceHeatmapProps) {
  const { t } = useLanguage();
  
  if (!analysis) return null;
  
  const { overallConfluence, confluenceDirection, timeframes } = analysis;
  
  // Helper function to get the appropriate icon based on confidence
  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 70) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (confidence >= 40) return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };
  
  // Helper function to get the appropriate color based on confidence
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "text-green-500";
    if (confidence >= 40) return "text-amber-500";
    return "text-red-500";
  };
  
  // Show only 3 most important timeframes to avoid overloading with information
  const prioritizedTimeframes = [...timeframes]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
  
  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>{t("confluenceHeatmap")}</span>
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
            overallConfluence >= 70 ? "bg-green-500/20 text-green-400" : 
            overallConfluence >= 40 ? "bg-amber-500/20 text-amber-400" : 
            "bg-red-500/20 text-red-400"
          }`}>
            {overallConfluence}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0">
        <div className="flex flex-col space-y-2">
          {/* Overall confluence */}
          <div className="flex items-center justify-between gap-2 p-2 bg-gray-800/50 rounded-md">
            <div className="text-sm font-medium">{t("overall")}</div>
            <div className="flex items-center gap-2">
              {getConfidenceIcon(overallConfluence)}
              <span className={`text-sm font-medium ${getConfidenceColor(overallConfluence)}`}>
                {confluenceDirection} ({overallConfluence}%)
              </span>
            </div>
          </div>
          
          {/* Timeframe specific confluences - show only top 3 */}
          {prioritizedTimeframes.map((tf, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between gap-2 p-2 bg-gray-800/50 rounded-md"
            >
              <div className="text-sm font-medium">{tf.label}</div>
              <div className="flex items-center gap-2">
                {getConfidenceIcon(tf.confidence)}
                <span className={`text-sm font-medium ${getConfidenceColor(tf.confidence)}`}>
                  {tf.confidence}%
                </span>
              </div>
            </div>
          ))}
          
          {/* Indicator to show there are more timeframes */}
          {timeframes.length > 3 && (
            <div className="text-xs text-center text-gray-400 mt-1">
              {t("andXMoreTimeframes", { count: timeframes.length - 3 })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
