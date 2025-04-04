
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BacktestResult } from '@/hooks/useBacktestResults';
import { SignalHistoryEntry } from '@/utils/signalHistoryUtils';
import {
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface WinRateDistributionProps {
  backtestResults: BacktestResult;
  signals: SignalHistoryEntry[];
}

export function WinRateDistribution({ 
  backtestResults, 
  signals 
}: WinRateDistributionProps) {
  const { t } = useLanguage();
  
  // Prepare data for confidence distribution
  const prepareConfidenceData = () => {
    const confidenceDistribution: Record<string, { total: number, wins: number }> = {};
    
    signals.forEach(signal => {
      if (!signal.result) return;
      
      const confidenceBin = Math.floor(signal.confidence / 5) * 5;
      const binKey = `${confidenceBin}-${confidenceBin + 4}`;
      
      if (!confidenceDistribution[binKey]) {
        confidenceDistribution[binKey] = { total: 0, wins: 0 };
      }
      
      confidenceDistribution[binKey].total += 1;
      if (signal.result === 'WIN') {
        confidenceDistribution[binKey].wins += 1;
      }
    });
    
    return Object.entries(confidenceDistribution).map(([range, data]) => {
      const winRate = data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0;
      return {
        range,
        winRate,
        total: data.total
      };
    }).sort((a, b) => {
      const aStart = parseInt(a.range.split('-')[0]);
      const bStart = parseInt(b.range.split('-')[0]);
      return aStart - bStart;
    });
  };
  
  const confidenceData = prepareConfidenceData();
  
  // Prepare data for win/loss distribution
  const pieData = [
    { name: t("wins"), value: signals.filter(s => s.result === 'WIN').length, color: '#22c55e' },
    { name: t("losses"), value: signals.filter(s => s.result === 'LOSS').length, color: '#ef4444' },
    { name: t("draws"), value: signals.filter(s => s.result === 'DRAW').length, color: '#94a3b8' }
  ];
  
  // Prepare data for confidence level analysis
  const confidenceLevelData = [
    { 
      name: t("lowConfidence"), 
      winRate: backtestResults.winRateByConfidence.low, 
      color: '#94a3b8' 
    },
    { 
      name: t("mediumConfidence"), 
      winRate: backtestResults.winRateByConfidence.medium, 
      color: '#3b82f6' 
    },
    { 
      name: t("highConfidence"), 
      winRate: backtestResults.winRateByConfidence.high, 
      color: '#22c55e' 
    }
  ];
  
  return (
    <div className="space-y-5 border rounded-lg p-4">
      <div>
        <h3 className="text-sm font-medium mb-3">{t("winRateByConfidenceLevel")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceLevelData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, t("winRate")]}
                />
                <Bar dataKey="winRate" name={t("winRate")}>
                  {confidenceLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">{t("detailedConfidenceDistribution")}</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="range" />
              <YAxis yAxisId="left" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 'auto']} hide />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "winRate") return [`${value}%`, t("winRate")];
                  if (name === "total") return [value, t("sampleCount")];
                  return [value, name];
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="winRate" 
                name={t("winRate")} 
                stroke="#22c55e" 
                strokeWidth={2} 
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="total" 
                name={t("sampleCount")} 
                stroke="#94a3b8" 
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 text-sm text-muted-foreground">
          {backtestResults.winRateByConfidence.high > 70 ? (
            <p>{t("highConfidenceSignalsPerform")}</p>
          ) : backtestResults.winRateByConfidence.medium > backtestResults.winRateByConfidence.high ? (
            <p>{t("mediumConfidenceOutperforming")}</p>
          ) : (
            <p>{t("reviewConfidenceCalculation")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
