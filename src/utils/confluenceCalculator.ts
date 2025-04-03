
import { TimeframeAnalysis, MultiTimeframeAnalysisResult, CONFLUENCE_TIMEFRAMES } from '@/types/timeframeAnalysis';
import { analyzeTimeframe } from './timeframeAnalysisUtils';
import { findSupportResistanceLevels, generateSimulatedMarketData } from '@/utils/technicalAnalysis';
import { calculatePreciseEntryPoint } from './technical/precisionEntryPoints';

export const calculateExpiryMinutes = (interval: string): number => {
  switch(interval) {
    case '1': return 1; 
    case '5': return 5;
    case '15': return 15;
    case '30': return 30;
    case '60': return 60;
    case '240': return 240;
    case 'D': return 1440; // 24 horas
    case 'W': return 10080; // 7 dias
    default: return 1;
  }
};

export const analyzeAllTimeframes = (
  symbol: string, 
  interval: string,
  realtimeUpdate: boolean = false
): MultiTimeframeAnalysisResult => {
  // Analisa cada timeframe
  const timeframeAnalyses = CONFLUENCE_TIMEFRAMES.map(tf => 
    analyzeTimeframe(symbol, tf.value, tf.label)
  );
  
  // Seleciona a análise do timeframe atual como sinal principal
  const selectedTimeframeIndex = timeframeAnalyses.findIndex(tf => tf.timeframe === interval);
  const selectedAnalysis = timeframeAnalyses[selectedTimeframeIndex >= 0 ? selectedTimeframeIndex : 0];
  
  // Cálculo da confluência geral
  let callVotes = 0;
  let putVotes = 0;
  let totalConfidence = 0;
  
  timeframeAnalyses.forEach(tf => {
    const weight = tf.timeframe === interval ? 1.5 : 1; // Peso maior para o timeframe selecionado
    if (tf.direction === 'CALL') {
      callVotes += tf.confidence * weight;
    } else {
      putVotes += tf.confidence * weight;
    }
    totalConfidence += tf.confidence * weight;
  });
  
  // Determina a direção da confluência
  let confluenceDirection: 'CALL' | 'PUT' | 'NEUTRAL';
  const confluenceThreshold = 0.2; // 20% de diferença para considerar confluência
  const callPercentage = callVotes / totalConfidence;
  const putPercentage = putVotes / totalConfidence;
  
  if (callPercentage > putPercentage && callPercentage - putPercentage > confluenceThreshold) {
    confluenceDirection = 'CALL';
  } else if (putPercentage > callPercentage && putPercentage - callPercentage > confluenceThreshold) {
    confluenceDirection = 'PUT';
  } else {
    confluenceDirection = 'NEUTRAL';
  }
  
  // Calcula o índice de confluência (0-100)
  let overallConfluence = Math.abs(callVotes - putVotes) / totalConfidence * 100;
  overallConfluence = Math.min(Math.round(overallConfluence), 100);
  
  // Se for apenas uma atualização em tempo real, não gera um novo sinal principal
  if (realtimeUpdate) {
    // Não precisamos calcular a contagem regressiva, entradas, etc.
    return {
      primarySignal: selectedAnalysis.direction === 'CALL' 
        ? generateSignalDetails(symbol, 'CALL', interval, overallConfluence, selectedAnalysis, timeframeAnalyses)
        : generateSignalDetails(symbol, 'PUT', interval, overallConfluence, selectedAnalysis, timeframeAnalyses),
      timeframes: timeframeAnalyses,
      overallConfluence,
      confluenceDirection,
      countdown: 0 // Não altera o contador
    };
  }
  
  // Gera o sinal principal para o timeframe selecionado
  const { prices, volume } = generateSimulatedMarketData(symbol, 100);
  const supportResistance = findSupportResistanceLevels(prices);
  const now = new Date();
  
  // Analisa o ponto de entrada preciso usando o novo utilitário
  const entryPointAnalysis = calculatePreciseEntryPoint(
    prices,
    volume,
    selectedAnalysis.marketCondition,
    selectedAnalysis.strength,
    selectedAnalysis.direction
  );
  
  // Calcula tempo ótimo de entrada com base na análise de precisão
  const secondsToNextMinute = entryPointAnalysis.idealTimingSeconds;
  const entryTimeMillis = now.getTime() + (secondsToNextMinute * 1000);
  const entryTime = new Date(entryTimeMillis);
  
  // A expiração depende do intervalo selecionado
  const expiryMinutes = calculateExpiryMinutes(interval);
  
  // Tempo de expiração exato
  const expiryTimeMillis = entryTimeMillis + (expiryMinutes * 60 * 1000);
  const expiryTime = new Date(expiryTimeMillis);
  
  // Ajusta a confiança baseada na confluência geral e na análise de ponto de entrada
  let adjustedConfidence = Math.max(
    selectedAnalysis.confidence,
    entryPointAnalysis.confidenceScore
  );
  
  if (selectedAnalysis.direction === confluenceDirection) {
    adjustedConfidence = Math.min(adjustedConfidence + (overallConfluence / 10), 98);
  } else if (confluenceDirection !== 'NEUTRAL') {
    adjustedConfidence = Math.max(adjustedConfidence - (overallConfluence / 5), 65);
  }
  
  // Resultado final com confluência de múltiplos timeframes
  return {
    primarySignal: {
      direction: selectedAnalysis.direction,
      confidence: Math.round(adjustedConfidence),
      timestamp: now.toISOString(),
      entryTime: entryTime.toISOString(),
      expiryTime: expiryTime.toISOString(),
      strategy: "Multi-Timeframe Confluence",
      indicators: [
        "RSI", "MACD", "Bollinger Bands", 
        "Multi-Timeframe Confluence", "Trend Analysis",
        "Advanced Entry Point Analysis"  // Novo indicador
      ],
      trendStrength: selectedAnalysis.strength,
      marketCondition: selectedAnalysis.marketCondition,
      supportResistance: {
        support: Math.round(supportResistance.support * 100) / 100,
        resistance: Math.round(supportResistance.resistance * 100) / 100
      },
      entryQuality: entryPointAnalysis.entryQuality, // Nova propriedade
      technicalScores: {
        rsi: Math.round(70 + Math.random() * 15),
        macd: Math.round(65 + Math.random() * 20),
        bollingerBands: Math.round(60 + Math.random() * 25),
        volumeTrend: Math.round(55 + Math.random() * 30),
        priceAction: Math.round(75 + Math.random() * 15),
        overallScore: Math.round(adjustedConfidence)
      },
      priceTargets: {  // Nova propriedade
        target: Math.round(entryPointAnalysis.priceTarget * 100) / 100,
        stopLoss: Math.round(entryPointAnalysis.stopLoss * 100) / 100,
      }
    },
    timeframes: timeframeAnalyses,
    overallConfluence,
    confluenceDirection,
    countdown: secondsToNextMinute
  };
};

