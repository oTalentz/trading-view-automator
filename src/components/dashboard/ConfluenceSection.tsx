
import React from 'react';
import { ConfluenceHeatmap } from '@/components/ConfluenceHeatmap';
import { TimeframeConfluence } from '@/components/TimeframeConfluence';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { Card, CardContent } from "@/components/ui/card";
import { Grid2X2, BarChart3 } from 'lucide-react';

type ConfluenceSectionProps = {
  mockAnalysis: MultiTimeframeAnalysisResult;
};

export function ConfluenceSection({ mockAnalysis }: ConfluenceSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ConfluenceHeatmap analysis={mockAnalysis} />
        
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Estratégia Sugerida</h3>
            </div>
            <div className="text-sm space-y-3">
              <p className="pb-2 border-b border-gray-700">
                <span className="font-medium">Estratégia:</span> {mockAnalysis.strategy}
              </p>
              <p className="pb-2 border-b border-gray-700">
                <span className="font-medium">Confiança:</span> {mockAnalysis.overallConfluence}%
              </p>
              <p className="pb-2 border-b border-gray-700">
                <span className="font-medium">Direção:</span> {mockAnalysis.confluenceDirection}
              </p>
              <p>
                <span className="font-medium">Força da Tendência:</span> {mockAnalysis.trendStrength || 'Média'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-orange-500/90 dark:bg-orange-600/80 border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Grid2X2 className="h-5 w-5" />
              <h3 className="text-xl font-bold">Indicadores de Suporte</h3>
            </div>
            <p className="text-sm">
              Os indicadores sugerem uma zona de suporte próxima
              localizada em {mockAnalysis.supportResistance?.support || '—'}.
              Esta é uma área onde o preço tende a encontrar pressão de compra.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-500/90 dark:bg-orange-600/80 border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Grid2X2 className="h-5 w-5" />
              <h3 className="text-xl font-bold">Indicadores de Resistência</h3>
            </div>
            <p className="text-sm">
              Os indicadores sugerem uma zona de resistência próxima  
              localizada em {mockAnalysis.supportResistance?.resistance || '—'}.
              Esta é uma área onde o preço tende a encontrar pressão de venda.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
