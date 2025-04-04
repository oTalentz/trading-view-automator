
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SignalHistoryEntry } from '@/utils/signalHistoryUtils';
import {
  BarChart as ReChartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { calculateWinsByDay, calculateWinsByHour } from './BacktestUtils';

interface TimeAnalysisProps {
  signals: SignalHistoryEntry[];
}

export function TimeAnalysis({ signals }: TimeAnalysisProps) {
  const { t } = useLanguage();
  
  const winsByDay = calculateWinsByDay(signals);
  const winsByHour = calculateWinsByHour(signals);
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <h3 className="text-sm font-medium mb-3">{t("winRateByWeekday")}</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReChartsBarChart data={winsByDay}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === "winRate") return [`${value}%`, t("winRate")];
                  return [value, name];
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background p-3 border shadow-sm rounded-md">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("winRate")}: <span className="font-mono">{data.winRate}%</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("wins")}: <span className="font-mono text-green-500">{data.wins}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("losses")}: <span className="font-mono text-red-500">{data.losses}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="winRate" 
                name={t("winRate")} 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
              />
            </ReChartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-3">{t("winRateByHour")}</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReChartsBarChart data={winsByHour}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="hour" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === "winRate") return [`${value}%`, t("winRate")];
                  return [value, name];
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background p-3 border shadow-sm rounded-md">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("winRate")}: <span className="font-mono">{data.winRate}%</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("wins")}: <span className="font-mono text-green-500">{data.wins}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("losses")}: <span className="font-mono text-red-500">{data.losses}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="winRate" 
                name={t("winRate")} 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
              />
            </ReChartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
