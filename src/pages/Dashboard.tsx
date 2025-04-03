
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { DashboardSummary } from "@/components/DashboardSummary";
import { SignalHistory } from "@/components/SignalHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";
import { UserProfile } from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("backToHome")}
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="summary">{t("summary")}</TabsTrigger>
            <TabsTrigger value="history">{t("history")}</TabsTrigger>
            <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <DashboardSummary />
          </TabsContent>
          
          <TabsContent value="history">
            <SignalHistory />
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
