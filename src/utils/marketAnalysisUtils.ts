
// This file serves as a facade for all the refactored market analysis utilities

import { analyzeMarket } from '@/utils/analysis/marketAnalyzer';
import { calculateOptimalEntryTiming } from '@/utils/technical/entryTiming';
import { calculateExpiryMinutes } from '@/utils/confluence/timeframeAnalyzer';
import { selectStrategy } from '@/utils/strategy/strategySelector';
import { determineSignalDirection } from '@/utils/signals/signalDirectionUtils';
import { calculateTechnicalScores } from '@/utils/analysis/technicalScoreUtils';

// Re-export all the utilities to maintain backwards compatibility
export {
  analyzeMarket,
  calculateOptimalEntryTiming,
  calculateExpiryMinutes,
  selectStrategy,
  determineSignalDirection,
  calculateTechnicalScores
};
