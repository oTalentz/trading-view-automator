
import React from 'react';
import { SignalResultsChart } from './SignalResultsChart';
import { TimeframeBarChart } from './TimeframeBarChart';

type ResultData = Array<{
  name: string;
  value: number;
  color: string;
}>;

type TimeframeData = Array<{
  timeframe: string;
  count: number;
}>;

type OverviewTabProps = {
  resultData: ResultData;
  timeframeData: TimeframeData;
};

export function OverviewTab({ resultData, timeframeData }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SignalResultsChart resultData={resultData} />
      <TimeframeBarChart timeframeData={timeframeData} />
    </div>
  );
}
