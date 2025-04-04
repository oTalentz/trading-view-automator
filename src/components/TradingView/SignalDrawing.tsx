
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { useChartSignalDrawing } from '@/hooks/useChartSignalDrawing';
import { useEffect, useState } from 'react';

interface SignalDrawingProps {
  analysis: MultiTimeframeAnalysisResult | null;
  language: string;
  theme: string;
  interval: string;
  isChartReady: boolean;
}

export function SignalDrawing({ 
  analysis, 
  language, 
  theme, 
  interval, 
  isChartReady 
}: SignalDrawingProps) {
  const [showLegend, setShowLegend] = useState<boolean>(true);
  
  // Alternar visibilidade da legenda do gráfico
  useEffect(() => {
    if (!window.tvWidget || !isChartReady) return;
    
    // Adicionar botão personalizado ao cabeçalho do gráfico para controlar a legenda
    try {
      const buttonId = 'toggle-legend-button';
      
      // Remover botão existente para evitar duplicação
      const existingButton = document.getElementById(buttonId);
      if (existingButton) existingButton.remove();
      
      // Criar botão de controle de legenda
      const container = document.querySelector('.chart-toolbar');
      if (container) {
        const button = document.createElement('button');
        button.id = buttonId;
        button.innerHTML = `<span style="padding: 6px 12px; font-size: 12px; display: flex; align-items: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h18v18H3V3z"/>
            <path d="M3 9h18"/>
            <path d="M9 21V9"/>
          </svg>
          <span style="margin-left: 4px;">${language === 'pt-br' ? 'Legenda' : 'Legend'}</span>
        </span>`;
        button.className = 'button-gn3nJJsV';
        button.style.marginLeft = '8px';
        button.onclick = () => setShowLegend(!showLegend);
        container.appendChild(button);
      }
    } catch (e) {
      console.error('Error adding custom button:', e);
    }
  }, [isChartReady, language, showLegend]);

  // Usa o hook personalizado para lidar com toda a lógica de desenho
  useChartSignalDrawing({
    analysis,
    language,
    theme,
    interval,
    isChartReady,
    showLegend
  });

  return null; // Este é um componente utilitário que só tem efeitos colaterais
}
