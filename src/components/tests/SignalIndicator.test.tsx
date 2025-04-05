
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SignalIndicator } from '../SignalIndicator';
import { useMultiTimeframeAnalysis } from '@/hooks/useMultiTimeframeAnalysis';
import { useAIInsights } from '@/hooks/useAIInsights';
import { LanguageProvider } from '@/context/LanguageContext';
import { AIAnalysisProvider } from '@/context/AIAnalysisContext';
import { MarketCondition } from '@/utils/technicalAnalysis';

// Mock dos hooks
jest.mock('@/hooks/useMultiTimeframeAnalysis');
jest.mock('@/hooks/useAIInsights');

describe('SignalIndicator Component', () => {
  const mockAnalysis = {
    primarySignal: {
      direction: 'CALL',
      confidence: 85,
      entryTime: '2023-01-01T12:00:00Z',
      expiryTime: '2023-01-01T13:00:00Z',
      marketCondition: MarketCondition.TREND_UP,
      strategy: 'TREND_FOLLOWING',
      indicators: ['RSI', 'MACD', 'Bollinger'],
      supportResistance: {
        support: 100,
        resistance: 120
      },
      technicalScores: {
        overallScore: 78,
        priceAction: 82,
        macd: 75,
        volumeTrend: 68
      },
      trendStrength: 70
    },
    overallConfluence: 80,
    confluenceDirection: 'CALL',
    timeframes: []
  };

  const mockInsights = [
    {
      key: '1',
      title: 'Momentum positivo',
      description: 'Continuação de tendência com suporte em volume',
      type: 'success'
    }
  ];

  beforeEach(() => {
    // Configurar mocks
    (useMultiTimeframeAnalysis as jest.Mock).mockReturnValue({
      analysis: mockAnalysis,
      countdown: 30
    });

    (useAIInsights as jest.Mock).mockReturnValue({
      insights: mockInsights,
      isLoading: false,
      generateInsights: jest.fn()
    });
  });

  test('renderiza com o sinal principal corretamente', () => {
    render(
      <AIAnalysisProvider>
        <LanguageProvider>
          <SignalIndicator symbol="BINANCE:BTCUSDT" />
        </LanguageProvider>
      </AIAnalysisProvider>
    );

    // Verificar se elementos principais estão presentes
    expect(screen.getByText(/BTCUSDT/i)).toBeInTheDocument();
    expect(screen.getByText(/85%/i)).toBeInTheDocument(); // Confiança
    expect(screen.getByText(/80%/i)).toBeInTheDocument(); // Confluência
  });

  test('mostra indicador de loading quando não há análise', () => {
    (useMultiTimeframeAnalysis as jest.Mock).mockReturnValue({
      analysis: null,
      countdown: 0
    });

    render(
      <AIAnalysisProvider>
        <LanguageProvider>
          <SignalIndicator symbol="BINANCE:BTCUSDT" />
        </LanguageProvider>
      </AIAnalysisProvider>
    );

    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
  });
});
