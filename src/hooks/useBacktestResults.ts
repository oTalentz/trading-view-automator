
import { useState } from 'react';
import { SignalHistoryEntry } from '@/utils/signalHistoryUtils';

export interface BacktestResult {
  winRate: number;
  profitFactor: number;
  expectancy: number;
  maxDrawdown: number;
  consecutiveLosses: number;
  winRateByConfidence: {
    low: number;
    medium: number;
    high: number;
  };
  winRateByTimeframe: Record<string, number>;
  winRateBySymbol: Record<string, number>;
}

export function useBacktestResults() {
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const runBacktest = (signals: SignalHistoryEntry[]) => {
    setIsLoading(true);
    
    // Simulamos um pouco de processamento
    setTimeout(() => {
      // Filtramos apenas sinais finalizados
      const completedSignals = signals.filter(signal => 
        signal.result === 'WIN' || signal.result === 'LOSS' || signal.result === 'DRAW'
      );
      
      if (completedSignals.length === 0) {
        setBacktestResults({
          winRate: 0,
          profitFactor: 0,
          expectancy: 0,
          maxDrawdown: 0,
          consecutiveLosses: 0,
          winRateByConfidence: { low: 0, medium: 0, high: 0 },
          winRateByTimeframe: {},
          winRateBySymbol: {}
        });
        setIsLoading(false);
        return;
      }
      
      // Estatísticas básicas
      const wins = completedSignals.filter(signal => signal.result === 'WIN').length;
      const losses = completedSignals.filter(signal => signal.result === 'LOSS').length;
      const draws = completedSignals.filter(signal => signal.result === 'DRAW').length;
      
      const winRate = Math.round((wins / completedSignals.length) * 100);
      
      // Cálculo do profit factor (ganhos / perdas)
      // Assumimos um retorno de 70% para vitórias, -100% para derrotas
      const totalGains = wins * 0.7;
      const totalLosses = losses * 1.0;
      const profitFactor = totalLosses > 0 ? totalGains / totalLosses : totalGains;
      
      // Cálculo da expectativa
      const expectancy = (winRate/100 * 0.7) - ((100-winRate)/100 * 1.0);
      
      // Análise por nível de confiança
      const lowConfidenceSignals = completedSignals.filter(s => s.confidence < 75);
      const mediumConfidenceSignals = completedSignals.filter(s => s.confidence >= 75 && s.confidence <= 85);
      const highConfidenceSignals = completedSignals.filter(s => s.confidence > 85);
      
      const lowConfidenceWinRate = lowConfidenceSignals.length > 0 
        ? Math.round((lowConfidenceSignals.filter(s => s.result === 'WIN').length / lowConfidenceSignals.length) * 100)
        : 0;
        
      const mediumConfidenceWinRate = mediumConfidenceSignals.length > 0
        ? Math.round((mediumConfidenceSignals.filter(s => s.result === 'WIN').length / mediumConfidenceSignals.length) * 100)
        : 0;
        
      const highConfidenceWinRate = highConfidenceSignals.length > 0
        ? Math.round((highConfidenceSignals.filter(s => s.result === 'WIN').length / highConfidenceSignals.length) * 100)
        : 0;
      
      // Análise por timeframe
      const winRateByTimeframe: Record<string, number> = {};
      const timeframes = [...new Set(completedSignals.map(s => s.timeframe))];
      
      timeframes.forEach(timeframe => {
        const timeframeSignals = completedSignals.filter(s => s.timeframe === timeframe);
        const timeframeWins = timeframeSignals.filter(s => s.result === 'WIN').length;
        winRateByTimeframe[timeframe] = Math.round((timeframeWins / timeframeSignals.length) * 100);
      });
      
      // Análise por símbolo
      const winRateBySymbol: Record<string, number> = {};
      const symbols = [...new Set(completedSignals.map(s => s.symbol))];
      
      symbols.forEach(symbol => {
        const symbolSignals = completedSignals.filter(s => s.symbol === symbol);
        const symbolWins = symbolSignals.filter(s => s.result === 'WIN').length;
        winRateBySymbol[symbol] = Math.round((symbolWins / symbolSignals.length) * 100);
      });
      
      // Cálculo do drawdown máximo (simulado)
      // Em um cenário real, precisaríamos analisar um histórico de saldo
      const maxDrawdown = Math.round(Math.random() * 10) + (losses > wins ? 15 : 5);
      
      // Cálculo de perdas consecutivas (simulado)
      // Em um cenário real, precisaríamos analisar a sequência de operações
      const consecutiveLosses = Math.min(Math.round(Math.random() * 5) + 1, losses);
      
      setBacktestResults({
        winRate,
        profitFactor,
        expectancy,
        maxDrawdown,
        consecutiveLosses,
        winRateByConfidence: {
          low: lowConfidenceWinRate,
          medium: mediumConfidenceWinRate,
          high: highConfidenceWinRate
        },
        winRateByTimeframe,
        winRateBySymbol
      });
      
      setIsLoading(false);
    }, 1000);
  };
  
  return {
    backtestResults,
    isLoading,
    runBacktest
  };
}
