
/**
 * Módulo para análise de sentimento de notícias e mídias sociais
 */

import { SentimentSource, SentimentAnalysisResult } from './types';
import { fetchSentimentSources } from './sources';
import { 
  calculateOverallSentiment, 
  extractKeywords, 
  determineMarketImpact 
} from './calculators';

/**
 * Analisa o sentimento de notícias e mídias sociais para um determinado símbolo
 */
export const analyzeSentiment = async (symbol: string): Promise<SentimentAnalysisResult> => {
  console.log(`Analyzing sentiment for ${symbol}`);
  
  try {
    // Simula a busca de dados de várias fontes
    // Em uma implementação real, isso buscaria dados de APIs externas
    const sources = await fetchSentimentSources(symbol);
    
    // Calcula o sentimento geral com base nas fontes
    const overallScore = calculateOverallSentiment(sources);
    
    // Extrai palavras-chave do conteúdo
    const keywords = extractKeywords(sources);
    
    // Determina o impacto potencial no mercado
    const marketImpact = determineMarketImpact(overallScore, keywords);
    
    return {
      overallScore,
      sources,
      latestUpdate: new Date().toISOString(),
      marketImpact,
      keywords
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    // Retorna resultado neutro em caso de erro
    return {
      overallScore: 0,
      sources: [],
      latestUpdate: new Date().toISOString(),
      marketImpact: 'neutral',
      keywords: []
    };
  }
};
