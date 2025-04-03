
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export function StrategyGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Guide</CardTitle>
        <CardDescription>
          Learn how to create automated trading strategies using TradingView
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="pinescript">PineScript</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="setup" className="space-y-4">
              <div>
                <h3 className="font-medium text-base mb-2">Getting Started</h3>
                <p className="text-sm text-muted-foreground">
                  Follow these steps to set up TradingView automations:
                </p>
                <ol className="mt-2 space-y-2 text-sm list-decimal list-inside">
                  <li>Create a free TradingView account</li>
                  <li>Open chart for your desired trading pair</li>
                  <li>Create a new indicator using Pine Script</li>
                  <li>Set up alerts based on your indicator</li>
                  <li>Configure webhook URL to send signals to this platform</li>
                </ol>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-base mb-2">Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  To use webhook alerts, you need a TradingView Pro account or higher. 
                  Basic accounts don't support webhook notifications.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="pinescript" className="space-y-4">
              <div>
                <h3 className="font-medium text-base mb-2">Basic PineScript Example</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Here's a simple moving average crossover strategy:
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
                <h3 className="font-medium text-base mb-2">Setting Up Webhook Alerts</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  To connect your TradingView alerts to this platform:
                </p>
                <ol className="mt-2 space-y-2 text-sm list-decimal list-inside">
                  <li>In TradingView, right-click on your chart and select "Add Alert"</li>
                  <li>Set your alert condition based on your indicator</li>
                  <li>In the "Alert Actions" section, enable "Webhook URL"</li>
                  <li>Paste your unique webhook URL from this platform</li>
                  <li>Customize the alert message in JSON format as shown below</li>
                </ol>
                
                <div className="mt-3 bg-secondary p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Example Alert Message</h4>
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
