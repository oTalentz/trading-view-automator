
import { useState, useEffect } from 'react';
import { 
  MarketCondition, 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  findSupportResistanceLevels,
  determineMarketCondition,
  calculateTrendStrength,
  generateSimulatedMarketData
} from '@/utils/technicalAnalysis';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';

export interface TimeframeAnalysis {
  direction: 'CALL' | 'PUT';
  confidence: number;
  strength: number;
  timeframe: string;
  label: string;
  marketCondition: MarketCondition;
}

export interface MultiTimeframeAnalysisResult {
  primarySignal: {
    direction: 'CALL' | 'PUT';
    confidence: number;
    timestamp: string;
    entryTime: string;
    expiryTime: string;
    strategy: string;
    indicators: string[];
    trendStrength: number;
    marketCondition: MarketCondition;
    supportResistance: {
      support: number;
      resistance: number;
    };
    technicalScores: {
      rsi: number;
      macd: number;
      bollingerBands: number;
      volumeTrend: number;
      priceAction: number;
      overallScore: number;
    };
  };
  timeframes: TimeframeAnalysis[];
  overallConfluence: number;
  confluenceDirection: 'CALL' | 'PUT' | 'NEUTRAL';
  countdown: number;
}

// Lista de timeframes a analisar para confluência
const CONFLUENCE_TIMEFRAMES = [
  { value: "1", label: "1m" },
  { value: "5", label: "5m" },
  { value: "15", label: "15m" },
  { value: "60", label: "1h" }
];

