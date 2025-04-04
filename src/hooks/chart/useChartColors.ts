
import { useMemo } from 'react';
import { ChartColors } from './types';

export function useChartColors(theme: string): ChartColors {
  return useMemo(() => ({
    support: theme === 'dark' ? "#10b981" : "#059669",
    resistance: theme === 'dark' ? "#ef4444" : "#dc2626",
    entry: {
      call: theme === 'dark' ? "#22c55e" : "#16a34a",
      put: theme === 'dark' ? "#ef4444" : "#dc2626"
    },
    expiry: theme === 'dark' ? "#f97316" : "#ea580c",
    label: theme === 'dark' ? "#e5e7eb" : "#1f2937"
  }), [theme]);
}
