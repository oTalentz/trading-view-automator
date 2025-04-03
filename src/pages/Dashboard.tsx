
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from "@/components/Navbar";
import { DashboardSummary } from "@/components/DashboardSummary";
import { SignalHistory } from "@/components/SignalHistory";
import { AlertSettingsConfig } from "@/components/AlertSettingsConfig";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";
import { UserProfile } from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Dashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft size={16} />
              {t("backToHome") || "Back to Home"}
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="summary">{t("summary")}</TabsTrigger>
            <TabsTrigger value="history">{t("history")}</TabsTrigger>
            <TabsTrigger value="alerts">{t("alerts")}</TabsTrigger>
            <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <DashboardSummary />
          </TabsContent>
          
          <TabsContent value="history">
            <SignalHistory />
          </TabsContent>
          
          <TabsContent value="alerts">
            <AlertSettingsConfig />
          </TabsContent>
          
          <TabsContent value="profile">
            <UserProfile />
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

export default Dashboard;
