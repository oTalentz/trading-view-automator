
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, SendHorizonal } from "lucide-react";
import { generateMockWebhookURL, testWebhook } from "@/utils/webhookUtils";
import { useLanguage } from "@/context/LanguageContext";

export function WebhookSetup() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState(generateMockWebhookURL());
  const { t } = useLanguage();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast({
        title: "Copied!",
        description: "Webhook URL copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard",
      });
    }
  };

  const handleGenerateNew = () => {
    setWebhookUrl(generateMockWebhookURL());
    toast({
      title: "New webhook generated",
      description: "Use this URL in your TradingView alerts",
    });
  };

  const handleTest = () => {
    testWebhook(webhookUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("webhookConfiguration")}</CardTitle>
        <CardDescription>
          {t("webhookDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{t("yourWebhookUrl")}</label>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-1" />
              {t("copy")}
            </Button>
          </div>
          <div className="webhook-url dark:bg-gray-800">
            {webhookUrl}
          </div>
        </div>
        
        <div className="bg-secondary p-4 rounded-md">
          <h4 className="font-medium mb-2 text-sm">{t("webhookJsonFormat")}</h4>
          <pre className="text-xs font-mono bg-background p-3 rounded-md overflow-x-auto">
{`{
  "timestamp": "2023-06-15T12:34:56.789Z",
  "symbol": "BTCUSDT",
  "action": "BUY",
  "price": 50000,
  "strategy": "Moving Average Crossover"
}`}
          </pre>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleGenerateNew} variant="outline">
          {t("generateNewUrl")}
        </Button>
        <Button onClick={handleTest} className="space-x-2">
          <SendHorizonal className="h-4 w-4" />
          <span>{t("testWebhook")}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
