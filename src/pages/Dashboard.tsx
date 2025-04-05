
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SignalHistory } from "@/components/SignalHistory";
import { DashboardSummary } from "@/components/DashboardSummary";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrategyBacktest } from "@/components/StrategyBacktest";
import { CompactAnalysisCards } from "@/components/analysis/CompactAnalysisCards";

const DashboardContent = () => {
  const { t } = useLanguage();
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">{t("dashboard")}</h1>
        
        <Tabs defaultValue="summary">
          <TabsList className="mb-6">
            <TabsTrigger value="summary">{t("overview")}</TabsTrigger>
            <TabsTrigger value="history">{t("signalHistory")}</TabsTrigger>
            <TabsTrigger value="backtest">{t("backtest")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <DashboardSummary />
          </TabsContent>
          
          <TabsContent value="history">
            <SignalHistory />
          </TabsContent>
          
          <TabsContent value="backtest">
            <StrategyBacktest />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>{t("tradingViewAutomator")} - {t("tradingMadeSimple")}</p>
        </div>
      </footer>
    </div>
  );
};

const Dashboard = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DashboardContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Dashboard;
