
import { useState, useEffect } from 'react';
import { 
  MarketCondition, 
  TrendStrength, 
  calculateVolatility, 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  findSupportResistanceLevels,
  determineMarketCondition,
  calculateTrendStrength,
  calculateSignalQuality,
  calculateOptimalEntryTiming,
  generateSimulatedMarketData
} from '@/utils/technicalAnalysis';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';

export interface MarketAnalysisResult {
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
  countdownSeconds: number;
}

// Lista de estratégias avançadas com descrições
const ADVANCED_STRATEGIES = {
  MACD_CROSSOVER: {
    name: "MACD Crossover",
    minConfidence: 75,
    maxConfidence: 92,
    indicators: ["MACD", "Signal Line", "EMA 200"]
  },
  RSI_DIVERGENCE: {
    name: "RSI Divergence",
    minConfidence: 78,
    maxConfidence: 95,
    indicators: ["RSI(14)", "Price Action", "Support/Resistance"]
  },
  BOLLINGER_BREAKOUT: {
    name: "Bollinger Bands Breakout",
    minConfidence: 80,
    maxConfidence: 93,
    indicators: ["Bollinger Bands", "Volume", "ADX"]
  },
  SUPPORT_RESISTANCE: {
    name: "Key Level Reversal",
    minConfidence: 82,
    maxConfidence: 94,
    indicators: ["Support/Resistance", "Candlestick Patterns", "Volume"]
  },
  TREND_FOLLOWING: {
    name: "Multi-Timeframe Trend",
    minConfidence: 85,
    maxConfidence: 96,
    indicators: ["EMA Stack", "ADX", "Momentum"]
  },
  FIBONACCI_RETRACEMENT: {
    name: "Fibonacci Retracement",
    minConfidence: 83,
    maxConfidence: 97,
    indicators: ["Fibonacci Levels", "Price Action", "Previous Swings"]
  },
  ICHIMOKU_CLOUD: {
    name: "Ichimoku Cloud Analysis",
    minConfidence: 87,
    maxConfidence: 98,
    indicators: ["Kumo Cloud", "Tenkan/Kijun Cross", "Chikou Span"]
  }
};

export function useMarketAnalysis(symbol: string, interval: string = '1') {
  const [analysis, setAnalysis] = useState<MarketAnalysisResult | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { t } = useLanguage();
  
  // Função para analisar o mercado e gerar sinais de alta precisão
  const analyzeMarket = () => {
    // Em um caso real, obteríamos dados históricos reais do mercado
    // Para esta demonstração, usaremos dados simulados
    const { prices, volume } = generateSimulatedMarketData(symbol, 100);
    
    // Análise de mercado avançada
    const marketCondition = determineMarketCondition(prices, volume);
    const { strength: trendStrengthCategory, value: trendStrengthValue } = calculateTrendStrength(prices, volume);
    const supportResistance = findSupportResistanceLevels(prices);
    const rsiValue = calculateRSI(prices);
    const macdData = calculateMACD(prices);
    const bbands = calculateBollingerBands(prices);
    
    // Determina a direção com maior probabilidade de sucesso
    // Baseada em múltiplos fatores técnicos
    let direction: 'CALL' | 'PUT';
    
    // Lógica analítica avançada para determinar a direção
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
    
    // Seleção de estratégia baseada nas condições atuais do mercado
    let selectedStrategy;
    
    switch(marketCondition) {
      case MarketCondition.STRONG_TREND_UP:
      case MarketCondition.STRONG_TREND_DOWN:
        selectedStrategy = ADVANCED_STRATEGIES.TREND_FOLLOWING;
        break;
      case MarketCondition.VOLATILE:
        selectedStrategy = ADVANCED_STRATEGIES.BOLLINGER_BREAKOUT;
        break;
      case MarketCondition.SIDEWAYS:
        if (Math.abs(prices[prices.length-1] - supportResistance.support) < 
            Math.abs(prices[prices.length-1] - supportResistance.resistance)) {
          selectedStrategy = ADVANCED_STRATEGIES.SUPPORT_RESISTANCE;
        } else {
          selectedStrategy = ADVANCED_STRATEGIES.FIBONACCI_RETRACEMENT;
        }
        break;
      default:
        // Escolhe entre divergência RSI e MACD com base nos valores atuais
        selectedStrategy = rsiValue > 65 || rsiValue < 35 ? 
          ADVANCED_STRATEGIES.RSI_DIVERGENCE : 
          ADVANCED_STRATEGIES.MACD_CROSSOVER;
    }
    
    // Calcula pontuação para cada indicador técnico (0-100)
    const rsiScore = Math.abs(rsiValue - 50) * 2; // Quanto mais extremo, maior a pontuação
    const macdScore = Math.abs(macdData.histogram) * 20; // Valor ajustado para escala 0-100
    
    const currentPrice = prices[prices.length - 1];
    const bbRange = bbands.upper - bbands.lower;
    const bbPosition = (currentPrice - bbands.lower) / bbRange; // 0 = lower band, 1 = upper band
    const bbandsScore = (1 - Math.abs(bbPosition - 0.5) * 2) * 100; // 100 quando no meio, 0 nas extremidades
    
    // Análise de volume (simplificada)
    const recentVolumes = volume.slice(-5);
    const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
    const volumeTrend = volume[volume.length - 1] / avgVolume * 50;
    
    // Análise de price action (simplificada)
    const priceActionScore = (trendStrengthValue / 100) * 80 + 20;
    
    // Score geral baseado em todos os fatores
    const overallScore = (
      rsiScore * 0.2 + 
      macdScore * 0.2 + 
      bbandsScore * 0.15 + 
      volumeTrend * 0.15 + 
      priceActionScore * 0.3
    );
    
    // Calcular confiança final baseada na estratégia e análise técnica
    const baseConfidence = (selectedStrategy.minConfidence + selectedStrategy.maxConfidence) / 2;
    const confidenceAdjustment = (overallScore - 50) / 2;
    const confidence = Math.round(Math.min(Math.max(baseConfidence + confidenceAdjustment, 70), 98));
    
    // Calcular tempo ótimo de entrada (próximo minuto exato)
    const secondsToNextMinute = calculateOptimalEntryTiming();
    const now = new Date();
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
    
    // Resultado da análise
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
      technicalScores: {
        rsi: Math.round(rsiScore),
        macd: Math.round(macdScore),
        bollingerBands: Math.round(bbandsScore),
        volumeTrend: Math.round(volumeTrend),
        priceAction: Math.round(priceActionScore),
        overallScore: Math.round(overallScore)
      },
      countdownSeconds: secondsToNextMinute
    };
    
    setAnalysis(result);
    setCountdown(secondsToNextMinute);
    
    // Notifica o usuário com um toast
    toast.success(
      direction === 'CALL' 
        ? t("signalCallGenerated") 
        : t("signalPutGenerated"), 
      {
        description: `${t("confidence")}: ${confidence}% - ${symbol} - ${t("entryIn")}: ${secondsToNextMinute}s`,
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
              analysis.direction === 'CALL' 
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
    analyzeMarket(); // Análise inicial
    
    const analysisInterval = setInterval(() => {
      analyzeMarket();
    }, 5 * 60 * 1000); // A cada 5 minutos
    
    return () => clearInterval(analysisInterval);
  }, [symbol, interval]);
  
  return {
    analysis,
    countdown,
    analyzeMarket
  };
}
