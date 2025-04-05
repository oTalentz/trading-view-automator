
import React, { useState, useEffect } from 'react';
import { useCorrelationAnalysis } from '@/hooks/useCorrelationAnalysis';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, TrendingDown, ArrowRightLeft, RefreshCw, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface CorrelationAnalysisProps {
  symbol: string;
}

export function CorrelationAnalysis({ symbol }: CorrelationAnalysisProps) {
  const { result, isLoading, error, analyzeCorrelations } = useCorrelationAnalysis(symbol);
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !isRefreshing) {
        analyzeCorrelations();
      }
    }, 120000); // 2 minutes
    
    return () => clearInterval(interval);
  }, [analyzeCorrelations, isLoading, isRefreshing]);

  // Handle manual refresh with visual feedback
  const handleRefresh = () => {
    if (isLoading || isRefreshing) return;
    
    setIsRefreshing(true);
    toast.info(t("updatingCorrelations"), {
      description: t("analyzingMarketRelationships"),
    });
    
    analyzeCorrelations();
    
    // Show completion toast after a delay
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(t("correlationsUpdated"), {
        description: t("latestMarketRelationshipsAvailable"),
      });
    }, 1500);
  };

  // Função para renderizar o ícone de força de correlação
  const renderCorrelationIcon = (strength: string) => {
    switch (strength) {
      case 'strong-positive':
      case 'moderate-positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'strong-negative':
      case 'moderate-negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowRightLeft className="h-4 w-4 text-gray-500" />;
    }
  };

  // Função para obter cor da correlação
  const getCorrelationColor = (correlation: number) => {
    if (correlation >= 0.7) return 'bg-green-500';
    if (correlation >= 0.4) return 'bg-green-400';
    if (correlation >= 0.2) return 'bg-green-300';
    if (correlation >= 0) return 'bg-gray-300';
    if (correlation >= -0.2) return 'bg-red-300';
    if (correlation >= -0.4) return 'bg-red-400';
    return 'bg-red-500';
  };

  // Função para obter a porcentagem da correlação (para o componente Progress)
  const getCorrelationPercentage = (correlation: number) => {
    return (Math.abs(correlation) * 100);
  };

  // Função para traduzir a força da correlação
  const translateStrength = (strength: string) => {
    switch (strength) {
      case 'strong-positive':
        return t('strongPositive');
      case 'moderate-positive':
        return t('moderatePositive');
      case 'weak':
        return t('weak');
      case 'moderate-negative':
        return t('moderateNegative');
      case 'strong-negative':
        return t('strongNegative');
      default:
        return strength;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('assetCorrelation')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground">{t('analyzingCorrelations')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('assetCorrelation')}</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">{t('retry')}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-4">
            <p className="mb-2">{error}</p>
            <Button variant="secondary" size="sm" onClick={handleRefresh}>
              {t('retry')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('assetCorrelation')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">{t('noCorrelationData')}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {t('assetCorrelation')}
            {(isRefreshing || Date.now() - new Date(result.lastUpdated).getTime() < 30000) && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 text-[10px] px-1.5 py-0 h-5 border-green-500/20">
                <Check className="h-3 w-3 mr-0.5" /> 
                {t('realTime')}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal">
              {result.baseAsset.name}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="h-8"
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="sr-only">{t('refresh')}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {result.correlations.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              {t('noCorrelationsFound')}
            </div>
          ) : (
            <>
              {/* Top correlações */}
              <div className="space-y-3">
                {result.correlations.slice(0, 5).map((item) => (
                  <div key={item.symbol} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        {renderCorrelationIcon(item.strength)}
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          item.correlation > 0 ? 'text-green-600' : 
                          item.correlation < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {item.correlation.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={getCorrelationPercentage(item.correlation)} 
                        className={`h-2 ${getCorrelationColor(item.correlation)}`} 
                      />
                      <span className="text-xs text-muted-foreground">
                        {translateStrength(item.strength)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo de correlações */}
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium mb-1">{t('correlationInsights')}:</p>
                {result.highestCorrelation && (
                  <p className="mb-1">
                    <span className="font-medium">{t('highestCorrelation')}:</span> {result.highestCorrelation.name} 
                    ({result.highestCorrelation.correlation > 0 ? '+' : ''}{result.highestCorrelation.correlation.toFixed(2)})
                  </p>
                )}
                <div className="flex justify-between items-center text-xs">
                  <p className="text-muted-foreground">
                    {t('lastUpdated')}: {new Date(result.lastUpdated).toLocaleTimeString()}
                  </p>
                  {Date.now() - new Date(result.lastUpdated).getTime() < 60000 && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 text-[10px] px-1.5 py-0 h-5 border-green-500/20">
                      {t('upToDate')}
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
