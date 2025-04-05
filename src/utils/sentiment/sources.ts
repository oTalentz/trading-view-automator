
import { SentimentSource } from './types';

/**
 * Simula a busca de fontes de sentimento para um símbolo
 * Em um ambiente de produção, isso se conectaria a APIs reais
 */
export const fetchSentimentSources = async (symbol: string): Promise<SentimentSource[]> => {
  // Simulação de fontes de dados com valores pseudoaleatórios baseados no símbolo
  const symbolHash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seedValue = symbolHash % 100;
  
  // Gera sentimento simulado baseado no hash do símbolo para consistência
  const getSimulatedScore = (base: number) => {
    const variance = (Math.sin(symbolHash * (base/10)) * 50);
    return Math.round(Math.max(-100, Math.min(100, variance)));
  };
  
  // Simulação de dados de notícias
  const newsSources: SentimentSource[] = [
    {
      source: 'news',
      text: `Relatório financeiro recente para ${symbol} mostra resultados promissores`,
      url: `https://example.com/financial-news/${symbol.toLowerCase()}`,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      score: getSimulatedScore(1)
    },
    {
      source: 'news',
      text: `Análise de mercado: Perspectivas para ${symbol} no próximo trimestre`,
      url: `https://example.com/market-analysis/${symbol.toLowerCase()}`,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      score: getSimulatedScore(2)
    }
  ];
  
  // Simulação de dados de Twitter
  const twitterSources: SentimentSource[] = [
    {
      source: 'twitter',
      text: `Estou muito otimista sobre $${symbol} após os últimos anúncios! #investing`,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      score: getSimulatedScore(3)
    },
    {
      source: 'twitter',
      text: `$${symbol} está com tendência de alta nas discussões hoje. Volume aumentando.`,
      timestamp: new Date(Date.now() - 5400000).toISOString(),
      score: getSimulatedScore(4)
    }
  ];
  
  // Simulação de dados do Reddit
  const redditSources: SentimentSource[] = [
    {
      source: 'reddit',
      text: `Análise técnica detalhada de ${symbol} - Pontos de entrada e saída`,
      url: `https://reddit.com/r/investing/comments/${symbol.toLowerCase()}`,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      score: getSimulatedScore(5)
    }
  ];
  
  // Simulação de dados do StockTwits
  const stocktwitsSources: SentimentSource[] = [
    {
      source: 'stocktwits',
      text: `$${symbol} formando um belo padrão de continuação. Mantenha atenção.`,
      timestamp: new Date(Date.now() - 2700000).toISOString(),
      score: getSimulatedScore(6)
    }
  ];
  
  // Combina todas as fontes
  return [...newsSources, ...twitterSources, ...redditSources, ...stocktwitsSources];
};
