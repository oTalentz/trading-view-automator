
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AlertConfig } from '@/types/userProfile';
import { toast } from 'sonner';
import { loadAlertSettings, saveAlertSettings, generateId } from '@/utils/alertUtils';
import { GlobalAlertSettings } from './alerts/GlobalAlertSettings';
import { AlertList } from './alerts/AlertList';
import { AlertDialog } from './alerts/AlertDialog';

export function AlertSettingsConfig() {
  const { t } = useLanguage();
  const [alertSettings, setAlertSettings] = useState(loadAlertSettings());
  const [newAlertOpen, setNewAlertOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<AlertConfig | null>(null);
  
  // Handle saving settings
  const handleSaveSettings = () => {
    saveAlertSettings(alertSettings);
    toast.success(t("alertSettingsSaved"), {
      description: t("yourAlertSettingsHaveBeenSaved")
    });
  };
  
  // Handle new alert creation
  const handleNewAlert = () => {
    setCurrentAlert({
      id: generateId(),
      name: `${t("alert")} ${alertSettings.customAlerts.length + 1}`,
      enabled: true,
      confluenceThreshold: alertSettings.minConfluenceThreshold,
      confidenceThreshold: alertSettings.minConfidenceThreshold,
      timeframes: [],
      symbols: [],
      directions: ['BOTH'],
      notificationType: 'all',
      createdAt: new Date().toISOString()
    });
    setNewAlertOpen(true);
  };
  
  // Handle editing alert
  const handleEditAlert = (alert: AlertConfig) => {
    setCurrentAlert({...alert});
    setNewAlertOpen(true);
  };
  
  // Handle saving alert
  const handleSaveAlert = () => {
    if (!currentAlert) return;
    
    // Validations
    if (!currentAlert.name.trim()) {
      toast.error(t("nameRequired"));
      return;
    }
    
    if (currentAlert.timeframes.length === 0) {
      toast.error(t("selectAtLeastOneTimeframe"));
      return;
    }
    
    if (currentAlert.symbols.length === 0) {
      toast.error(t("selectAtLeastOneSymbol"));
      return;
    }
    
    // Check if it's a new alert or edit
    const existingAlertIndex = alertSettings.customAlerts.findIndex(alert => alert.id === currentAlert.id);
    
    if (existingAlertIndex >= 0) {
      // Update existing alert
      const updatedAlerts = [...alertSettings.customAlerts];
      updatedAlerts[existingAlertIndex] = currentAlert;
      
      setAlertSettings({
        ...alertSettings,
        customAlerts: updatedAlerts
      });
    } else {
      // Add new alert
      setAlertSettings({
        ...alertSettings,
        customAlerts: [...alertSettings.customAlerts, currentAlert]
      });
    }
    
    setNewAlertOpen(false);
    setCurrentAlert(null);
    
    toast.success(
      existingAlertIndex >= 0 ? t("alertUpdated") : t("alertCreated"), 
      { description: currentAlert.name }
    );
  };
  
  // Handle deleting alert
  const handleDeleteAlert = (id: string) => {
    setAlertSettings({
      ...alertSettings,
      customAlerts: alertSettings.customAlerts.filter(alert => alert.id !== id)
    });
    
    toast.success(t("alertDeleted"));
  };
  
  // Handle toggling alert state
  const handleToggleAlert = (id: string) => {
    setAlertSettings({
      ...alertSettings,
      customAlerts: alertSettings.customAlerts.map(alert => 
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
      )
    });
  };
  
  // Handle changing current alert fields
  const handleAlertChange = (field: string, value: any) => {
    if (!currentAlert) return;
    
    setCurrentAlert({
      ...currentAlert,
      [field]: value
    });
  };
  
  // Handle toggling timeframe selection
  const handleTimeframeToggle = (timeframe: string) => {
    if (!currentAlert) return;
    
    const exists = currentAlert.timeframes.includes(timeframe);
    let updatedTimeframes;
    
    if (exists) {
      updatedTimeframes = currentAlert.timeframes.filter(tf => tf !== timeframe);
    } else {
      updatedTimeframes = [...currentAlert.timeframes, timeframe];
    }
    
    setCurrentAlert({
      ...currentAlert,
      timeframes: updatedTimeframes
    });
  };
  
  // Handle toggling symbol selection
  const handleSymbolToggle = (symbol: string) => {
    if (!currentAlert) return;
    
    const exists = currentAlert.symbols.includes(symbol);
    let updatedSymbols;
    
    if (exists) {
      updatedSymbols = currentAlert.symbols.filter(s => s !== symbol);
    } else {
      updatedSymbols = [...currentAlert.symbols, symbol];
    }
    
    setCurrentAlert({
      ...currentAlert,
      symbols: updatedSymbols
    });
  };
  
  // Handle changing alert direction
  const handleDirectionChange = (direction: 'CALL' | 'PUT' | 'BOTH') => {
    if (!currentAlert) return;
    
    setCurrentAlert({
      ...currentAlert,
      directions: [direction]
    });
  };
  
  // Handle changing global settings
  const handleSettingsChange = (field: string, value: any) => {
    setAlertSettings({
      ...alertSettings,
      [field]: value
    });
  };
  
  // Save settings when they change
  useEffect(() => {
    saveAlertSettings(alertSettings);
  }, [alertSettings]);
  
  return (
    <div>
      <GlobalAlertSettings 
        settings={alertSettings}
        onSettingsChange={handleSettingsChange}
        onSaveSettings={handleSaveSettings}
      />
      
      <AlertList 
        alerts={alertSettings.customAlerts}
        onNewAlert={handleNewAlert}
        onToggleAlert={handleToggleAlert}
        onEditAlert={handleEditAlert}
        onDeleteAlert={handleDeleteAlert}
      />
      
      <AlertDialog 
        open={newAlertOpen}
        onOpenChange={setNewAlertOpen}
        currentAlert={currentAlert}
        onSaveAlert={handleSaveAlert}
        onAlertChange={handleAlertChange}
        onTimeframeToggle={handleTimeframeToggle}
        onSymbolToggle={handleSymbolToggle}
        onDirectionChange={handleDirectionChange}
      />
    </div>
  );
}