export function useMultiTimeframeAnalysis(symbol: string, interval: string = '1') {
  const [analysis, setAnalysis] = useState<MultiTimeframeAnalysisResult | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { t } = useLanguage();
  
  // Função para analisar um timeframe específico
  const analyzeTimeframe = (timeframe: string, label: string): TimeframeAnalysis => {
    const { prices, volume } = generateSimulatedMarketData(
      symbol + "_" + timeframe, // Adicionamos o timeframe ao símbolo para gerar dados diferentes
      100
    );
    
    // Análise técnica para este timeframe
    const marketCondition = determineMarketCondition(prices, volume);
    const { value: trendStrengthValue } = calculateTrendStrength(prices, volume);
    const rsiValue = calculateRSI(prices);
    const macdData = calculateMACD(prices);
    const bbands = calculateBollingerBands(prices);
    
    // Determina a direção com base nos indicadores técnicos
    let direction: 'CALL' | 'PUT';
    
    if (marketCondition === MarketCondition.STRONG_TREND_UP || 
        marketCondition === MarketCondition.TREND_UP) {
      direction = 'CALL';
    } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN || 
              marketCondition === MarketCondition.TREND_DOWN) {
      direction = 'PUT';
    } else {
      // Para mercados laterais ou voláteis, usamos mais indicadores
      const currentPrice = prices[prices.length - 1];
      
      if (rsiValue < 30 && currentPrice < bbands.lower) {
        direction = 'CALL'; // Possível sobrevendido
      } else if (rsiValue > 70 && currentPrice > bbands.upper) {
        direction = 'PUT'; // Possível sobrecomprado
      } else if (macdData.histogram > 0 && macdData.histogram > macdData.histogram * 1.1) {
        direction = 'CALL'; // Momentum positivo
      } else if (macdData.histogram < 0 && macdData.histogram < macdData.histogram * 1.1) {
        direction = 'PUT'; // Momentum negativo
      } else {
        // Sem sinal claro, escolhemos com base em tendência de mais longo prazo
        direction = trendStrengthValue > 50 ? 'CALL' : 'PUT';
      }
    }
    
    // Calcula confiança baseada nos indicadores e condição do mercado
    let confidence = 70; // Base
    
    if (marketCondition === MarketCondition.STRONG_TREND_UP && direction === 'CALL') {
      confidence += 15;
    } else if (marketCondition === MarketCondition.STRONG_TREND_DOWN && direction === 'PUT') {
      confidence += 15;
    } else if (
      (marketCondition === MarketCondition.TREND_UP && direction === 'CALL') || 
      (marketCondition === MarketCondition.TREND_DOWN && direction === 'PUT')
    ) {
      confidence += 10;
    }
    
    // Ajusta com base no RSI
    if ((direction === 'CALL' && rsiValue < 30) || (direction === 'PUT' && rsiValue > 70)) {
      confidence += 5;
    }
    
    // Ajusta com base no MACD
    if ((direction === 'CALL' && macdData.histogram > 0) || 
        (direction === 'PUT' && macdData.histogram < 0)) {
      confidence += 5;
    }
    
    // Limita a confiança máxima
    confidence = Math.min(confidence, 95);
    
    return {
      direction,
      confidence,
      strength: trendStrengthValue,
      timeframe,
      label,
      marketCondition
    };
  };

  // Função principal que analisa todos os timeframes e calcula confluência
  const analyzeAllTimeframes = () => {
    // Analisa cada timeframe
    const timeframeAnalyses = CONFLUENCE_TIMEFRAMES.map(tf => 
      analyzeTimeframe(tf.value, tf.label)
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
    
    // Gera o sinal principal para o timeframe selecionado
    const { prices, volume } = generateSimulatedMarketData(symbol, 100);
    const supportResistance = findSupportResistanceLevels(prices);
    const now = new Date();
    
    // Calcula tempo ótimo de entrada (próximo minuto exato)
    const secondsToNextMinute = 60 - now.getSeconds();
    const entryTimeMillis = now.getTime() + (secondsToNextMinute * 1000);
    const entryTime = new Date(entryTimeMillis);
    
    // A expiração depende do intervalo selecionado
    let expiryMinutes = 1; // Padrão para timeframes de 1 minuto
    
    switch(interval) {
      case '1': expiryMinutes = 1; break;
      case '5': expiryMinutes = 5; break;
      case '15': expiryMinutes = 15; break;
      case '30': expiryMinutes = 30; break;
      case '60': expiryMinutes = 60; break;
      case '240': expiryMinutes = 240; break;
      case 'D': expiryMinutes = 1440; break; // 24 horas
      case 'W': expiryMinutes = 10080; break; // 7 dias
      default: expiryMinutes = 1;
    }
    
    // Tempo de expiração exato
    const expiryTimeMillis = entryTimeMillis + (expiryMinutes * 60 * 1000);
    const expiryTime = new Date(expiryTimeMillis);
    
    // Ajusta a confiança baseada na confluência geral
    let adjustedConfidence = selectedAnalysis.confidence;
    if (selectedAnalysis.direction === confluenceDirection) {
      adjustedConfidence = Math.min(adjustedConfidence + (overallConfluence / 10), 98);
    } else if (confluenceDirection !== 'NEUTRAL') {
      adjustedConfidence = Math.max(adjustedConfidence - (overallConfluence / 5), 65);
    }
    
    // Resultado final com confluência de múltiplos timeframes
    const result: MultiTimeframeAnalysisResult = {
      primarySignal: {
        direction: selectedAnalysis.direction,
        confidence: Math.round(adjustedConfidence),
        timestamp: now.toISOString(),
        entryTime: entryTime.toISOString(),
        expiryTime: expiryTime.toISOString(),
        strategy: "Multi-Timeframe Confluence",
        indicators: [
          "RSI", "MACD", "Bollinger Bands", 
          "Multi-Timeframe Confluence", "Trend Analysis"
        ],
        trendStrength: selectedAnalysis.strength,
        marketCondition: selectedAnalysis.marketCondition,
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
        }
      },
      timeframes: timeframeAnalyses,
      overallConfluence,
      confluenceDirection,
      countdown: secondsToNextMinute
    };
    
    setAnalysis(result);
    setCountdown(secondsToNextMinute);
    
    // Notifica o usuário sobre o sinal com informação de confluência
    const confidenceText = confluenceDirection === result.primarySignal.direction ? 
      `${t("highConfluence")} (${overallConfluence}%)` : 
      `${t("mixedSignals")}`;
      
    toast.success(
      result.primarySignal.direction === 'CALL' 
        ? t("signalCallGenerated") 
        : t("signalPutGenerated"), 
      {
        description: `${t("confidence")}: ${result.primarySignal.confidence}% - ${confidenceText} - ${symbol} - ${t("entryIn")}: ${secondsToNextMinute}s`,
        duration: 5000,
      }
    );
  };
  
  // Inicia o contador regressivo e atualiza a cada segundo
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          
          // Quando chega a zero, notifica que é hora da entrada
          if (analysis) {
            toast.info(
              analysis.primarySignal.direction === 'CALL' 
                ? `${t("executeCall")} ${symbol}` 
                : `${t("executePut")} ${symbol}`,
              { description: t("preciseEntryNow") }
            );
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown, analysis, symbol, t]);
  
  // Gera análise inicial e a cada 5 minutos
  useEffect(() => {
    analyzeAllTimeframes(); // Análise inicial
    
    const analysisInterval = setInterval(() => {
      analyzeAllTimeframes();
    }, 5 * 60 * 1000); // A cada 5 minutos
    
    return () => clearInterval(analysisInterval);
  }, [symbol, interval]);
  
  return {
    analysis,
    countdown,
    analyzeMarket: analyzeAllTimeframes
  };
}
