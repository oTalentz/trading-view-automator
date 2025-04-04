
import { useState, useEffect } from 'react';
import { calculateCorrelation, calculateMultipleCorrelations } from '@/utils/analysis/correlationCalculator';
import { generateSimulatedMarketData } from '@/utils/technicalAnalysis';

export interface AssetCorrelation {
  symbol: string;
  name: string;
  correlation: number;
  strength: 'strong-positive' | 'moderate-positive' | 'weak' | 'moderate-negative' | 'strong-negative';
}

export interface CorrelationAnalysisResult {
  baseAsset: {
    symbol: string;
    name: string;
  };
  correlations: AssetCorrelation[];
  lastUpdated: string;
  highestCorrelation: AssetCorrelation | null;
  lowestCorrelation: AssetCorrelation | null;
}

/**
 * Determina a força da correlação
 */
const determineCorrelationStrength = (correlation: number): AssetCorrelation['strength'] => {
  const absCorrelation = Math.abs(correlation);
  
  if (correlation >= 0.7) return 'strong-positive';
  if (correlation >= 0.4) return 'moderate-positive';
  if (correlation <= -0.7) return 'strong-negative';
  if (correlation <= -0.4) return 'moderate-negative';
  return 'weak';
};

/**
 * Hook para análise de correlação entre ativos
 */
export function useCorrelationAnalysis(baseSymbol: string) {
  const [result, setResult] = useState<CorrelationAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para analisar correlações
  const analyzeCorrelations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Gerar dados simulados para o ativo base
      const { prices: basePrices } = generateSimulatedMarketData(baseSymbol, 100);
      
      // Lista de ativos para comparação
      const comparisonAssets = [
        { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum' },
        { symbol: 'BINANCE:SOLUSDT', name: 'Solana' },
        { symbol: 'BINANCE:BNBUSDT', name: 'Binance Coin' },
        { symbol: 'BINANCE:ADAUSDT', name: 'Cardano' },
        { symbol: 'FX:EURUSD', name: 'EUR/USD' },
        { symbol: 'FX:GBPUSD', name: 'GBP/USD' },
        { symbol: 'FX:USDJPY', name: 'USD/JPY' },
        { symbol: 'NASDAQ:AAPL', name: 'Apple' },
        { symbol: 'NASDAQ:MSFT', name: 'Microsoft' },
        { symbol: 'NASDAQ:AMZN', name: 'Amazon' },
      ].filter(asset => asset.symbol !== baseSymbol);
      
      // Gerar dados para cada ativo de comparação e calcular correlações
      const correlationsData: Record<string, number[]> = {};
      
      for (const asset of comparisonAssets) {
        const { prices } = generateSimulatedMarketData(asset.symbol, 100);
        correlationsData[asset.symbol] = prices;
      }
      
      // Calcular correlações
      const correlationValues = calculateMultipleCorrelations(basePrices, correlationsData);
      
      // Formatar resultados
      const correlations: AssetCorrelation[] = comparisonAssets.map(asset => {
        const correlation = correlationValues[asset.symbol] || 0;
        return {
          symbol: asset.symbol,
          name: asset.name,
          correlation: Number(correlation.toFixed(3)),
          strength: determineCorrelationStrength(correlation)
        };
      });
      
      // Ordenar por magnitude de correlação (absoluta)
      correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
      
      // Encontrar maior e menor correlação
      const highestCorrelation = correlations.length > 0 ? correlations[0] : null;
      const lowestCorrelation = correlations.length > 0 ? correlations[correlations.length - 1] : null;
      
      // Extrair nome do ativo base
      const baseAssetName = baseSymbol.split(':')[1]?.replace(/USDT|USD/, '') || baseSymbol;
      
      // Criar resultado
      const analysisResult: CorrelationAnalysisResult = {
        baseAsset: {
          symbol: baseSymbol,
          name: baseAssetName
        },
        correlations,
        lastUpdated: new Date().toISOString(),
        highestCorrelation,
        lowestCorrelation
      };
      
      setResult(analysisResult);
      
    } catch (err) {
      console.error('Erro na análise de correlação:', err);
      setError('Falha ao analisar correlações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Analisar correlações quando o símbolo base muda
  useEffect(() => {
    analyzeCorrelations();
  }, [baseSymbol]);
  
  return {
    result,
    isLoading,
    error,
    analyzeCorrelations
  };
}
