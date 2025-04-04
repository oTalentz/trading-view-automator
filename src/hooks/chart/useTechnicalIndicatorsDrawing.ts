
import { useCallback } from 'react';

export function useTechnicalIndicatorsDrawing() {
  return useCallback((chart: any) => {
    try {
      // RSI com configuração aprimorada
      chart.createStudy("RSI@tv-basicstudies", false, false, {
        length: 14,
        "plot.color": "#7e57c2",
        "plot.linewidth": 2,
        "band.1": 30,
        "band.2": 70,
        "bandFill.1": true,
        "bandFill.2": true,
        "bandFill.color.1": "#10b98120", // Verde com transparência
        "bandFill.color.2": "#ef444420", // Vermelho com transparência
      }, { "precision": 1 });
      
      // MACD com configuração otimizada
      chart.createStudy("MACD@tv-basicstudies", false, false, {
        "fast length": 12,
        "slow length": 26,
        "signal length": 9,
        "histogram.color": "#2962ff",
        "histogram.linewidth": 2,
        "macd.color": "#ff6b00",
        "signal.color": "#f542cb",
        "macd.linewidth": 2,
        "signal.linewidth": 2
      });
      
      // Bollinger Bands com configurações melhoradas
      chart.createStudy("BB@tv-basicstudies", false, false, {
        length: 20,
        "plot.color": "#2962ff",
        "plot.linewidth": 2,
        "upper.color": "#ef4444",
        "lower.color": "#10b981",
        "basis.color": "#f59e0b",
        "upper.linewidth": 2,
        "lower.linewidth": 2,
        "basis.linewidth": 1,
        "deviation": 2
      });
      
      // Volume médio
      chart.createStudy("Volume@tv-basicstudies", false, false, {
        "volume.color.0": "#ef444470",
        "volume.color.1": "#10b98170",
        "volume.linewidth": 2,
        "volume ma.color": "#f59e0b",
        "volume ma.linewidth": 2,
        "volume ma.length": 20,
        "volume ma.visible": true
      });
      
      console.log("Estudos de indicadores adicionados com configurações otimizadas");
    } catch (err) {
      console.error("Erro ao adicionar estudos:", err);
      // Os estudos podem já existir, continuar
    }
  }, []);
}
