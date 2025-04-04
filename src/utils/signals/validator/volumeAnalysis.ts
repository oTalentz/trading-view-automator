
/**
 * Analyzes volume trend and returns the ratio between current volume and average volume
 */
export const checkVolumeTrend = (
  volume: number[], 
  periods: number = 5
): number => {
  if (volume.length < periods + 1) return 1.0;
  
  const recentVolumes = volume.slice(-periods - 1, -1);
  const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / periods;
  const currentVolume = volume[volume.length - 1];
  
  return currentVolume / avgVolume;
};
