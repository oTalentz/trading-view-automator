
import { toast } from "@/components/ui/sonner";

export interface WebhookData {
  timestamp: string;
  symbol: string;
  action: "BUY" | "SELL";
  price: number;
  strategy: string;
}

// Generate a mock webhook URL for demonstration purposes
export function generateMockWebhookURL(): string {
  const randomId = Math.random().toString(36).substring(2, 10);
  return `https://trading-automator.api/webhook/${randomId}`;
}

// This function would actually process incoming webhook data
export function processWebhookData(data: WebhookData): void {
  console.log("Processing webhook data:", data);
  
  // In a real implementation, this would connect to a trading API
  // and execute trades based on the received signals
  
  // For demo purposes, just show a toast notification
  toast.success(`Signal received: ${data.action} ${data.symbol} at ${data.price}`, {
    description: `Strategy: ${data.strategy} - ${new Date(data.timestamp).toLocaleString()}`,
    duration: 5000,
  });
}

// Example function to test the webhook
export function testWebhook(webhookUrl: string): void {
  const testData: WebhookData = {
    timestamp: new Date().toISOString(),
    symbol: "BTCUSDT",
    action: Math.random() > 0.5 ? "BUY" : "SELL",
    price: 50000 + Math.random() * 5000,
    strategy: "Moving Average Crossover",
  };

  toast.info("Sending test webhook signal...");
  
  // In a real app, this would be handled by the backend
  // For now, we'll simulate a success response after a short delay
  setTimeout(() => {
    processWebhookData(testData);
  }, 1500);
}
