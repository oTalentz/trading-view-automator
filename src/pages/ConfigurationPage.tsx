
import React from "react";
import { Navbar } from "@/components/Navbar";
import { WebhookSetup } from "@/components/WebhookSetup";
import { StrategyGuide } from "@/components/StrategyGuide";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageProvider";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Webhook } from "lucide-react";

const ConfigurationContent = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t("configuration")}</h1>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("backToDashboard")}
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="webhook" className="mt-6">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="webhook" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              {t("webhookSetup")}
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t("strategyGuide")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhook">
            <Card>
              <CardHeader>
                <CardTitle>{t("webhookConfiguration")}</CardTitle>
                <CardDescription>{t("configureWebhooks")}</CardDescription>
              </CardHeader>
              <CardContent>
                <WebhookSetup />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="strategy">
            <StrategyGuide />
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

const ConfigurationPage = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ConfigurationContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default ConfigurationPage;
