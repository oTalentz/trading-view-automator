
import React, { useState, useEffect } from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';

type ConfluenceHeatmapProps = {
  analysis: MultiTimeframeAnalysisResult;
};

export function ConfluenceHeatmap({ analysis }: ConfluenceHeatmapProps) {
  const { t } = useLanguage();
  const [timeframeAnalysis, setTimeframeAnalysis] = useState([
    { timeframe: '1m', bullish: 55, bearish: 45 },
    { timeframe: '5m', bullish: 58, bearish: 42 },
    { timeframe: '15m', bullish: 60, bearish: 40 },
    { timeframe: '30m', bullish: 70, bearish: 30 },
    { timeframe: '1h', bullish: 55, bearish: 45 },
    { timeframe: '4h', bullish: 80, bearish: 20 },
    { timeframe: '1D', bullish: 65, bearish: 35 },
  ]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Effect to update the confluence data from the analysis prop
  useEffect(() => {
    if (analysis && analysis.timeframes) {
      const updatedAnalysis = analysis.timeframes.map(tf => {
        // Calculate bullish percentage from confidence
        const bullishPercentage = tf.direction === 'CALL' 
          ? tf.confidence
          : 100 - tf.confidence;
          
        return {
          timeframe: tf.label,
          bullish: bullishPercentage,
          bearish: 100 - bullishPercentage
        };
      });
      
      setTimeframeAnalysis(prevAnalysis => {
        // Merge with existing timeframes if new data doesn't have all timeframes
        if (updatedAnalysis.length < prevAnalysis.length) {
          const existingTimeframes = prevAnalysis.map(item => item.timeframe);
          const newTimeframes = updatedAnalysis.map(item => item.timeframe);
          
          return [
            ...updatedAnalysis,
            ...prevAnalysis.filter(item => !newTimeframes.includes(item.timeframe))
          ];
        }
        
        return updatedAnalysis;
      });
      
      setLastUpdated(new Date());
    }
  }, [analysis]);
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates by slightly changing values
      setTimeframeAnalysis(prev => 
        prev.map(tf => ({
          ...tf,
          bullish: Math.min(Math.max(tf.bullish + (Math.random() * 6 - 3), 35), 85),
          bearish: Math.min(Math.max(100 - (tf.bullish + (Math.random() * 6 - 3)), 15), 65)
        }))
      );
      setLastUpdated(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info(t("updatingHeatmap"), {
      description: t("calculatingNewConfluence"),
    });
    
    // Simulate refresh with slight changes to values
    setTimeout(() => {
      setTimeframeAnalysis(prev => 
        prev.map(tf => ({
          ...tf,
          bullish: Math.min(Math.max(tf.bullish + (Math.random() * 10 - 5), 30), 90),
          bearish: Math.min(Math.max(100 - (tf.bullish + (Math.random() * 10 - 5)), 10), 70)
        }))
      );
      setLastUpdated(new Date());
      setIsRefreshing(false);
      
      toast.success(t("heatmapUpdated"), {
        description: t("latestConfluenceCalculated"),
      });
    }, 1200);
  };
  
  return (
    <div className="bg-gray-900 border border-gray-800 shadow-xl text-white rounded-lg h-full transform perspective-[1000px] transition-all duration-500">
      <div className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-lg flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("confluenceHeatmap")}</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-gray-300 hover:text-white hover:bg-gray-700 h-8"
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="sr-only">{t("refresh")}</span>
        </Button>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2 text-sm font-semibold">{t("timeframe")}</th>
                <th className="pb-2 text-sm font-semibold">{t("bullish")}</th>
                <th className="pb-2 text-sm font-semibold">{t("bearish")}</th>
              </tr>
            </thead>
            <tbody>
              {timeframeAnalysis.map((tf, index) => (
                <tr key={index} className="border-b border-gray-700 last:border-none hover:bg-gray-800/50 transition-colors transform hover:scale-[1.02] hover:rotate-y-1">
                  <td className="py-2 text-sm">{tf.timeframe}</td>
                  <td className="py-2 text-sm">
                    <div className="w-full bg-green-900/30 rounded-full h-4 relative overflow-hidden shadow-inner transform hover:scale-105 transition-transform cursor-pointer">
                      <div 
                        className="absolute top-0 left-0 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)]"
                        style={{ width: `${Math.round(tf.bullish)}%` }}
                      />
                      <span className="absolute top-1/2 -translate-y-1/2 left-2 text-white text-xs font-medium z-10">{Math.round(tf.bullish)}%</span>
                    </div>
                  </td>
                  <td className="py-2 text-sm">
                    <div className="w-full bg-red-900/30 rounded-full h-4 relative overflow-hidden shadow-inner transform hover:scale-105 transition-transform cursor-pointer">
                      <div 
                        className="absolute top-0 left-0 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]"
                        style={{ width: `${Math.round(tf.bearish)}%` }}
                      />
                      <span className="absolute top-1/2 -translate-y-1/2 left-2 text-white text-xs font-medium z-10">{Math.round(tf.bearish)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-gray-400 flex items-center">
          <span>{t("lastUpdated")}: {lastUpdated.toLocaleTimeString()}</span>
          {Date.now() - lastUpdated.getTime() < 30000 && (
            <span className="ml-2 flex items-center text-green-400">
              <Check className="h-3 w-3 mr-1" /> {t("realTime")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
