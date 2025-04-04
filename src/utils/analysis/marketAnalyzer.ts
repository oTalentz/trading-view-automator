
import { 
  MarketCondition, 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  findSupportResistanceLevels,
  determineMarketCondition,
  calculateTrendStrength,
  generateSimulatedMarketData,
  calculateVolatility,
  calculateSignalQuality,
  MACDData
} from '@/utils/technicalAnalysis';
import { selectStrategy } from '@/utils/strategy/strategySelector';
import { determineSignalDirection } from '@/utils/signals/signalDirectionUtils';
import { calculateTechnicalScores } from '@/utils/analysis/technicalScoreUtils';
import { calculateOptimalEntryTiming, calculateExpiryMinutes } from '@/utils/timing/entryTimingUtils';
import { MarketAnalysisResult } from '@/types/marketAnalysis';
import { validateSignal } from '@/utils/signals/signalValidator';
import { SentimentAnalysisResult } from '@/utils/sentiment/sentimentAnalyzer';

/**
 * Análise de mercado abrangente que combina todos os indicadores técnicos,
 * estratégias e análise de sentimento para fornecer sinais de negociação com maior precisão
 */
export const analyzeMarket = (
  symbol: string, 
  interval: string, 
  sentimentData: SentimentAnalysisResult | null = null
): MarketAnalysisResult => {
  // Obter dados simulados do mercado com mais pontos para análise precisa
  const { prices, volume } = generateSimulatedMarketData(symbol, 150);
  
  // Análise abrangente do mercado
  const marketCondition = determineMarketCondition(prices, volume);
  const { value: trendStrengthValue } = calculateTrendStrength(prices, volume);
  const supportResistance = findSupportResistanceLevels(prices);
  const rsiValue = calculateRSI(prices);
  const volatility = calculateVolatility(prices);
  
  // Calcular MACD para o ponto de dados atual
  const currentMacd = calculateMACD(prices);
  
  // Calcular MACD para o ponto de dados anterior
  const previousMacd = calculateMACD(prices.slice(0, -1));
  
  // Criar um objeto MACD estendido que inclui o histograma anterior
  const macdData: MACDData = {
    macdLine: currentMacd.macdLine,
    signalLine: currentMacd.signalLine,
    histogram: currentMacd.histogram,
    previousHistogram: previousMacd.histogram
  };
  
  const bbands = calculateBollingerBands(prices);
  
  // Selecionar estratégia ideal com base nas condições atuais do mercado e sentimento
  const selectedStrategy = selectStrategy(
    marketCondition, 
    prices, 
    volume,
    rsiValue, 
    macdData, 
    bbands,
    volatility,
    trendStrengthValue,
    sentimentData,
    true // Usar ML para seleção de estratégia
  );
  
  // Determinar direção do sinal com análise aprimorada
  // Incluindo influência de sentimento, se disponível
  const direction = determineSignalDirection(
    marketCondition,
    prices,
    volume,
    bbands,
    rsiValue,
    macdData,
    trendStrengthValue,
    sentimentData?.overallScore
  );
  
  // Validar sinal usando o sistema de validação aprimorado
  const validationResult = validateSignal(
    direction,
    prices,
    volume,
    rsiValue,
    macdData,
    marketCondition,
    trendStrengthValue,
    volatility
  );
  
  // Calcular a qualidade do sinal
  const signalQuality = calculateSignalQuality(prices, direction, marketCondition, trendStrengthValue);
  
  // Cálculo de confiança com mais fatores e validação
  let confidence = validationResult.isValid ? validationResult.confidence : Math.max(validationResult.confidence - 15, 50);
  
  // Ajustar confiança com base no sentimento, se disponível
  if (sentimentData && Math.abs(sentimentData.overallScore) > 20) {
    const sentimentInfluence = Math.min(Math.abs(sentimentData.overallScore) / 10, 8);
    
    // Aumentar confiança se sentimento estiver alinhado com direção
    if ((direction === 'CALL' && sentimentData.overallScore > 0) || 
        (direction === 'PUT' && sentimentData.overallScore < 0)) {
      confidence = Math.min(confidence + sentimentInfluence, 96);
    } 
    // Diminuir confiança se sentimento for contrário à direção
    else if ((direction === 'CALL' && sentimentData.overallScore < -20) || 
             (direction === 'PUT' && sentimentData.overallScore > 20)) {
      confidence = Math.max(confidence - sentimentInfluence, 50);
    }
  }
  
  // Calcular timing de entrada ótimo
  const secondsToNextMinute = calculateOptimalEntryTiming();
  const now = new Date();
  const entryTimeMillis = now.getTime() + (secondsToNextMinute * 1000);
  const entryTime = new Date(entryTimeMillis);
  
  // Calcular tempo de expiração ótimo com base na volatilidade e intervalo
  const expiryMinutes = calculateExpiryMinutes(interval);
  const expiryTimeMillis = entryTimeMillis + (expiryMinutes * 60 * 1000);
  const expiryTime = new Date(expiryTimeMillis);
  
  // Calcular escores técnicos aprimorados
  const technicalScores = calculateTechnicalScores(
    rsiValue,
    macdData,
    bbands,
    prices,
    volume,
    trendStrengthValue
  );
  
  // Construir resultado detalhado da análise
  const result: MarketAnalysisResult = {
    direction,
    confidence,
    timestamp: now.toISOString(),
    entryTime: entryTime.toISOString(),
    expiryTime: expiryTime.toISOString(),
    strategy: selectedStrategy.name,
    indicators: selectedStrategy.indicators,
    trendStrength: trendStrengthValue,
    marketCondition,
    supportResistance: {
      support: Math.round(supportResistance.support * 100) / 100,
      resistance: Math.round(supportResistance.resistance * 100) / 100
    },
    technicalScores,
    countdownSeconds: secondsToNextMinute,
    // Detalhes de validação aprimorada
    validationDetails: {
      reasons: validationResult.reasons,
      warningLevel: validationResult.warningLevel,
      isValid: validationResult.isValid
    }
  };
  
  // Adicionar dados de sentimento, se disponíveis
  if (sentimentData) {
    result.sentimentData = {
      score: sentimentData.overallScore,
      impact: sentimentData.marketImpact,
      keywords: sentimentData.keywords.slice(0, 5),
      lastUpdate: sentimentData.latestUpdate
    };
    
    // Adicionar indicador de sentimento à lista
    result.indicators.push('Market Sentiment');
    
    // Adicionar razões de sentimento
    if (Math.abs(sentimentData.overallScore) > 30) {
      const direction = sentimentData.overallScore > 0 ? 'positivo' : 'negativo';
      result.validationDetails.reasons.push(
        `Sentimento de mercado ${direction} (${sentimentData.overallScore})`
      );
    }
    
    // Adicionar razões de ML, se disponíveis
    if (selectedStrategy.selectionReasons) {
      result.validationDetails.reasons = [
        ...result.validationDetails.reasons,
        ...selectedStrategy.selectionReasons
      ];
    }
  }
  
  return result;
};
