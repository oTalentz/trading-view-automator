
import React, { useState } from 'react';
import { TradingViewWidget } from '@/components/TradingViewWidget';
import { Navbar } from '@/components/Navbar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { useMultiTimeframeAnalysis } from '@/hooks/useMultiTimeframeAnalysis';
import { OTCMarketStatus } from '@/components/OTC/OTCMarketStatus';
import { OTCAssetList } from '@/components/OTC/OTCAssetList';

// Lista de ativos OTC da Pocket Option
const OTC_ASSETS = [
  { value: "POCKETOPTION:EURUSD-OTC", label: "EUR/USD OTC" },
  { value: "POCKETOPTION:GBPUSD-OTC", label: "GBP/USD OTC" },
  { value: "POCKETOPTION:USDJPY-OTC", label: "USD/JPY OTC" },
  { value: "POCKETOPTION:USDCHF-OTC", label: "USD/CHF OTC" },
  { value: "POCKETOPTION:AUDUSD-OTC", label: "AUD/USD OTC" },
  { value: "POCKETOPTION:USDCAD-OTC", label: "USD/CAD OTC" },
  { value: "POCKETOPTION:EURGBP-OTC", label: "EUR/GBP OTC" },
  { value: "POCKETOPTION:EURJPY-OTC", label: "EUR/JPY OTC" },
];

// Timeframes disponíveis
const TIMEFRAMES = [
  { value: "1", label: "1 Minuto" },
  { value: "5", label: "5 Minutos" },
  { value: "15", label: "15 Minutos" },
  { value: "30", label: "30 Minutos" },
  { value: "60", label: "1 Hora" },
];

const PocketOptionOTC: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>(OTC_ASSETS[0].value);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1");
  const { analysis, countdown, isLoading, analyzeMarket } = useMultiTimeframeAnalysis(selectedAsset, selectedTimeframe);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto p-4 flex-1">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Pocket Option OTC</h1>
              <p className="text-muted-foreground">
                Análise em tempo real dos mercados OTC da Pocket Option
              </p>
            </div>
            <OTCMarketStatus />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Ativos OTC</CardTitle>
                <CardDescription>Selecione o ativo OTC para análise</CardDescription>
              </CardHeader>
              <CardContent>
                <OTCAssetList
                  assets={OTC_ASSETS}
                  selectedAsset={selectedAsset}
                  onAssetChange={setSelectedAsset}
                />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Timeframe</CardTitle>
                <CardDescription>Selecione o intervalo de tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEFRAMES.map((timeframe) => (
                      <SelectItem key={timeframe.value} value={timeframe.value}>
                        {timeframe.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tempo para Entrada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold">
                    {countdown || 0}s
                  </div>
                  {analysis && (
                    <Badge 
                      className={`mt-2 ${
                        analysis.primarySignal.direction === 'CALL' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {analysis.primarySignal.direction === 'CALL' ? 'COMPRA' : 'VENDA'}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Confluência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">
                    {analysis?.overallConfluence || 0}%
                  </div>
                  {analysis && (
                    <Badge 
                      className={`mt-2 ${
                        analysis.confluenceDirection === 'CALL' ? 'bg-green-500' : 
                        analysis.confluenceDirection === 'PUT' ? 'bg-red-500' : 'bg-orange-500'
                      }`}
                    >
                      {analysis.confluenceDirection === 'CALL' ? 'ALTA' : 
                       analysis.confluenceDirection === 'PUT' ? 'BAIXA' : 'NEUTRO'}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <TradingViewWidget symbol={selectedAsset} interval={selectedTimeframe} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Sinal</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Direção:</span>
                      <span className={`font-medium ${
                        analysis.primarySignal.direction === 'CALL' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {analysis.primarySignal.direction === 'CALL' ? 'COMPRA' : 'VENDA'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confiança:</span>
                      <span className="font-medium">{analysis.primarySignal.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estratégia:</span>
                      <span className="font-medium">{analysis.primarySignal.strategy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expiração:</span>
                      <span className="font-medium">
                        {new Date(analysis.primarySignal.expiryTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Aguardando análise...
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Suporte e Resistência</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Suporte:</span>
                      <span className="font-medium text-green-500">
                        {analysis.primarySignal.supportResistance.support}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resistência:</span>
                      <span className="font-medium text-red-500">
                        {analysis.primarySignal.supportResistance.resistance}
                      </span>
                    </div>
                    {analysis.primarySignal.priceTargets && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Alvo de Preço:</span>
                          <span className="font-medium">
                            {analysis.primarySignal.priceTargets.target}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stop Loss:</span>
                          <span className="font-medium">
                            {analysis.primarySignal.priceTargets.stopLoss}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Aguardando análise...
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Qualidade da Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Qualidade:</span>
                      <span className="font-medium">
                        {analysis.primarySignal.entryQuality || "Normal"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>RSI</span>
                        <span>{analysis.primarySignal.technicalScores.rsi}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${analysis.primarySignal.technicalScores.rsi}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>MACD</span>
                        <span>{analysis.primarySignal.technicalScores.macd}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${analysis.primarySignal.technicalScores.macd}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Bollinger</span>
                        <span>{analysis.primarySignal.technicalScores.bollingerBands}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${analysis.primarySignal.technicalScores.bollingerBands}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Aguardando análise...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PocketOptionOTC;
