
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell,
  Plus,
  ChevronDown,
  BellOff
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Import the available symbols and timeframes from alertUtils
import { availableTimeframes, availableSymbols } from '@/utils/alertUtils';

// Types for alerts
export interface AlertCondition {
  id: string;
  type: 'price' | 'indicator' | 'confluence' | 'pattern' | 'volatility';
  indicator?: string;
  comparison: 'above' | 'below' | 'crosses_above' | 'crosses_below' | 'equals';
  value: number;
  timeframe?: string;
}

export interface Alert {
  id: string;
  name: string;
  symbol: string;
  enabled: boolean;
  conditions: AlertCondition[];
  notifyVia: ('sound' | 'toast' | 'email')[];
  createdAt: string;
  lastTriggered?: string;
}

// Mock alerts data
const mockAlerts: Alert[] = [
  {
    id: '1',
    name: 'BTC RSI Oversold',
    symbol: 'BINANCE:BTCUSDT',
    enabled: true,
    conditions: [
      {
        id: 'c1',
        type: 'indicator',
        indicator: 'RSI',
        comparison: 'below',
        value: 30,
        timeframe: '15'
      }
    ],
    notifyVia: ['sound', 'toast'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'ETH High Confluence',
    symbol: 'BINANCE:ETHUSDT',
    enabled: false,
    conditions: [
      {
        id: 'c2',
        type: 'confluence',
        comparison: 'above',
        value: 75
      }
    ],
    notifyVia: ['toast', 'email'],
    createdAt: new Date().toISOString()
  }
];

// Main component
export function CustomAlerts({ symbol, interval }: { symbol: string, interval: string }) {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  // Load alerts from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem('trading-alerts');
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (e) {
        console.error('Failed to parse saved alerts');
      }
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('trading-alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Toggle alert status
  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
    
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      toast(alert.enabled ? t("alertDisabled") : t("alertEnabled"), {
        description: alert.name,
        duration: 3000
      });
    }
  };

  // Delete alert
  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast(t("alertDeleted"), {
      description: t("alertHasBeenDeleted"),
      duration: 3000
    });
  };

  // Create/Edit alert dialog
  const handleOpenDialog = (alert?: Alert) => {
    if (alert) {
      setEditingAlert(alert);
    } else {
      setEditingAlert(null);
    }
    setCreateDialogOpen(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setEditingAlert(null);
  };

  // Handle save alert
  const handleSaveAlert = (newAlert: Partial<Alert>) => {
    if (editingAlert) {
      // Update existing
      setAlerts(alerts.map(alert => 
        alert.id === editingAlert.id ? { ...alert, ...newAlert } : alert
      ));
      toast(t("alertUpdated"), {
        description: newAlert.name,
        duration: 3000
      });
    } else {
      // Create new
      const alert: Alert = {
        id: Date.now().toString(),
        name: newAlert.name || 'New Alert',
        symbol: newAlert.symbol || symbol,
        enabled: true,
        conditions: newAlert.conditions || [],
        notifyVia: newAlert.notifyVia || ['toast'],
        createdAt: new Date().toISOString()
      };
      setAlerts([...alerts, alert]);
      toast(t("alertCreated"), {
        description: alert.name,
        duration: 3000
      });
    }
    handleCloseDialog();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t("customAlerts")}
        </CardTitle>
        <Button size="sm" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-1" />
          {t("newAlert")}
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BellOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{t("noAlertsConfigured")}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => handleOpenDialog()}
            >
              {t("createYourFirstAlert")}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-3 border rounded-lg flex items-center justify-between ${
                  alert.enabled ? 'bg-card' : 'bg-muted/50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${!alert.enabled && 'text-muted-foreground'}`}>
                      {alert.name}
                    </h3>
                    <Badge variant={alert.enabled ? "default" : "outline"}>
                      {alert.symbol.split(':')[1]}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {alert.conditions.map(c => (
                      <span key={c.id} className="mr-2">
                        {c.type === 'indicator' && c.indicator} 
                        {c.comparison.replace('_', ' ')} 
                        {c.value}
                        {c.timeframe && ` (${c.timeframe}m)`}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={alert.enabled}
                    onCheckedChange={() => toggleAlert(alert.id)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleOpenDialog(alert)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? t("editAlert") : t("createAlert")}
              </DialogTitle>
              <DialogDescription>
                {t("defineCustomAlertConditions")}
              </DialogDescription>
            </DialogHeader>
            
            <AlertForm 
              alert={editingAlert} 
              onSave={handleSaveAlert} 
              onCancel={handleCloseDialog}
              symbol={symbol}
            />
            
            {editingAlert && (
              <DialogFooter className="mt-4 border-t pt-4">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    deleteAlert(editingAlert.id);
                    handleCloseDialog();
                  }}
                >
                  {t("deleteAlert")}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Form component for creating/editing alerts
function AlertForm({ 
  alert, 
  onSave, 
  onCancel,
  symbol
}: { 
  alert: Alert | null,
  onSave: (alert: Partial<Alert>) => void,
  onCancel: () => void,
  symbol: string
}) {
  const { t } = useLanguage();
  const [conditions, setConditions] = useState<AlertCondition[]>(
    alert?.conditions || [
      {
        id: Date.now().toString(),
        type: 'indicator',
        indicator: 'RSI',
        comparison: 'below',
        value: 30,
        timeframe: '15'
      }
    ]
  );
  const [name, setName] = useState(alert?.name || '');
  const [selectedSymbol, setSelectedSymbol] = useState(alert?.symbol || symbol);
  const [notifyVia, setNotifyVia] = useState<('sound' | 'toast' | 'email')[]>(
    alert?.notifyVia || ['toast', 'sound']
  );

  // Add condition
  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: Date.now().toString(),
        type: 'indicator',
        indicator: 'RSI',
        comparison: 'below',
        value: 30,
        timeframe: '15'
      }
    ]);
  };

  // Remove condition
  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id));
    } else {
      toast.error(t("alertMustHaveAtLeastOneCondition"));
    }
  };

  // Update condition
  const updateCondition = (id: string, updates: Partial<AlertCondition>) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  // Handle notification toggles
  const toggleNotification = (type: 'sound' | 'toast' | 'email') => {
    if (notifyVia.includes(type)) {
      setNotifyVia(notifyVia.filter(t => t !== type));
    } else {
      setNotifyVia([...notifyVia, type]);
    }
  };

  // Save form
  const handleSave = () => {
    if (!name.trim()) {
      toast.error(t("pleaseEnterAlertName"));
      return;
    }

    onSave({
      name,
      symbol: selectedSymbol,
      conditions,
      notifyVia
    });
  };

  // Function to group and organize symbols
  const getSymbolGroups = () => {
    const cryptoSymbols = availableSymbols.filter(s => s.includes('BINANCE:'));
    const forexMajorSymbols = availableSymbols.filter(s => 
      s.includes('FX:') && 
      ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'USDCHF'].some(
        pair => s.includes(pair)
      )
    );
    const forexCrossSymbols = availableSymbols.filter(s => 
      s.includes('FX:') && 
      ['EURGBP', 'EURJPY', 'GBPJPY', 'CADJPY', 'AUDNZD', 'AUDCAD', 'EURAUD', 'GBPCAD'].some(
        pair => s.includes(pair)
      )
    );
    const forexExoticSymbols = availableSymbols.filter(s => 
      s.includes('FX:') && 
      ['USDBRL', 'EURBRL', 'USDMXN', 'USDZAR', 'USDTRY', 'EURPLN'].some(
        pair => s.includes(pair)
      )
    );
    const stockSymbols = availableSymbols.filter(s => 
      s.includes('NASDAQ:') || s.includes('NYSE:')
    );

    return {
      crypto: cryptoSymbols,
      forexMajor: forexMajorSymbols,
      forexCross: forexCrossSymbols,
      forexExotic: forexExoticSymbols,
      stocks: stockSymbols
    };
  };

  const symbolGroups = getSymbolGroups();

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="alert-name">{t("alertName")}</Label>
        <Input
          id="alert-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("enterAlertName")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symbol">{t("symbol")}</Label>
        <Select 
          value={selectedSymbol} 
          onValueChange={setSelectedSymbol}
        >
          <SelectTrigger id="symbol">
            <SelectValue placeholder={t("selectSymbol")} />
          </SelectTrigger>
          <SelectContent>
            <div className="max-h-[300px] overflow-y-auto">
              <div className="py-2 px-2 text-xs font-medium text-muted-foreground">Criptomoedas</div>
              {symbolGroups.crypto.map((sym) => (
                <SelectItem key={sym} value={sym}>
                  {sym.split(':')[1]}
                </SelectItem>
              ))}
              
              <div className="py-2 px-2 text-xs font-medium text-muted-foreground">Forex - Major</div>
              {symbolGroups.forexMajor.map((sym) => (
                <SelectItem key={sym} value={sym}>
                  {sym.split(':')[1]}
                </SelectItem>
              ))}
              
              <div className="py-2 px-2 text-xs font-medium text-muted-foreground">Forex - Cross</div>
              {symbolGroups.forexCross.map((sym) => (
                <SelectItem key={sym} value={sym}>
                  {sym.split(':')[1]}
                </SelectItem>
              ))}
              
              <div className="py-2 px-2 text-xs font-medium text-muted-foreground">Forex - Exóticos</div>
              {symbolGroups.forexExotic.map((sym) => (
                <SelectItem key={sym} value={sym}>
                  {sym.split(':')[1]}
                </SelectItem>
              ))}
              
              <div className="py-2 px-2 text-xs font-medium text-muted-foreground">Ações</div>
              {symbolGroups.stocks.map((sym) => (
                <SelectItem key={sym} value={sym}>
                  {sym.split(':')[1]}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{t("conditions")}</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addCondition}
          >
            <Plus className="h-3 w-3 mr-1" />
            {t("addCondition")}
          </Button>
        </div>

        <Accordion type="multiple" className="w-full">
          {conditions.map((condition, index) => (
            <AccordionItem key={condition.id} value={condition.id}>
              <AccordionTrigger className="py-2">
                <span className="text-sm">
                  {t("condition")} {index + 1}: {t(condition.type)}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 p-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>{t("type")}</Label>
                      <Select 
                        value={condition.type} 
                        onValueChange={(value: any) => updateCondition(condition.id, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indicator">{t("indicator")}</SelectItem>
                          <SelectItem value="price">{t("price")}</SelectItem>
                          <SelectItem value="confluence">{t("confluence")}</SelectItem>
                          <SelectItem value="pattern">{t("pattern")}</SelectItem>
                          <SelectItem value="volatility">{t("volatility")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {condition.type === 'indicator' && (
                      <div>
                        <Label>{t("indicator")}</Label>
                        <Select 
                          value={condition.indicator} 
                          onValueChange={(value) => updateCondition(condition.id, { indicator: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RSI">RSI</SelectItem>
                            <SelectItem value="MACD">MACD</SelectItem>
                            <SelectItem value="BB">Bollinger Bands</SelectItem>
                            <SelectItem value="MA">Moving Average</SelectItem>
                            <SelectItem value="VOLUME">Volume</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label>{t("comparison")}</Label>
                      <Select 
                        value={condition.comparison} 
                        onValueChange={(value: any) => updateCondition(condition.id, { comparison: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="above">{t("above")}</SelectItem>
                          <SelectItem value="below">{t("below")}</SelectItem>
                          <SelectItem value="crosses_above">{t("crossesAbove")}</SelectItem>
                          <SelectItem value="crosses_below">{t("crossesBelow")}</SelectItem>
                          <SelectItem value="equals">{t("equals")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>{t("value")}</Label>
                      <Input
                        type="number"
                        value={condition.value}
                        onChange={(e) => updateCondition(
                          condition.id, 
                          { value: parseFloat(e.target.value) || 0 }
                        )}
                      />
                    </div>

                    {(condition.type === 'indicator' || condition.type === 'pattern') && (
                      <div>
                        <Label>{t("timeframe")}</Label>
                        <Select 
                          value={condition.timeframe} 
                          onValueChange={(value) => updateCondition(condition.id, { timeframe: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimeframes.map(tf => (
                              <SelectItem key={tf} value={tf}>
                                {tf === 'D' ? '1d' : tf === 'W' ? '1w' : `${tf}m`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {conditions.length > 1 && (
                    <Button 
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCondition(condition.id)}
                    >
                      {t("removeCondition")}
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="space-y-2">
        <Label>{t("notifications")}</Label>
        <div className="flex flex-wrap gap-2">
          <Toggle 
            pressed={notifyVia.includes('sound')} 
            onPressedChange={() => toggleNotification('sound')}
            size="sm"
          >
            {t("sound")}
          </Toggle>
          <Toggle 
            pressed={notifyVia.includes('toast')} 
            onPressedChange={() => toggleNotification('toast')}
            size="sm"
          >
            {t("popup")}
          </Toggle>
          <Toggle 
            pressed={notifyVia.includes('email')} 
            onPressedChange={() => toggleNotification('email')}
            size="sm"
          >
            {t("email")}
          </Toggle>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="button" onClick={handleSave}>
          {t("saveAlert")}
        </Button>
      </div>
    </div>
  );
}

export default CustomAlerts;
