
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Alert, AlertCondition } from './AlertTypes';
import { toast } from 'sonner';
import { availableTimeframes, availableSymbols } from '@/utils/alertUtils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus } from 'lucide-react';

interface AlertFormProps {
  alert: Alert | null;
  onSave: (alert: Partial<Alert>) => void;
  onCancel: () => void;
  symbol: string;
}

export function AlertForm({ alert, onSave, onCancel, symbol }: AlertFormProps) {
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

export default AlertForm;
