
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BacktestResult } from '@/hooks/useBacktestResults';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StrategyPerformanceProps {
  candleAccuracyData: Array<{
    strategy: string;
    accuracy: number;
    samples: number;
    timeframes: Array<{
      timeframe: string;
      accuracy: number;
      samples: number;
    }>;
  }>;
  backtestResults: BacktestResult;
}

export function StrategyPerformance({ 
  candleAccuracyData, 
  backtestResults 
}: StrategyPerformanceProps) {
  const { t } = useLanguage();
  
  // Extract data for strategy comparison by timeframe
  const prepareTimeframeComparisonData = () => {
    const timeframes = Object.keys(backtestResults.winRateByTimeframe);
    
    return timeframes.map(timeframe => {
      const result: any = { timeframe };
      
      candleAccuracyData.forEach(strategy => {
        const timeframeData = strategy.timeframes.find(tf => tf.timeframe === timeframe);
        if (timeframeData) {
          result[strategy.strategy] = timeframeData.accuracy;
        } else {
          result[strategy.strategy] = 0;
        }
      });
      
      return result;
    });
  };
  
  const timeframeComparisonData = prepareTimeframeComparisonData();
  
  // Generate strategy recommendations
  const generateRecommendations = () => {
    let recommendations = [];
    
    // Find best strategy overall
    const bestOverall = candleAccuracyData[0];
    if (bestOverall) {
      recommendations.push({
        type: 'best-overall',
        strategy: bestOverall.strategy,
        accuracy: bestOverall.accuracy,
        description: t("bestOverallStrategy"),
      });
    }
    
    // Find best strategy for each timeframe with enough samples
    const bestByTimeframe: Record<string, { strategy: string, accuracy: number, samples: number }> = {};
    
    candleAccuracyData.forEach(strategy => {
      strategy.timeframes.forEach(tf => {
        if (tf.samples >= 5) { // Only consider timeframes with enough samples
          if (!bestByTimeframe[tf.timeframe] || bestByTimeframe[tf.timeframe].accuracy < tf.accuracy) {
            bestByTimeframe[tf.timeframe] = {
              strategy: strategy.strategy,
              accuracy: tf.accuracy,
              samples: tf.samples
            };
          }
        }
      });
    });
    
    Object.entries(bestByTimeframe).forEach(([timeframe, data]) => {
      recommendations.push({
        type: 'best-timeframe',
        timeframe,
        strategy: data.strategy,
        accuracy: data.accuracy,
        samples: data.samples,
        description: t("bestStrategyForTimeframe", { timeframe })
      });
    });
    
    return recommendations;
  };
  
  const recommendations = generateRecommendations();
  
  // Prepare color mapping for strategies
  const strategiesForColors = candleAccuracyData.map(s => s.strategy);
  const colorMap = [
    '#22c55e', '#3b82f6', '#f97316', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#eab308', '#f43f5e'
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">{t("strategyPerformanceByTimeframe")}</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeframeComparisonData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="timeframe" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
              />
              {strategiesForColors.map((strategy, index) => (
                <Bar 
                  key={strategy}
                  dataKey={strategy} 
                  name={strategy} 
                  fill={colorMap[index % colorMap.length]} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 p-3 font-medium">
          {t("strategyRecommendations")}
        </div>
        <div className="divide-y">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{rec.strategy}</h4>
                <div className="text-sm">
                  {rec.accuracy}% {t("accuracy")}
                  {rec.samples && ` (${rec.samples} ${t("samples")})`}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {rec.description}
                {rec.timeframe && ` ${rec.timeframe}`}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">{t("winRateBySymbol")}</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(backtestResults.winRateBySymbol).map(([symbol, rate]) => ({ 
                symbol: symbol.split(':').pop(), 
                winRate: rate 
              }))}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="symbol" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, t("winRate")]} />
                <Bar 
                  dataKey="winRate" 
                  name={t("winRate")} 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">{t("winRateByTimeframe")}</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(backtestResults.winRateByTimeframe).map(([tf, rate]) => ({ 
                timeframe: tf, 
                winRate: rate 
              }))}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="timeframe" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, t("winRate")]} />
                <Bar 
                  dataKey="winRate" 
                  name={t("winRate")} 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
