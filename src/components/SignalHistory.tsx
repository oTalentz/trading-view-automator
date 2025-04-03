
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getSignalHistory, SignalHistoryEntry, exportSignalHistory } from '@/utils/signalHistoryUtils';
import { ArrowUpCircle, ArrowDownCircle, Clock, Download, Trash2, Check, X, Minus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBacktestResults } from '@/hooks/useBacktestResults';
import { Progress } from '@/components/ui/progress';
import { AlertConfig } from '@/types/userProfile';

export function SignalHistory() {
  const { t, language } = useLanguage();
  const [signals, setSignals] = useState<SignalHistoryEntry[]>(getSignalHistory());
  const { backtestResults, runBacktest } = useBacktestResults();
  const [showBacktestCard, setShowBacktestCard] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(getSignalHistory());
    }, 60000); // Atualiza a cada minuto
    
    return () => clearInterval(interval);
  }, []);
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(language === 'pt-br' ? 'pt-BR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(language === 'pt-br' ? 'pt-BR' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getResultBadgeClass = (result: 'WIN' | 'LOSS' | 'DRAW' | null | undefined) => {
    switch (result) {
      case 'WIN':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'LOSS':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'DRAW':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
    }
  };
  
  const getResultIcon = (result: 'WIN' | 'LOSS' | 'DRAW' | null | undefined) => {
    switch (result) {
      case 'WIN':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'LOSS':
        return <X className="h-4 w-4 text-red-500" />;
      case 'DRAW':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };
  
  const handleExport = () => {
    const csv = exportSignalHistory();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `signal-history-${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(t("exportSuccess"), { 
      description: t("signalHistoryExported")
    });
  };
  
  const handleBacktest = () => {
    runBacktest(signals);
    setShowBacktestCard(true);
    
    toast.success(t("backtestStarted"), { 
      description: t("analyzingSignals")
    });
  };
  
  const handleClearHistory = () => {
    if (window.confirm(t("clearHistoryConfirm"))) {
      localStorage.removeItem('trading-automator-signal-history');
      setSignals([]);
      setShowBacktestCard(false);
      toast.success(t("historyCleared"));
    }
  };
  
  // Calculate metrics
  const completedSignals = signals.filter(s => s.result !== null && s.result !== undefined);
  const winningSignals = signals.filter(s => s.result === 'WIN');
  const winRate = completedSignals.length > 0 
    ? Math.round((winningSignals.length / completedSignals.length) * 100) 
    : 0;
  
  if (signals.length === 0) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">{t("noSignalHistory")}</h3>
          <p className="text-muted-foreground">{t("signalsWillAppearHere")}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {showBacktestCard && backtestResults && (
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> {t("backtestResults")}
            </CardTitle>
            <CardDescription>{t("historicalPerformanceAnalysis")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("profitFactor")}</h4>
                <p className={`text-2xl font-bold ${
                  backtestResults.profitFactor > 1.5 ? 'text-green-600' : 
                  backtestResults.profitFactor > 1 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {backtestResults.profitFactor.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{t("profitFactorDesc")}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("expectancy")}</h4>
                <p className={`text-2xl font-bold ${
                  backtestResults.expectancy > 0.2 ? 'text-green-600' : 
                  backtestResults.expectancy > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {backtestResults.expectancy.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{t("expectancyDesc")}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("maxDrawdown")}</h4>
                <p className={`text-2xl font-bold ${
                  backtestResults.maxDrawdown < 10 ? 'text-green-600' : 
                  backtestResults.maxDrawdown < 20 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {backtestResults.maxDrawdown}%
                </p>
                <p className="text-xs text-muted-foreground">{t("maxDrawdownDesc")}</p>
              </div>
            </div>
            
            <div className="space-y-1.5 mb-3">
              <h4 className="text-sm font-medium">{t("winRateByConfidence")}</h4>
              <div className="flex justify-between text-xs mb-1">
                <span>{t("lowConfidence")} (&lt;75%)</span>
                <span>{backtestResults.winRateByConfidence.low}%</span>
              </div>
              <Progress value={backtestResults.winRateByConfidence.low} className="h-2" />
              
              <div className="flex justify-between text-xs mb-1 pt-1">
                <span>{t("mediumConfidence")} (75-85%)</span>
                <span>{backtestResults.winRateByConfidence.medium}%</span>
              </div>
              <Progress value={backtestResults.winRateByConfidence.medium} className="h-2" />
              
              <div className="flex justify-between text-xs mb-1 pt-1">
                <span>{t("highConfidence")} (&gt;85%)</span>
                <span>{backtestResults.winRateByConfidence.high}%</span>
              </div>
              <Progress value={backtestResults.winRateByConfidence.high} className="h-2" />
            </div>
            
            <div className="space-y-1.5 mb-3">
              <h4 className="text-sm font-medium">{t("winRateByTimeframe")}</h4>
              {Object.entries(backtestResults.winRateByTimeframe).map(([timeframe, rate]) => (
                <div key={timeframe}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{timeframe} {t("minute")}</span>
                    <span>{rate}%</span>
                  </div>
                  <Progress value={rate} className="h-2" />
                </div>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              {t("backtestDisclaimer")}
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="border rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">{t("signalHistory")}</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleBacktest}>
              <BarChart3 className="h-4 w-4 mr-1" />
              {t("backtest")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              {t("export")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearHistory}>
              <Trash2 className="h-4 w-4 mr-1" />
              {t("clear")}
            </Button>
          </div>
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
          <div className="text-sm">
            {t("totalSignals")}: <strong>{signals.length}</strong>
          </div>
          <div className="text-sm">
            {t("winRate")}: <strong className={winRate > 55 ? 'text-green-600' : winRate < 45 ? 'text-red-600' : 'text-yellow-600'}>
              {winRate}%
            </strong> 
            ({winningSignals.length}/{completedSignals.length})
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("symbol")}</TableHead>
                <TableHead>{t("direction")}</TableHead>
                <TableHead>{t("timeframe")}</TableHead>
                <TableHead>{t("confidence")}</TableHead>
                <TableHead>{t("result")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signals.map((signal) => (
                <TableRow key={signal.id}>
                  <TableCell>
                    <div className="font-medium">{formatDate(signal.timestamp)}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(signal.timestamp)}</div>
                  </TableCell>
                  <TableCell>{signal.symbol.split(':')[1]}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {signal.direction === 'CALL' ? (
                        <ArrowUpCircle className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      {signal.direction}
                    </div>
                  </TableCell>
                  <TableCell>{signal.timeframe}</TableCell>
                  <TableCell>{signal.confidence}%</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getResultBadgeClass(signal.result)}`}>
                      {getResultIcon(signal.result)}
                      <span className="ml-1">{signal.result || t("pending")}</span>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
