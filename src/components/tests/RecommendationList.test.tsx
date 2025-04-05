
import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecommendationList } from '../ai/RecommendationList';
import { LanguageProvider } from '@/context/LanguageContext';
import '@testing-library/jest-dom';

describe('RecommendationList Component', () => {
  test('exibe mensagem de gerar mais sinais quando não há insights', () => {
    render(
      <LanguageProvider>
        <ul>
          <RecommendationList hasInsights={false} />
        </ul>
      </LanguageProvider>
    );

    expect(screen.getByText(/generateMoreSignals/i)).toBeInTheDocument();
  });

  test('exibe lista de recomendações quando há insights', () => {
    render(
      <LanguageProvider>
        <ul>
          <RecommendationList hasInsights={true} />
        </ul>
      </LanguageProvider>
    );

    // Verificar se as recomendações estão presentes
    expect(screen.getByText(/optimizeParameters/i)).toBeInTheDocument();
    expect(screen.getByText(/focusOnTimeframes/i)).toBeInTheDocument();
    expect(screen.getByText(/adjustConfidenceThresholds/i)).toBeInTheDocument();
  });
});
