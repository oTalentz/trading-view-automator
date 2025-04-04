
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/context/LanguageContext';
import { generateSimulatedMarketData } from '@/utils/technicalAnalysis';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { calculateCorrelation } from '@/utils/analysis/correlationCalculator';
import { 
  ArrowUpDown, 
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Shuffle,
  BarChart2,
  SlidersHorizontal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AssetComparisonProps {
  mainSymbol: string;
}

export function AssetComparison({ mainSymbol }: AssetComparisonProps) {
  const { t } = useLanguage();
  const [comparisonAssets, setComparisonAssets] = useState<string[]>(['BINANCE:ETHUSDT', 'BINANCE:SOLUSDT']);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [correlations, setCorrelations] = useState<{symbol: string, correlation: number, strength: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showingAllData, setShowingAllData] = useState(false);
  
  // Available assets for comparison
  const availableAssets = [
    { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin' },
    { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum' },
    { symbol: 'BINANCE:BNBUSDT', name: 'Binance Coin' },
    { symbol: 'BINANCE:SOLUSDT', name: 'Solana' },
    { symbol: 'BINANCE:ADAUSDT', name: 'Cardano' },
    { symbol: 'BINANCE:DOGEUSDT', name: 'Dogecoin' },
    { symbol: 'BINANCE:XRPUSDT', name: 'Ripple' },
    { symbol: 'BINANCE:DOTUSDT', name: 'Polkadot' },
    { symbol: 'BINANCE:LINKUSDT', name: 'Chainlink' },
    { symbol: 'BINANCE:MATICUSDT', name: 'Polygon' }
  ].filter(asset => asset.symbol !== mainSymbol);
  
  // Handler for adding a new asset
  const handleAddAsset = (symbol: string) => {
    if (comparisonAssets.includes(symbol)) return;
    setComparisonAssets(prev => [...prev, symbol]);
  };
  
  // Handler for removing an asset
  const handleRemoveAsset = (symbol: string) => {
    setComparisonAssets(prev => prev.filter(s => s !== symbol));
  };
  
  // Handler for finding correlated assets
  const handleFindCorrelated = () => {
    setIsLoading(true);
    
    // Simulate finding correlated assets
    setTimeout(() => {
      // Pick some random assets with simulated correlations
      const mainAssetData = generateSimulatedMarketData(mainSymbol, 100).prices;
      
      const correlatedAssets = availableAssets
        .map(asset => {
          const assetData = generateSimulatedMarketData(asset.symbol, 100).prices;
          const correlation = calculateCorrelation(mainAssetData, assetData);
          
          let strength = 'weak';
          if (Math.abs(correlation) > 0.7) strength = 'strong';
          else if (Math.abs(correlation) > 0.3) strength = 'moderate';
          
          return {
            symbol: asset.symbol,
            name: asset.name,
            correlation: correlation,
            strength
          };
        })
        .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
        .slice(0, 5);
      
      const newComparisonAssets = correlatedAssets
        .filter(asset => Math.abs(asset.correlation) > 0.3)
        .map(asset => asset.symbol);
      
      setComparisonAssets(newComparisonAssets);
      setCorrelations(correlatedAssets);
      setIsLoading(false);
    }, 1500);
  };
  
  // Generate comparison data
  useEffect(() => {
    const mainAssetData = generateSimulatedMarketData(mainSymbol, 100);
    const mainPrices = mainAssetData.prices;
    
    const allAssets = [mainSymbol, ...comparisonAssets];
    const assetDataMap: Record<string, number[]> = {
      [mainSymbol]: mainPrices
    };
    
    // Generate data for comparison assets
    comparisonAssets.forEach(symbol => {
      const data = generateSimulatedMarketData(symbol, 100);
      assetDataMap[symbol] = data.prices;
    });
    
    // Calculate percent change from the first data point for better comparison
    const firstPointValues: Record<string, number> = {};
    allAssets.forEach(symbol => {
      firstPointValues[symbol] = assetDataMap[symbol][0];
    });
    
    // Create normalized data for the chart
    const normalizedData = [];
    
    for (let i = 0; i < mainPrices.length; i++) {
      const point: Record<string, any> = {
        timestamp: Date.now() - (mainPrices.length - i) * 60000 * 60 // 1 hour intervals
      };
      
      allAssets.forEach(symbol => {
        const prices = assetDataMap[symbol];
        if (i < prices.length) {
          const percentChange = ((prices[i] - firstPointValues[symbol]) / firstPointValues[symbol]) * 100;
          point[symbol] = parseFloat(percentChange.toFixed(2));
        }
      });
      
      normalizedData.push(point);
    }
    
    // Limit data points if not showing all
    let displayData = normalizedData;
    if (!showingAllData) {
      const limit = selectedTimeframe === '1d' ? 24 : 
                   selectedTimeframe === '1w' ? 7 * 24 : 
                   30 * 24;
                   
      displayData = normalizedData.slice(-limit);
    }
    
    setComparisonData(displayData);
    
    // Calculate correlations
    const calculatedCorrelations = comparisonAssets.map(symbol => {
      const assetPrices = assetDataMap[symbol];
      const correlation = calculateCorrelation(mainPrices, assetPrices);
      
      let strength = 'weak';
      if (Math.abs(correlation) > 0.7) strength = 'strong';
      else if (Math.abs(correlation) > 0.3) strength = 'moderate';
      
      return {
        symbol,
        correlation,
        strength
      };
    });
    
    setCorrelations(calculatedCorrelations);
  }, [mainSymbol, comparisonAssets, selectedTimeframe, showingAllData]);
  
  // Get color for asset line
  const getAssetColor = (symbol: string, index: number) => {
    const colors = ['#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4'];
    
    if (symbol === mainSymbol) return '#ef4444';
    return colors[index % colors.length];
  };
  
  // Format asset name from symbol
  const formatAssetName = (symbol: string) => {
    if (symbol === mainSymbol) return 'Main Asset';
    return symbol.split(':')[1].replace('USDT', '');
  };
  
  // Get correlation indicator
  const getCorrelationIndicator = (correlation: number) => {
    if (correlation > 0.7) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (correlation > 0.3) return <ArrowUp className="h-4 w-4 text-green-300" />;
    if (correlation < -0.7) return <ArrowDown className="h-4 w-4 text-red-500" />;
    if (correlation < -0.3) return <ArrowDown className="h-4 w-4 text-red-300" />;
    return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
  };
  
  // Get color class for correlation badge
  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.7) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (correlation > 0.3) return 'bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-300';
    if (correlation < -0.7) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    if (correlation < -0.3) return 'bg-red-50 text-red-700 dark:bg-red-900/10 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          {t("assetComparison")}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[90px] h-8">
              <SelectValue placeholder={t("timeframe")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">{t("1day")}</SelectItem>
              <SelectItem value="1w">{t("1week")}</SelectItem>
              <SelectItem value="1m">{t("1month")}</SelectItem>
              <SelectItem value="all">{t("allData")}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => setShowingAllData(!showingAllData)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            {showingAllData ? t("limitData") : t("showAllData")}
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleFindCorrelated}
            disabled={isLoading}
            className="h-8"
          >
            <Shuffle className="h-4 w-4 mr-1" />
            {t("findCorrelated")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">{t("chart")}</TabsTrigger>
            <TabsTrigger value="correlations">{t("correlations")}</TabsTrigger>
            <TabsTrigger value="assets">{t("assetList")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(timestamp) => {
                      const date = new Date(timestamp);
                      const format = selectedTimeframe === '1d' ? 'HH:mm' : 'MM/DD';
                      
                      // Simplified formatter - in a real app use a proper date library
                      return selectedTimeframe === '1d' 
                        ? `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}` 
                        : `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                    minTickGap={30}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}%`, 
                      formatAssetName(name as string)
                    ]}
                    labelFormatter={(label) => {
                      const date = new Date(label as number);
                      return date.toLocaleString();
                    }}
                  />
                  <Legend formatter={(value) => formatAssetName(value)} />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                  
                  {/* Main asset line */}
                  <Line
                    type="monotone"
                    dataKey={mainSymbol}
                    stroke="#ef4444"
                    dot={false}
                    strokeWidth={2}
                    name={formatAssetName(mainSymbol)}
                  />
                  
                  {/* Comparison asset lines */}
                  {comparisonAssets.map((symbol, index) => (
                    <Line
                      key={symbol}
                      type="monotone"
                      dataKey={symbol}
                      stroke={getAssetColor(symbol, index)}
                      dot={false}
                      name={formatAssetName(symbol)}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="correlations">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground mb-2">
                {t("correlationExplanation")}
              </div>
              
              {correlations.map((item, index) => (
                <div 
                  key={item.symbol} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getCorrelationIndicator(item.correlation)}
                    <span className="font-medium">{formatAssetName(item.symbol)}</span>
                    <Badge 
                      variant="secondary"
                      className={getCorrelationColor(item.correlation)}
                    >
                      {(item.correlation * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(item.strength)}
                  </div>
                </div>
              ))}
              
              {correlations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{t("noCorrelationsFound")}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="assets">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableAssets.map(asset => (
                <div 
                  key={asset.symbol} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {asset.symbol}
                    </div>
                  </div>
                  
                  {comparisonAssets.includes(asset.symbol) ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveAsset(asset.symbol)}
                    >
                      {t("remove")}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddAsset(asset.symbol)}
                    >
                      {t("compare")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default AssetComparison;
