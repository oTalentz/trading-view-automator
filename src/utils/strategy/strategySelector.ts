
import { 
  MarketCondition, 
  MACDData, 
  type BollingerBands 
} from '@/utils/technicalAnalysis';
import { selectTraditionalStrategy } from './traditional/traditionalStrategySelector';
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
  sentimentData: null = null,
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
  
  // Lista de estratégias para o seletor tradicional considerar
  const compatibleStrategies = [
    'RSI_DIVERGENCE', 
    'MACD_CROSSOVER', 
    'BOLLINGER_BREAKOUT', 
    'SUPPORT_RESISTANCE', 
    'TREND_FOLLOWING', 
    'FIBONACCI_RETRACEMENT', 
    'ICHIMOKU_CLOUD'
  ];
  
  // Fallback para seleção tradicional baseada em regras
  return selectTraditionalStrategy(
    compatibleStrategies,
    prices,
    volume,
    rsi,
    macd,
    bollingerBands,
    volatility
  );
};
