
import React from 'react';
import { ConfluenceHeatmap } from '@/components/ConfluenceHeatmap';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid2X2, BarChart3, TrendingUp, TrendingDown, Zap, Target, Activity } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type ConfluenceSectionProps = {
  mockAnalysis: MultiTimeframeAnalysisResult;
};

export function ConfluenceSection({ mockAnalysis }: ConfluenceSectionProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ConfluenceHeatmap analysis={mockAnalysis} />
        
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{t("suggestedStrategy")}</h3>
            </div>
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
              Os indicadores sugerem uma zona de suporte próxima
              localizada em {mockAnalysis.primarySignal.supportResistance?.support || '—'}.
              Esta é uma área onde o preço tende a encontrar pressão de compra.
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
              Os indicadores sugerem uma zona de resistência próxima  
              localizada em {mockAnalysis.primarySignal.supportResistance?.resistance || '—'}.
              Esta é uma área onde o preço tende a encontrar pressão de venda.
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
              A volatilidade atual do mercado está média.
              Mantenha-se atento à possíveis movimentos rápidos de preço.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t("bullishSignals")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Suporte forte em {mockAnalysis.primarySignal.supportResistance?.support || '—'}</li>
              <li>RSI saindo de região de sobrevenda</li>
              <li>Aumento de volume nas velas de alta</li>
              <li>Cruzamento positivo do MACD</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              {t("bearishSignals")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Resistência forte em {mockAnalysis.primarySignal.supportResistance?.resistance || '—'}</li>
              <li>Divergência bearish nos indicadores</li>
              <li>Teste de médias móveis importantes</li>
              <li>Queda do momentum de alta</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            {t("keyLevelsToWatch")}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
      </Card>
    </div>
  );
}
