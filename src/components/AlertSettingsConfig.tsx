
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AlertConfig, defaultUserProfile } from '@/types/userProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Plus, Trash2, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Função para gerar um ID UUID
const generateId = () => uuidv4();

// Simulação de carregamento das configurações 
const loadAlertSettings = () => {
  const savedSettings = localStorage.getItem('trading-automator-alert-settings');
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (e) {
      console.error("Error parsing alert settings:", e);
    }
  }
  return {
    customAlerts: [],
    minConfluenceThreshold: 70,
    minConfidenceThreshold: 75,
    enableSkullAlerts: true,
    enableHeartAlerts: true,
    alertOnlyForFavorites: false
  };
};

// Simulação de salvamento das configurações
const saveAlertSettings = (settings: any) => {
  localStorage.setItem('trading-automator-alert-settings', JSON.stringify(settings));
};

export function AlertSettingsConfig() {
  const { t } = useLanguage();
  const [alertSettings, setAlertSettings] = useState(loadAlertSettings());
  const [newAlertOpen, setNewAlertOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<AlertConfig | null>(null);
  
  // Lista de timeframes e símbolos disponíveis
  const availableTimeframes = ['1', '5', '15', '30', '60', '240', 'D'];
  const availableSymbols = [
    'BINANCE:BTCUSDT',
    'BINANCE:ETHUSDT',
    'BINANCE:BNBUSDT',
    'FX:EURUSD',
    'FX:GBPUSD',
    'FX:USDJPY'
  ];
  
  // Manuseamento de salvamento
  const handleSaveSettings = () => {
    saveAlertSettings(alertSettings);
    toast.success(t("alertSettingsSaved"), {
      description: t("yourAlertSettingsHaveBeenSaved")
    });
  };
  
  // Manuseamento do formulário de novo alerta
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
  
  // Manuseamento de edição de alerta
  const handleEditAlert = (alert: AlertConfig) => {
    setCurrentAlert({...alert});
    setNewAlertOpen(true);
  };
  
  // Manuseamento de salvamento de alerta
  const handleSaveAlert = () => {
    if (!currentAlert) return;
    
    // Validações
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
    
    // Verificar se é um novo alerta ou edição
    const existingAlertIndex = alertSettings.customAlerts.findIndex(alert => alert.id === currentAlert.id);
    
    if (existingAlertIndex >= 0) {
      // Atualizar alerta existente
      const updatedAlerts = [...alertSettings.customAlerts];
      updatedAlerts[existingAlertIndex] = currentAlert;
      
      setAlertSettings({
        ...alertSettings,
        customAlerts: updatedAlerts
      });
    } else {
      // Adicionar novo alerta
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
  
  // Manuseamento de remoção de alerta
  const handleDeleteAlert = (id: string) => {
    setAlertSettings({
      ...alertSettings,
      customAlerts: alertSettings.customAlerts.filter(alert => alert.id !== id)
    });
    
    toast.success(t("alertDeleted"));
  };
  
  // Manuseamento de alteração de estado do alerta
  const handleToggleAlert = (id: string) => {
    setAlertSettings({
      ...alertSettings,
      customAlerts: alertSettings.customAlerts.map(alert => 
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
      )
    });
  };
  
  // Manuseamento de alteração de valores
  const handleAlertChange = (field: string, value: any) => {
    if (!currentAlert) return;
    
    setCurrentAlert({
      ...currentAlert,
      [field]: value
    });
  };
  
  // Manuseamento de alteração de timeframe
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
  
  // Manuseamento de alteração de símbolo
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
  
  // Manuseamento de alteração de direção
  const handleDirectionChange = (direction: 'CALL' | 'PUT' | 'BOTH') => {
    if (!currentAlert) return;
    
    setCurrentAlert({
      ...currentAlert,
      directions: [direction]
    });
  };
  
  // Efeito para salvar configurações quando mudam
  useEffect(() => {
    saveAlertSettings(alertSettings);
  }, [alertSettings]);
  
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> {t("alertSettings")}
          </CardTitle>
          <CardDescription>{t("configureCustomAlerts")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">{t("minimumConfluenceThreshold")}</label>
              <span className="text-sm font-bold">{alertSettings.minConfluenceThreshold}%</span>
            </div>
            <Slider 
              value={[alertSettings.minConfluenceThreshold]} 
              min={50} 
              max={95} 
              step={5}
              onValueChange={(values) => setAlertSettings({
                ...alertSettings,
                minConfluenceThreshold: values[0]
              })}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">{t("minimumConfidenceThreshold")}</label>
              <span className="text-sm font-bold">{alertSettings.minConfidenceThreshold}%</span>
            </div>
            <Slider 
              value={[alertSettings.minConfidenceThreshold]} 
              min={50} 
              max={95} 
              step={5}
              onValueChange={(values) => setAlertSettings({
                ...alertSettings,
                minConfidenceThreshold: values[0]
              })}
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-sm font-medium">{t("alertOnHighConfluence")}</h4>
              <p className="text-sm text-muted-foreground">💀 {t("skullIndicator")}</p>
            </div>
            <Switch 
              checked={alertSettings.enableSkullAlerts}
              onCheckedChange={(checked) => setAlertSettings({
                ...alertSettings,
                enableSkullAlerts: checked
              })}
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-sm font-medium">{t("alertOnMediumConfluence")}</h4>
              <p className="text-sm text-muted-foreground">❤️ {t("heartIndicator")}</p>
            </div>
            <Switch 
              checked={alertSettings.enableHeartAlerts}
              onCheckedChange={(checked) => setAlertSettings({
                ...alertSettings,
                enableHeartAlerts: checked
              })}
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-sm font-medium">{t("alertOnlyForFavorites")}</h4>
              <p className="text-sm text-muted-foreground">{t("alertOnlyForFavoritesDesc")}</p>
            </div>
            <Switch 
              checked={alertSettings.alertOnlyForFavorites}
              onCheckedChange={(checked) => setAlertSettings({
                ...alertSettings,
                alertOnlyForFavorites: checked
              })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings} className="w-full">
            <Save className="h-4 w-4 mr-2" /> {t("saveAlertSettings")}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t("customAlerts")}</CardTitle>
            <Button variant="outline" size="sm" onClick={handleNewAlert}>
              <Plus className="h-4 w-4 mr-2" /> {t("newAlert")}
            </Button>
          </div>
          <CardDescription>{t("customAlertsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {alertSettings.customAlerts.length > 0 ? (
            <div className="space-y-4">
              {alertSettings.customAlerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-3 ${alert.enabled ? '' : 'opacity-60'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Bell className={`h-4 w-4 ${alert.enabled ? 'text-blue-500' : 'text-gray-400'}`} />
                      {alert.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={alert.enabled}
                        onCheckedChange={() => handleToggleAlert(alert.id)}
                      />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditAlert(alert)}>
                        <span className="sr-only">{t("edit")}</span>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => handleDeleteAlert(alert.id)}>
                        <span className="sr-only">{t("delete")}</span>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t("confluenceThreshold")}:</span> {alert.confluenceThreshold}%
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t("confidenceThreshold")}:</span> {alert.confidenceThreshold}%
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {alert.timeframes.map(tf => (
                      <Badge key={tf} variant="secondary">{tf}{tf !== 'D' && tf !== 'W' ? 'm' : ''}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {alert.symbols.map(symbol => (
                      <Badge key={symbol} variant="outline">{symbol.split(':')[1]}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <AlertTriangle className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>{t("noCustomAlertsYet")}</p>
              <p className="text-sm">{t("createYourFirstAlert")}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={newAlertOpen} onOpenChange={setNewAlertOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentAlert?.id ? t("editAlert") : t("createAlert")}</DialogTitle>
            <DialogDescription>{t("customizeYourAlert")}</DialogDescription>
          </DialogHeader>
          
          {currentAlert && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("alertName")}</label>
                <Input 
                  value={currentAlert.name}
                  onChange={(e) => handleAlertChange('name', e.target.value)}
                  placeholder={t("enterAlertName")}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">{t("confluenceThreshold")}</label>
                  <span className="text-sm font-bold">{currentAlert.confluenceThreshold}%</span>
                </div>
                <Slider 
                  value={[currentAlert.confluenceThreshold]} 
                  min={50} 
                  max={95} 
                  step={5}
                  onValueChange={(values) => handleAlertChange('confluenceThreshold', values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">{t("confidenceThreshold")}</label>
                  <span className="text-sm font-bold">{currentAlert.confidenceThreshold}%</span>
                </div>
                <Slider 
                  value={[currentAlert.confidenceThreshold]} 
                  min={50} 
                  max={95} 
                  step={5}
                  onValueChange={(values) => handleAlertChange('confidenceThreshold', values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("alertDirection")}</label>
                <div className="flex space-x-2">
                  <Button 
                    variant={currentAlert.directions.includes('CALL') && !currentAlert.directions.includes('PUT') ? "default" : "outline"}
                    onClick={() => handleDirectionChange('CALL')}
                    className="flex-1"
                  >
                    {t("callsOnly")}
                  </Button>
                  <Button 
                    variant={currentAlert.directions.includes('PUT') && !currentAlert.directions.includes('CALL') ? "default" : "outline"}
                    onClick={() => handleDirectionChange('PUT')}
                    className="flex-1"
                  >
                    {t("putsOnly")}
                  </Button>
                  <Button 
                    variant={currentAlert.directions.includes('BOTH') ? "default" : "outline"}
                    onClick={() => handleDirectionChange('BOTH')}
                    className="flex-1"
                  >
                    {t("both")}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("notificationType")}</label>
                <Select 
                  value={currentAlert.notificationType}
                  onValueChange={(value) => handleAlertChange('notificationType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectNotificationType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allNotifications")}</SelectItem>
                    <SelectItem value="sound">{t("soundOnly")}</SelectItem>
                    <SelectItem value="push">{t("pushOnly")}</SelectItem>
                    <SelectItem value="none">{t("silent")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("timeframes")}</label>
                <div className="flex flex-wrap gap-2">
                  {availableTimeframes.map((tf) => (
                    <Badge 
                      key={tf} 
                      variant={currentAlert.timeframes.includes(tf) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTimeframeToggle(tf)}
                    >
                      {tf}{tf !== 'D' && tf !== 'W' ? 'm' : ''}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("symbols")}</label>
                <div className="flex flex-wrap gap-2">
                  {availableSymbols.map((symbol) => (
                    <Badge 
                      key={symbol}
                      variant={currentAlert.symbols.includes(symbol) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleSymbolToggle(symbol)}
                    >
                      {symbol.split(':')[1]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewAlertOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveAlert}>
              <Save className="h-4 w-4 mr-2" /> {t("saveAlert")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
