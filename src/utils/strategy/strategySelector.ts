
import { 
  MarketCondition, 
  MACDData, 
  BollingerBands 
} from '@/utils/technicalAnalysis';
import { traditionalStrategySelector } from './traditional/traditionalStrategySelector';
import { StrategyWithDetails } from './types';
import { getMLStrategySelection } from '@/utils/ml/strategyOptimizer';

/**
 * Seleciona a estratégia mais adequada com base nas condições do mercado e indicadores técnicos
 * Pode usar aprendizado de máquina para decisões mais inteligentes se useML = true
 */
export const selectStrategy = (
  marketCondition: MarketCondition,
  prices: number[],
  volume: number[],
  rsi: number,
  macd: MACDData,
  bollingerBands: BollingerBands,
  volatility: number,
  trendStrength: number,
  sentimentData: null = null, // Modifying to accept null instead of SentimentAnalysisResult
  useML: boolean = false
): StrategyWithDetails => {
  // Se o modelo de ML estiver disponível e ativado, usar para seleção de estratégia
  if (useML) {
    const mlStrategy = getMLStrategySelection(
      marketCondition,
      prices,
      volume,
      rsi,
      macd,
      bollingerBands,
      volatility,
      trendStrength,
      sentimentData
    );
    
    if (mlStrategy) {
      return mlStrategy;
    }
  }
  
  // Fallback para seleção tradicional baseada em regras
  return traditionalStrategySelector(
    marketCondition,
    prices,
    volume,
    rsi,
    macd,
    bollingerBands,
    volatility,
    trendStrength
  );
};
