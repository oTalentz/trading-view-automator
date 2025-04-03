
import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "pt-br";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

// Translations for the app
const translations: Translations = {
  "en": {
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
    "requirementsDescription": "To use webhook alerts, you need a TradingView Pro account or higher. Basic accounts don't support webhook notifications."
  },
  "pt-br": {
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
    "requirementsDescription": "Para usar alertas webhook, você precisa de uma conta TradingView Pro ou superior. Contas básicas não suportam notificações webhook."
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

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
