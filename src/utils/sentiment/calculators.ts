
import { SentimentSource } from './types';

/**
 * Calcula o sentimento geral com base nas fontes disponíveis
 */
export const calculateOverallSentiment = (sources: SentimentSource[]): number => {
  if (sources.length === 0) return 0;
  
  // Filtra fontes com pontuação disponível
  const scoredSources = sources.filter(source => source.score !== undefined);
  if (scoredSources.length === 0) return 0;
  
  // Calcula a média ponderada de todas as pontuações
  // Dá mais peso para fontes mais recentes
  const weightedScores = scoredSources.map(source => {
    const age = Date.now() - new Date(source.timestamp).getTime();
    const weight = Math.max(0.5, 1 - (age / (24 * 3600000))); // Peso diminui com a idade, mínimo 0.5
    return (source.score || 0) * weight;
  });
  
  const totalWeight = scoredSources.length;
  const weightedAverage = weightedScores.reduce((acc, score) => acc + score, 0) / totalWeight;
  
  return Math.round(weightedAverage);
};

/**
 * Extrai palavras-chave das fontes de sentimento
 */
export const extractKeywords = (sources: SentimentSource[]): {word: string, count: number}[] => {
  // Lista de palavras comuns a ignorar
  const stopWords = ['a', 'o', 'e', 'de', 'para', 'com', 'em', 'um', 'uma', 'os', 'as', 'que', 'no', 'na'];
  
  // Extrai palavras de todas as fontes
  const allWords = sources
    .map(source => source.text.toLowerCase().split(/\s+/))
    .flat()
    .filter(word => 
      word.length > 2 && 
      !stopWords.includes(word) && 
      !word.startsWith('http') &&
      !/^[0-9]+$/.test(word)
    );
  
  // Conta a frequência de cada palavra
  const wordCount: Record<string, number> = {};
  allWords.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length < 3) return;
    
    wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
  });
  
  // Converte para array e ordena por contagem
  return Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Apenas as 10 principais
};

/**
 * Determina o potencial impacto no mercado com base no sentimento
 */
export const determineMarketImpact = (
  overallScore: number,
  keywords: {word: string, count: number}[]
): 'high' | 'medium' | 'low' | 'neutral' => {
  // Palavras-chave de alto impacto
  const highImpactWords = [
    'crash', 'breakout', 'dispara', 'despenca', 'recorde', 'falência',
    'aquisição', 'fusão', 'escândalo', 'investigação', 'lucro', 'prejuízo'
  ];
  
  // Verifica se alguma palavra-chave de alto impacto está presente
  const hasHighImpactKeywords = keywords.some(k => 
    highImpactWords.some(hiw => k.word.includes(hiw))
  );
  
  // Determina o impacto com base na pontuação e palavras-chave
  if (Math.abs(overallScore) > 70 || hasHighImpactKeywords) {
    return 'high';
  } else if (Math.abs(overallScore) > 40) {
    return 'medium';
  } else if (Math.abs(overallScore) > 15) {
    return 'low';
  } else {
    return 'neutral';
  }
};
