
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Brain, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAIAnalysis } from '@/context/AIAnalysisContext';

interface CompactMLInsightsProps {
  symbol: string;
  interval: string;
  className?: string;
}

export function CompactMLInsights({ symbol, interval, className = "" }: CompactMLInsightsProps) {
  const { t } = useLanguage();
  const { mlPrediction, isLoadingPrediction, generatePrediction } = useAIAnalysis();
  
  React.useEffect(() => {
    // Generate prediction when component mounts
    if (symbol && interval) {
      generatePrediction(symbol, interval);
    }
    
    // Refresh prediction periodically
    const refreshInterval = setInterval(() => {
      if (symbol && interval) {
        generatePrediction(symbol, interval);
      }
    }, 60000); // Refresh every minute
    
    return () => clearInterval(refreshInterval);
  }, [symbol, interval, generatePrediction]);
  
  if (!mlPrediction) return null;
  
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg shadow-xl text-white h-full transform perspective-[1000px] transition-all duration-500 ${className}`}>
      <div className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" /> {t("machineLearningInsights")}
        </h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between transform hover:rotate-y-1 hover:scale-[1.02] transition-transform">
          <div className="flex items-center gap-2">
            {mlPrediction.direction === 'CALL' ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">{t("mlPrediction")}</span>
          </div>
          <Badge className={`${
            mlPrediction.direction === 'CALL' 
              ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' 
              : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
            } text-white`}>
            {mlPrediction.direction}
          </Badge>
        </div>
        
        <div className="space-y-1 transform hover:scale-[1.02] hover:rotate-y-1 transition-transform">
          <div className="flex justify-between text-xs">
            <span>{t("predictionConfidence")}</span>
            <span>{Math.round(mlPrediction.probability)}%</span>
          </div>
          <Progress 
            value={mlPrediction.probability} 
            className="h-2 bg-gray-800" 
            indicatorClassName={
              mlPrediction.direction === 'CALL'
                ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
            }
          />
        </div>
        
        <div>
          <h4 className="text-xs font-medium mb-2 text-gray-300">{t("detectedPatterns")}</h4>
          <div className="space-y-2">
            {mlPrediction.patterns.map((pattern, idx) => (
              <div key={idx} className="space-y-1 transform hover:scale-[1.02] hover:rotate-y-1 transition-transform">
                <div className="flex justify-between text-xs">
                  <span>{pattern.name}</span>
                  <span>{Math.round(pattern.reliability)}%</span>
                </div>
                <Progress 
                  value={pattern.reliability} 
                  className="h-1.5 bg-gray-800" 
                  indicatorClassName={
                    pattern.reliability > 80 ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : 
                    pattern.reliability > 70 ? "bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" : 
                    "bg-slate-500 shadow-[0_0_5px_rgba(148,163,184,0.5)]"
                  }
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-medium mb-2 text-gray-300">{t("predictionsAcrossTimeframes")}</h4>
          <div className="grid grid-cols-3 gap-2">
            {mlPrediction.timeframes.map((tf, idx) => (
              <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-md p-2 text-center transform hover:scale-105 hover:rotate-y-3 transition-transform shadow-md">
                <div className="text-xs font-medium mb-1">{tf.timeframe}</div>
                <Badge className={`${
                  tf.prediction === 'CALL' 
                    ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' 
                    : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'
                  } text-white text-xs`}>
                  {tf.prediction}
                </Badge>
                <div className="text-xs mt-1">{Math.round(tf.confidence)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
