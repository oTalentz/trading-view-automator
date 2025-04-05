
import React from 'react';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/context/LanguageContext';

type ConfluenceHeatmapProps = {
  analysis: MultiTimeframeAnalysisResult;
};

export function ConfluenceHeatmap({ analysis }: ConfluenceHeatmapProps) {
  const { t } = useLanguage();
  
  const timeframeAnalysis = [
    { timeframe: '15m', bullish: 60, bearish: 40 },
    { timeframe: '30m', bullish: 70, bearish: 30 },
    { timeframe: '1h', bullish: 55, bearish: 45 },
    { timeframe: '4h', bullish: 80, bearish: 20 },
    { timeframe: '1D', bullish: 65, bearish: 35 },
  ];
  
  return (
    <Card className="bg-gray-900 border-gray-800 text-white transform perspective-[1000px] hover:rotate-y-1 transition-transform duration-500 shadow-xl">
      <CardHeader className="pb-2 pt-3 px-4 bg-gradient-to-r from-gray-800 to-gray-900">
        <CardTitle className="text-lg font-semibold">{t("confluenceHeatmap")}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
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
                <tr key={index} className="border-b border-gray-700 last:border-none hover:bg-gray-800/50 transition-colors">
                  <td className="py-2 text-sm">{tf.timeframe}</td>
                  <td className="py-2 text-sm">
                    <div className="w-full bg-green-900/50 rounded-full h-2 relative overflow-hidden shadow-inner transform hover:scale-105 transition-transform">
                      <div 
                        className="absolute top-0 left-0 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)]"
                        style={{ width: `${tf.bullish}%` }}
                      />
                      <span className="absolute top-0 left-2 text-white text-xs">{tf.bullish}%</span>
                    </div>
                  </td>
                  <td className="py-2 text-sm">
                    <div className="w-full bg-red-900/50 rounded-full h-2 relative overflow-hidden shadow-inner transform hover:scale-105 transition-transform">
                      <div 
                        className="absolute top-0 left-0 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]"
                        style={{ width: `${tf.bearish}%` }}
                      />
                      <span className="absolute top-0 left-2 text-white text-xs">{tf.bearish}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
