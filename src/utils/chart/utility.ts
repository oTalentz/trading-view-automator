
import { toast } from 'sonner';

export function clearChartDrawings(chart: any): void {
  try {
    if (chart && chart.clearAllDrawingTools) {
      chart.clearAllDrawingTools();
    } else {
      console.warn("clearAllDrawingTools not available");
    }
  } catch (e) {
    console.error("Error clearing chart drawings:", e);
  }
}

export function getChartFromWidget(): any {
  if (!window.tvWidget || !window.tvWidget._ready) {
    return null;
  }

  try {
    if (!window.tvWidget.chart || typeof window.tvWidget.chart !== 'function') {
      console.error("TradingView chart function not available");
      return null;
    }
    
    const chart = window.tvWidget.chart();
    if (!chart) {
      console.error("Failed to get chart from TradingView widget");
      return null;
    }
    
    return chart;
  } catch (e) {
    console.error("Error getting chart from widget:", e);
    return null;
  }
}

export function notifyDrawingSuccess(language: string): void {
  toast.success(
    language === 'pt-br' ? "Sinais desenhados no gráfico" : "Signals drawn on chart",
    { duration: 2000 }
  );
}

export function notifyDrawingError(language: string): void {
  toast.error(
    language === 'pt-br' ? "Erro ao desenhar sinais no gráfico" : "Error drawing signals on chart", 
    { duration: 3000 }
  );
}
