
/**
 * Módulo para análise de sentimento de notícias e mídias sociais
 */

export interface SentimentSource {
  source: 'news' | 'twitter' | 'reddit' | 'stocktwits';
  text: string;
  url?: string;
  timestamp: string;
  score?: number;
}

export interface SentimentAnalysisResult {
  overallScore: number; // -100 a 100
  sources: SentimentSource[];
  latestUpdate: string;
  marketImpact: 'high' | 'medium' | 'low' | 'neutral';
  keywords: {word: string, count: number}[];
}

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

/**
 * Simula a busca de fontes de sentimento para um símbolo
 * Em um ambiente de produção, isso se conectaria a APIs reais
 */
const fetchSentimentSources = async (symbol: string): Promise<SentimentSource[]> => {
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

/**
 * Calcula o sentimento geral com base nas fontes disponíveis
 */
const calculateOverallSentiment = (sources: SentimentSource[]): number => {
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
const extractKeywords = (sources: SentimentSource[]): {word: string, count: number}[] => {
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
const determineMarketImpact = (
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
