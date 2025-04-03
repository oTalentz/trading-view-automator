
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";

export function StrategyGuide() {
  const { t, language } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("strategyGuide")}</CardTitle>
        <CardDescription>
          {t("strategyDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">{t("setup")}</TabsTrigger>
            <TabsTrigger value="pinescript">{t("pinescript")}</TabsTrigger>
            <TabsTrigger value="alerts">{t("alerts")}</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="setup" className="space-y-4">
              <div>
                <h3 className="font-medium text-base mb-2">{t("gettingStarted")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("followSteps")}
                </p>
                <ol className="mt-2 space-y-2 text-sm list-decimal list-inside">
                  {language === "en" ? (
                    <>
                      <li>Create a free TradingView account</li>
                      <li>Open chart for your desired trading pair</li>
                      <li>Create a new indicator using Pine Script</li>
                      <li>Set up alerts based on your indicator</li>
                      <li>Configure webhook URL to send signals to this platform</li>
                    </>
                  ) : (
                    <>
                      <li>Crie uma conta gratuita no TradingView</li>
                      <li>Abra o gráfico para o par de negociação desejado</li>
                      <li>Crie um novo indicador usando Pine Script</li>
                      <li>Configure alertas baseados no seu indicador</li>
                      <li>Configure a URL do webhook para enviar sinais para esta plataforma</li>
                    </>
                  )}
                </ol>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-base mb-2">{t("requirements")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("requirementsDescription")}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="pinescript" className="space-y-4">
              <div>
                <h3 className="font-medium text-base mb-2">
                  {language === "en" ? "Basic PineScript Example" : "Exemplo Básico de PineScript"}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {language === "en" 
                    ? "Here's a simple moving average crossover strategy:" 
                    : "Aqui está uma estratégia simples de cruzamento de médias móveis:"}
                </p>
                <pre className="text-xs font-mono bg-secondary p-3 rounded-md overflow-x-auto">
{`//@version=5
strategy("MA Crossover", overlay=true)

// Input parameters
fastLength = input.int(9, "Fast MA Length")
slowLength = input.int(21, "Slow MA Length")

// Calculate moving averages
fastMA = ta.sma(close, fastLength)
slowMA = ta.sma(close, slowLength)

// Plot MAs on the chart
plot(fastMA, color=color.blue, title="Fast MA")
plot(slowMA, color=color.red, title="Slow MA")

// Define trading conditions
buySignal = ta.crossover(fastMA, slowMA)
sellSignal = ta.crossunder(fastMA, slowMA)

// Execute strategy
if (buySignal)
    strategy.entry("Buy", strategy.long)
if (sellSignal)
    strategy.entry("Sell", strategy.short)

// Plot signals
plotshape(buySignal, style=shape.triangleup, 
    location=location.belowbar, color=color.green, size=size.small)
plotshape(sellSignal, style=shape.triangledown, 
    location=location.abovebar, color=color.red, size=size.small)

// Alert conditions
alertcondition(buySignal, title="Buy Signal", 
    message="MA Crossover - BUY {{ticker}}")
alertcondition(sellSignal, title="Sell Signal", 
    message="MA Crossover - SELL {{ticker}}")
`}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="alerts" className="space-y-4">
              <div>
                <h3 className="font-medium text-base mb-2">
                  {language === "en" ? "Setting Up Webhook Alerts" : "Configurando Alertas de Webhook"}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {language === "en" 
                    ? "To connect your TradingView alerts to this platform:" 
                    : "Para conectar seus alertas do TradingView a esta plataforma:"}
                </p>
                <ol className="mt-2 space-y-2 text-sm list-decimal list-inside">
                  {language === "en" ? (
                    <>
                      <li>In TradingView, right-click on your chart and select "Add Alert"</li>
                      <li>Set your alert condition based on your indicator</li>
                      <li>In the "Alert Actions" section, enable "Webhook URL"</li>
                      <li>Paste your unique webhook URL from this platform</li>
                      <li>Customize the alert message in JSON format as shown below</li>
                    </>
                  ) : (
                    <>
                      <li>No TradingView, clique com o botão direito no seu gráfico e selecione "Adicionar Alerta"</li>
                      <li>Configure a condição do alerta com base no seu indicador</li>
                      <li>Na seção "Ações de Alerta", habilite "URL do Webhook"</li>
                      <li>Cole a URL única de webhook desta plataforma</li>
                      <li>Personalize a mensagem de alerta no formato JSON como mostrado abaixo</li>
                    </>
                  )}
                </ol>
                
                <div className="mt-3 bg-secondary p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">
                    {language === "en" ? "Example Alert Message" : "Exemplo de Mensagem de Alerta"}
                  </h4>
                  <pre className="text-xs font-mono bg-background p-2 rounded-md overflow-x-auto">
{`{
  "timestamp": "{{timenow}}",
  "symbol": "{{ticker}}",
  "action": "{{strategy.order.action}}",
  "price": {{close}},
  "strategy": "MA Crossover"
}`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
