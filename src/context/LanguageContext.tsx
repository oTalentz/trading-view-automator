import React, { createContext, useContext, useState, ReactNode } from 'react';

// Defina os tipos de linguagem disponíveis
export type LanguageType = 'en' | 'pt-br';

// Define o tipo do contexto de linguagem
interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string) => string;
}

// Traduções
const translations: Record<LanguageType, Record<string, string>> = {
  'en': {
    "appTitle": "TradingView Automator",
    "tradingViewAutomator": "TradingView Automator",
    "tradingMadeSimple": "Trading made simple",
    "selectSymbol": "Select symbol",
    "selectTimeframe": "Select timeframe",
    "webhookConfiguration": "Webhook Configuration",
    "webhookDescription": "Set up your TradingView alerts to send signals to this webhook URL",
    "yourWebhookUrl": "Your Webhook URL",
    "copy": "Copy",
    "webhookJsonFormat": "Webhook JSON Format",
    "generateNewUrl": "Generate New URL",
    "testWebhook": "Test Webhook",
    "strategyGuide": "Strategy Guide",
    "strategyDescription": "Learn how to create automated trading strategies using TradingView",
    "setup": "Setup",
    "pinescript": "PineScript",
    "alerts": "Alerts",
    "gettingStarted": "Getting Started",
    "followSteps": "Follow these steps to set up TradingView automations:",
    "requirements": "Requirements",
    "requirementsDescription": "To use webhook alerts, you need a TradingView Pro account or higher. Basic accounts don't support webhook notifications.",
    "entrySignal": "Entry Signal",
    "analyzingMarket": "Analyzing market...",
    "symbol": "Symbol",
    "expiryTime": "Expiry Time",
    "timeLeft": "Time Left",
    "confidence": "Confidence",
    "strategy": "Strategy",
    "basedOn": "Based on indicators",
    "buySignal": "BUY SIGNAL for next candle",
    "sellSignal": "SELL SIGNAL for next candle",
    "disclaimer": "Trading signals are for informational purposes only",
    "signalCallGenerated": "BUY Signal Generated",
    "signalPutGenerated": "SELL Signal Generated",
    "timeframeConfluence": "Timeframe Confluence",
    "confluenceLevel": "Confluence Level",
    "confluenceScore": "Confluence Score",
    "confluenceDisclaimer": "Multi-timeframe analysis provides additional confirmation but does not guarantee results.",
    "bullish": "Bullish",
    "bearish": "Bearish",
    "neutral": "Neutral",
    "highConfluence": "High Confluence",
    "mixedSignals": "Mixed Signals",
    "aiStrategyInsights": "AI Strategy Insights",
    "insights": "Insights",
    "recommendations": "Recommendations",
    "refresh": "Refresh",
    "noInsightsYet": "No AI insights available yet. Generate signals to receive insights.",
    "aiRecommendations": "AI Recommendations",
    "basedOnHistoricalData": "Based on historical data and pattern recognition",
    "optimizeParameters": "Optimize strategy parameters for current market conditions",
    "focusOnTimeframes": "Focus on timeframes with highest signal accuracy",
    "adjustConfidenceThresholds": "Adjust confidence thresholds based on volatility",
    "generateMoreSignals": "Generate more signals to receive personalized recommendations",
    "entryTime": "Entry Time",
    "marketCondition": "Market Condition",
    "supportResistance": "Support & Resistance",
    "support": "Support",
    "resistance": "Resistance",
    "forNextCandle": "for next candle",
    "signalDisclaimer": "Trading signals are for informational purposes only. Always use proper risk management and do your own research before trading.",
    "totalSignals": "Total Signals",
    "completed": "completed",
    "winRate": "Win Rate",
    "wins": "wins",
    "bestTimeframe": "Best Timeframe",
    "signals": "signals",
    "noData": "No data",
    "direction": "Direction",
    "upcomingEvents": "Upcoming Events",
    "marketEventsAndCalendar": "Market events and economic calendar",
    "economicCalendarIntegration": "Economic calendar integration",
    "comingSoon": "Coming soon",
    "trendAnalysis": "Trend Analysis",
    "volumePattern": "Volume Pattern",
    "nearbyResistanceLevel": "Nearby Resistance Level",
    "volatilityAlert": "Volatility Alert",
    "configuration": "Configuration",
    "assetCorrelation": "Asset Correlation",
    "correlationInsights": "Correlation Insights",
    "highestCorrelation": "Highest Correlation",
    "lastUpdated": "Last Updated",
    "noCorrelationData": "No correlation data available",
    "noCorrelationsFound": "No correlations found",
    "strongPositive": "Strong Positive",
    "moderatePositive": "Moderate Positive",
    "weak": "Weak",
    "moderateNegative": "Moderate Negative",
    "strongNegative": "Strong Negative"
  },
  'pt-br': {
    "appTitle": "Automatizador TradingView",
    "tradingViewAutomator": "Automatizador TradingView",
    "tradingMadeSimple": "Trading simplificado",
    "selectSymbol": "Selecionar ativo",
    "selectTimeframe": "Selecionar período",
    "webhookConfiguration": "Configuração de Webhook",
    "webhookDescription": "Configure seus alertas no TradingView para enviar sinais para esta URL de webhook",
    "yourWebhookUrl": "Sua URL de Webhook",
    "copy": "Copiar",
    "webhookJsonFormat": "Formato JSON do Webhook",
    "generateNewUrl": "Gerar Nova URL",
    "testWebhook": "Testar Webhook",
    "strategyGuide": "Guia de Estratégias",
    "strategyDescription": "Aprenda como criar estratégias de trading automatizadas usando o TradingView",
    "setup": "Configuração",
    "pinescript": "PineScript",
    "alerts": "Alertas",
    "gettingStarted": "Primeiros Passos",
    "followSteps": "Siga estes passos para configurar automações no TradingView:",
    "requirements": "Requisitos",
    "requirementsDescription": "Para usar alertas webhook, você precisa de uma conta TradingView Pro ou superior. Contas básicas não suportam notificações webhook.",
    "entrySignal": "Sinal de Entrada",
    "analyzingMarket": "Analisando mercado...",
    "symbol": "Ativo",
    "expiryTime": "Tempo de Expiração",
    "timeLeft": "Tempo Restante",
    "confidence": "Confiança",
    "strategy": "Estratégia",
    "basedOn": "Baseado nos indicadores",
    "buySignal": "SINAL DE COMPRA para próxima vela",
    "sellSignal": "SINAL DE VENDA para próxima vela",
    "disclaimer": "Sinais de trading são apenas para fins informativos",
    "signalCallGenerated": "Sinal de COMPRA Gerado",
    "signalPutGenerated": "Sinal de VENDA Gerado",
    "timeframeConfluence": "Confluência de Timeframes",
    "confluenceLevel": "Nível de Confluência",
    "confluenceScore": "Pontuação de Confluência",
    "confluenceDisclaimer": "A análise de múltiplos timeframes fornece confirmação adicional, mas não garante resultados.",
    "bullish": "Alta",
    "bearish": "Baixa",
    "neutral": "Neutro",
    "highConfluence": "Alta Confluência",
    "mixedSignals": "Sinais Mistos",
    "aiStrategyInsights": "Insights de Estratégia IA",
    "insights": "Insights",
    "recommendations": "Recomendações",
    "refresh": "Atualizar",
    "noInsightsYet": "Nenhum insight de IA disponível ainda. Gere sinais para receber insights.",
    "aiRecommendations": "Recomendações de IA",
    "basedOnHistoricalData": "Baseado em dados históricos e reconhecimento de padrões",
    "optimizeParameters": "Otimize parâmetros da estratégia para condições atuais de mercado",
    "focusOnTimeframes": "Foque em timeframes com maior precisão de sinais",
    "adjustConfidenceThresholds": "Ajuste limiares de confiança com base na volatilidade",
    "generateMoreSignals": "Gere mais sinais para receber recomendações personalizadas",
    "entryTime": "Horário de Entrada",
    "marketCondition": "Condição de Mercado",
    "supportResistance": "Suporte & Resistência",
    "support": "Suporte",
    "resistance": "Resistência",
    "forNextCandle": "para próxima vela",
    "signalDisclaimer": "Sinais de trading são apenas para fins informativos. Sempre use gerenciamento de risco adequado e faça sua própria pesquisa antes de operar.",
    "totalSignals": "Total de Sinais",
    "completed": "completados",
    "winRate": "Taxa de Acerto",
    "wins": "ganhos",
    "bestTimeframe": "Melhor Timeframe",
    "signals": "sinais",
    "noData": "Sem dados",
    "direction": "Direção",
    "upcomingEvents": "Próximos Eventos",
    "marketEventsAndCalendar": "Eventos de mercado e calendário econômico",
    "economicCalendarIntegration": "Integração com calendário econômico",
    "comingSoon": "Em breve",
    "trendAnalysis": "Análise de Tendência",
    "volumePattern": "Padrão de Volume",
    "nearbyResistanceLevel": "Nível de Resistência Próximo",
    "volatilityAlert": "Alerta de Volatilidade",
    "configuration": "Configuração",
    "assetCorrelation": "Correlação de Ativos",
    "correlationInsights": "Insights de Correlação",
    "highestCorrelation": "Maior Correlação",
    "lastUpdated": "Última Atualização",
    "noCorrelationData": "Nenhum dado de correlação disponível",
    "noCorrelationsFound": "Nenhuma correlação encontrada",
    "strongPositive": "Forte Positiva",
    "moderatePositive": "Moderada Positiva",
    "weak": "Fraca",
    "moderateNegative": "Moderada Negativa",
    "strongNegative": "Forte Negativa"
  }
} as const;

// Criar o contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider para o contexto de linguagem
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>('en');

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar o contexto de linguagem
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
