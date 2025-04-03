
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const pocketOptionAssets = [
  { symbol: "POCKETOPTION:EURUSD-OTC", name: "EUR/USD OTC" },
  { symbol: "POCKETOPTION:GBPUSD-OTC", name: "GBP/USD OTC" },
  { symbol: "POCKETOPTION:USDJPY-OTC", name: "USD/JPY OTC" },
  { symbol: "POCKETOPTION:AUDUSD-OTC", name: "AUD/USD OTC" },
  { symbol: "POCKETOPTION:USDCAD-OTC", name: "USD/CAD OTC" },
  { symbol: "POCKETOPTION:USDCHF-OTC", name: "USD/CHF OTC" },
  { symbol: "POCKETOPTION:EURJPY-OTC", name: "EUR/JPY OTC" },
  { symbol: "POCKETOPTION:EURGBP-OTC", name: "EUR/GBP OTC" }
];

const timeframeOptions = [
  { value: "1", label: "1m" },
  { value: "5", label: "5m" },
  { value: "15", label: "15m" },
  { value: "60", label: "1h" },
  { value: "240", label: "4h" }
];

export function PocketOptionOTC() {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState(pocketOptionAssets[0].symbol);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1");

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Pocket Option OTC</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>OTC Market Analysis</CardTitle>
                <CardDescription>
                  Analyze over-the-counter markets with precise signal timing
                </CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {pocketOptionAssets.map((asset) => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframeOptions.map((timeframe) => (
                      <SelectItem key={timeframe.value} value={timeframe.value}>
                        {timeframe.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart Analysis</TabsTrigger>
                <TabsTrigger value="signals">Entry Signals</TabsTrigger>
                <TabsTrigger value="strategy">Strategy</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="space-y-4">
                <TradingViewWidget symbol={selectedAsset} interval={selectedTimeframe} />
              </TabsContent>
              <TabsContent value="signals">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Upcoming Signals</h3>
                  <p className="text-muted-foreground">
                    Signal analysis for {selectedAsset.split(':')[1]} will appear here when available.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="strategy">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">OTC Market Strategy</h3>
                  <p className="text-muted-foreground">
                    OTC markets often behave differently from regular markets. The analysis takes into account the specific patterns of OTC assets to provide more accurate signals.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PocketOptionOTC;