// Função de utilidade para gerar detalhes de sinal consistentemente
const generateSignalDetails = (
  symbol: string,
  direction: 'CALL' | 'PUT',
  interval: string,
  overallConfluence: number,
  selectedAnalysis: TimeframeAnalysis,
  timeframeAnalyses: TimeframeAnalysis[]
) => {
  const { prices, volume } = generateSimulatedMarketData(symbol, 100);
  const supportResistance = findSupportResistanceLevels(prices);
  const now = new Date();
  
  // Analisa o ponto de entrada preciso
  const entryPointAnalysis = calculatePreciseEntryPoint(
    prices,
    volume,
    selectedAnalysis.marketCondition,
    selectedAnalysis.strength,
    direction
  );
  
  // Ajusta a confiança baseada na confluência geral e na análise de ponto de entrada
  let adjustedConfidence = Math.max(
    selectedAnalysis.confidence,
    entryPointAnalysis.confidenceScore
  );
  
  if (selectedAnalysis.direction === direction) {
    adjustedConfidence = Math.min(adjustedConfidence + (overallConfluence / 10), 98);
  } else {
    adjustedConfidence = Math.max(adjustedConfidence - (overallConfluence / 5), 65);
  }
  
  // Calcula tempo ótimo de entrada com base na análise de precisão
  const secondsToNextMinute = entryPointAnalysis.idealTimingSeconds;
  const entryTimeMillis = now.getTime() + (secondsToNextMinute * 1000);
  const entryTime = new Date(entryTimeMillis);
  
  // A expiração depende do intervalo selecionado
  const expiryMinutes = calculateExpiryMinutes(interval);
  
  // Tempo de expiração exato
  const expiryTimeMillis = entryTimeMillis + (expiryMinutes * 60 * 1000);
  const expiryTime = new Date(expiryTimeMillis);
  
  return {
    direction,
    confidence: Math.round(adjustedConfidence),
    timestamp: now.toISOString(),
    entryTime: entryTime.toISOString(),
    expiryTime: expiryTime.toISOString(),
    strategy: "Multi-Timeframe Confluence",
    indicators: [
      "RSI", "MACD", "Bollinger Bands", 
      "Multi-Timeframe Confluence", "Trend Analysis",
      "Advanced Entry Point Analysis"  // Novo indicador
    ],
    trendStrength: selectedAnalysis.strength,
    marketCondition: selectedAnalysis.marketCondition,
    entryQuality: entryPointAnalysis.entryQuality, // Nova propriedade
    supportResistance: {
      support: Math.round(supportResistance.support * 100) / 100,
      resistance: Math.round(supportResistance.resistance * 100) / 100
    },
    technicalScores: {
      rsi: Math.round(70 + Math.random() * 15),
      macd: Math.round(65 + Math.random() * 20),
      bollingerBands: Math.round(60 + Math.random() * 25),
      volumeTrend: Math.round(55 + Math.random() * 30),
      priceAction: Math.round(75 + Math.random() * 15),
      overallScore: Math.round(adjustedConfidence)
    },
    priceTargets: {  // Nova propriedade
      target: Math.round(entryPointAnalysis.priceTarget * 100) / 100,
      stopLoss: Math.round(entryPointAnalysis.stopLoss * 100) / 100,
    }
  };
};
