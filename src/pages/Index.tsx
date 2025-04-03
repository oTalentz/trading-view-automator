
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { 
  LineChart, BarChart, PieChart, 
  BookOpen, MessageSquare, ArrowRight, 
  Bell, History, Zap, ChevronRight, 
  Settings as SettingsIcon, BookMarked
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TradingViewWidget } from '@/components/TradingViewWidget';
import { DashboardSummary } from '@/components/DashboardSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignalIndicator } from '@/components/SignalIndicator';
import { SignalHistory } from '@/components/SignalHistory';
import { StrategyGuide } from '@/components/StrategyGuide';
import { toast } from "sonner";
import { useTheme } from '@/context/ThemeContext';
import { CONFLUENCE_TIMEFRAMES } from '@/types/timeframeAnalysis';

export function Index() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("chart");
  const [symbol, setSymbol] = useState("BINANCE:BTCUSDT");
  const [interval, setInterval] = useState("1");
  const { theme } = useTheme();
  
  const popularAssets = [
    { symbol: "BINANCE:BTCUSDT", name: "Bitcoin" },
    { symbol: "BINANCE:ETHUSDT", name: "Ethereum" },
    { symbol: "BINANCE:XRPUSDT", name: "Ripple" },
    { symbol: "BINANCE:ADAUSDT", name: "Cardano" },
    { symbol: "BINANCE:DOGEUSDT", name: "Dogecoin" },
    { symbol: "BINANCE:SOLUSDT", name: "Solana" },
    { symbol: "BINANCE:AVAXUSDT", name: "Avalanche" },
    { symbol: "BINANCE:LUNAUSDT", name: "Luna" },
    { symbol: "BINANCE:SANDUSDT", name: "The Sandbox" },
  ];
  
  const handleSymbolChange = (value: string) => {
    setSymbol(value);
    toast.info(t("assetChanged"), {
      description: popularAssets.find(asset => asset.symbol === value)?.name || value,
    });
  };
  
  const handleIntervalChange = (value: string) => {
    setInterval(value);
    toast.info(t("timeframeChanged"), {
      description: `${value}m`,
    });
  };
  
  const handleAssetClick = (asset: { symbol: string, name: string }) => {
    setSymbol(asset.symbol);
    toast.info(t("assetChanged"), {
      description: asset.name,
    });
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h1>
        <p className="text-muted-foreground">
          {t("dashboardDescription")}
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="chart" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden md:inline">{t("chart")}</span>
          </TabsTrigger>
          <TabsTrigger value="signals" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden md:inline">{t("signals")}</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden md:inline">{t("history")}</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">{t("education")}</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <BarChart className="h-4 w-4" />
            {t("viewFullDashboard")}
            <ChevronRight className="h-4 w-4" />
          </Link>
          
          <Link to="/settings" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <SettingsIcon className="h-4 w-4" />
            {t("settings")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
          <div className="xl:col-span-3 space-y-4">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="w-full sm:w-auto flex-1">
                <Select value={symbol} onValueChange={handleSymbolChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("selectAsset")} />
                  </SelectTrigger>
                  <SelectContent>
                    {popularAssets.map(asset => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        {asset.name} ({asset.symbol.split(':')[1]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-32">
                <Select value={interval} onValueChange={handleIntervalChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("interval")} />
                  </SelectTrigger>
                  <SelectContent>
                    {CONFLUENCE_TIMEFRAMES.map(tf => (
                      <SelectItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="30">30m</SelectItem>
                    <SelectItem value="60">1h</SelectItem>
                    <SelectItem value="240">4h</SelectItem>
                    <SelectItem value="D">1d</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Input 
                    placeholder={t("searchAssets")} 
                    className="pl-8" 
                  />
                  <div className="absolute left-2.5 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                  </div>
                </div>
              </div>
            </div>
            
            <TabsContent value="chart" className="mt-0 space-y-4">
              <TradingViewWidget symbol={symbol} interval={interval} />
            </TabsContent>
            
            <TabsContent value="signals" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SignalIndicator symbol={symbol} interval={interval} />
                <DashboardSummary />
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <SignalHistory />
            </TabsContent>
            
            <TabsContent value="education" className="mt-0">
              <StrategyGuide />
            </TabsContent>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-4 w-4" />
                  {t("latestSignals")}
                </CardTitle>
                <CardDescription>{t("recentSignalsAlert")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {popularAssets.slice(0, 5).map((asset, index) => (
                    <Button 
                      key={asset.symbol}
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => handleAssetClick(asset)}
                    >
                      <span>{asset.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
                  
                <div className="pt-2 border-t">
                  <div className="text-sm flex justify-between mb-2">
                    <span>{t("winRate")}</span>
                    <span className="font-medium">76%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "76%" }}></div>
                  </div>
                </div>
                
                <Link to="/signals">
                  <Button variant="outline" className="w-full mt-2">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t("allSignals")}
                  </Button>
                </Link>
                
                <Link to="/strategies">
                  <Button variant="outline" className="w-full">
                    <BookMarked className="mr-2 h-4 w-4" />
                    {t("tradingStrategies")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
