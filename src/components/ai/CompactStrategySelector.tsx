
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap } from 'lucide-react';
import { useMarketAnalysis } from '@/hooks/useMarketAnalysis';

interface CompactStrategySelectorProps {
  symbol: string;
  interval?: string;
  className?: string;
}

export function CompactStrategySelector({
  symbol,
  interval = "1",
  className = ""
}: CompactStrategySelectorProps) {
  const { analysis } = useMarketAnalysis(symbol, interval);
  const { t } = useLanguage();
  
  if (!analysis) {
    return (
      <div className={`bg-gray-900 border border-gray-800 rounded-lg shadow-xl text-white h-full transform perspective-[1000px] transition-all duration-500 ${className}`}>
        <div className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-lg">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {t("mlStrategySelector")}
          </h3>
        </div>
        <div className="p-4">
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            {t("analyzingMarket")}...
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg shadow-xl text-white h-full transform perspective-[1000px] transition-all duration-500 ${className}`}>
      <div className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary animate-pulse" />
          {t("mlStrategySelector")}
        </h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center transform hover:rotate-y-1 hover:scale-[1.02] transition-transform">
          <h3 className="text-base font-medium">{analysis.strategy}</h3>
          <Badge className="bg-blue-500/80 text-white border-0 text-xs shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            {analysis.mlConfidenceScore || Math.round(analysis.confidence / 1.2)}% {t("mlScore")}
          </Badge>
        </div>
        
        <div className="space-y-1 transform hover:scale-[1.02] hover:rotate-y-1 transition-transform">
          <div className="flex justify-between text-xs">
            <span>{t("strategyConfidence")}</span>
            <span>{analysis.confidence}%</span>
          </div>
          <Progress 
            value={analysis.confidence} 
            className="h-2 bg-gray-800"
            indicatorClassName={
              analysis.confidence > 80 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : 
              analysis.confidence > 65 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" : 
              "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
            }
          />
        </div>
        
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-gray-300 text-xs">
            <Zap className="h-3 w-3 animate-pulse text-amber-400" />
            <span>{t("indicators")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.indicators.slice(0, 3).map((indicator, index) => (
              <Badge 
                key={index}
                variant="outline"
                className="font-normal bg-gray-800/50 border-gray-700 text-gray-200 text-xs transform hover:scale-110 hover:rotate-y-3 transition-transform shadow-md"
              >
                {indicator}
              </Badge>
            ))}
          </div>
        </div>
        
        {analysis.validationDetails?.reasons && (
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-gray-300 text-xs">
              <span>{t("selectionRationale")}</span>
            </div>
            <ul className="space-y-1 pl-4 list-disc text-xs">
              {analysis.validationDetails.reasons.slice(0, 2).map((reason, index) => (
                <li key={index} className="text-gray-400 transform hover:scale-[1.02] hover:translate-x-1 transition-transform">
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
