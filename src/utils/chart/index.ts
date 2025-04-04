
// Re-export all chart drawing utility functions
export * from './types';
export * from './supportResistance';
export * from './signalText';
export * from './entryMarker';
export * from './historicalMarkers';
export * from './technicalAnalysis';
export * from './legendInfo';
export * from './utility';

// Re-export the SupportResistance type for backward compatibility
export interface SupportResistance {
  support: number;
  resistance: number;
}
