
import React, { useState } from 'react';
import { ConfluenceHeatmap } from '@/components/ConfluenceHeatmap';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid2X2, BarChart3, TrendingUp, TrendingDown, Zap, Target, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

type ConfluenceSectionProps = {
  mockAnalysis: MultiTimeframeAnalysisResult;
};

export function ConfluenceSection({ mockAnalysis }: ConfluenceSectionProps) {
  const { t } = useLanguage();
  const [expandedCards, setExpandedCards] = useState({
    strategy: true,
    keyLevels: true,
    signals: false
  });
  
  const toggleCard = (card: keyof typeof expandedCards) => {
    setExpandedCards(prev => ({
      ...prev,
      [card]: !prev[card]
    }));
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ConfluenceHeatmap analysis={mockAnalysis} />
        
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-center justify-between cursor-pointer"
            onClick={() => toggleCard('strategy')}>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t("suggestedStrategy")}
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white">
              {expandedCards.strategy ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>
          {expandedCards.strategy && (
            <CardContent className="p-4">
              <div className="text-sm space-y-3">
                <p className="pb-2 border-b border-gray-700">
                  <span className="font-medium">Estratégia:</span> {mockAnalysis.primarySignal.strategy}
                </p>
                <p className="pb-2 border-b border-gray-700">
                  <span className="font-medium">Confiança:</span> {mockAnalysis.overallConfluence}%
                </p>
                <p className="pb-2 border-b border-gray-700">
                  <span className="font-medium">Direção:</span> {mockAnalysis.confluenceDirection}
                </p>
                <p>
                  <span className="font-medium">Força da Tendência:</span> {mockAnalysis.primarySignal.trendStrength || 'Média'}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-orange-500/90 dark:bg-orange-600/80 border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Grid2X2 className="h-5 w-5" />
              <h3 className="text-xl font-bold">{t("supportIndicators")}</h3>
            </div>
            <p className="text-sm">
              {t("supportZoneDescription")} {mockAnalysis.primarySignal.supportResistance?.support || '—'}.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-500/90 dark:bg-orange-600/80 border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Grid2X2 className="h-5 w-5" />
              <h3 className="text-xl font-bold">{t("resistanceIndicators")}</h3>
            </div>
            <p className="text-sm">
              {t("resistanceZoneDescription")} {mockAnalysis.primarySignal.supportResistance?.resistance || '—'}.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-500/90 dark:bg-blue-600/80 border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5" />
              <h3 className="text-xl font-bold">{t("marketVolatility")}</h3>
            </div>
            <p className="text-sm">
              {t("currentVolatilityDescription")}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-primary/20">
        <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-center justify-between cursor-pointer"
          onClick={() => toggleCard('keyLevels')}>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            {t("keyLevelsToWatch")}
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {expandedCards.keyLevels ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {expandedCards.keyLevels && (
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="font-medium text-green-600 dark:text-green-400">Suporte Forte</p>
                <p className="text-xl font-bold">{mockAnalysis.primarySignal.supportResistance?.support ? (mockAnalysis.primarySignal.supportResistance.support * 0.99).toFixed(2) : '—'}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                <p className="font-medium text-green-600 dark:text-green-400">Suporte Fraco</p>
                <p className="text-xl font-bold">{mockAnalysis.primarySignal.supportResistance?.support || '—'}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <p className="font-medium text-red-600 dark:text-red-400">Resistência Fraca</p>
                <p className="text-xl font-bold">{mockAnalysis.primarySignal.supportResistance?.resistance || '—'}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="font-medium text-red-600 dark:text-red-400">Resistência Forte</p>
                <p className="text-xl font-bold">{mockAnalysis.primarySignal.supportResistance?.resistance ? (mockAnalysis.primarySignal.supportResistance.resistance * 1.01).toFixed(2) : '—'}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-center justify-between cursor-pointer"
            onClick={() => toggleCard('signals')}>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t("marketSignals")}
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {expandedCards.signals ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>
          {expandedCards.signals && (
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2 text-green-600 dark:text-green-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {t("bullishSignals")}
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Suporte forte em {mockAnalysis.primarySignal.supportResistance?.support || '—'}</li>
                    <li>RSI saindo de região de sobrevenda</li>
                    <li>Aumento de volume nas velas de alta</li>
                    <li>Cruzamento positivo do MACD</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    {t("bearishSignals")}
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Resistência forte em {mockAnalysis.primarySignal.supportResistance?.resistance || '—'}</li>
                    <li>Divergência bearish nos indicadores</li>
                    <li>Teste de médias móveis importantes</li>
                    <li>Queda do momentum de alta</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
