
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AlertConfig } from '@/types/userProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { availableTimeframes, availableSymbols } from '@/utils/alertUtils';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAlert: AlertConfig | null;
  onSaveAlert: () => void;
  onAlertChange: (field: string, value: any) => void;
  onTimeframeToggle: (timeframe: string) => void;
  onSymbolToggle: (symbol: string) => void;
  onDirectionChange: (direction: 'CALL' | 'PUT' | 'BOTH') => void;
}

export function AlertDialog({
  open,
  onOpenChange,
  currentAlert,
  onSaveAlert,
  onAlertChange,
  onTimeframeToggle,
  onSymbolToggle,
  onDirectionChange
}: AlertDialogProps) {
  const { t } = useLanguage();

  if (!currentAlert) return null;
  
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{currentAlert.id ? t("editAlert") : t("createAlert")}</DialogTitle>
          <DialogDescription>{t("customizeYourAlert")}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("alertName")}</label>
            <Input 
              value={currentAlert.name}
              onChange={(e) => onAlertChange('name', e.target.value)}
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
              onValueChange={(values) => onAlertChange('confluenceThreshold', values[0])}
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
              onValueChange={(values) => onAlertChange('confidenceThreshold', values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("alertDirection")}</label>
            <div className="flex space-x-2">
              <Button 
                variant={currentAlert.directions.includes('CALL') && !currentAlert.directions.includes('PUT') ? "default" : "outline"}
                onClick={() => onDirectionChange('CALL')}
                className="flex-1"
              >
                {t("callsOnly")}
              </Button>
              <Button 
                variant={currentAlert.directions.includes('PUT') && !currentAlert.directions.includes('CALL') ? "default" : "outline"}
                onClick={() => onDirectionChange('PUT')}
                className="flex-1"
              >
                {t("putsOnly")}
              </Button>
              <Button 
                variant={currentAlert.directions.includes('BOTH') ? "default" : "outline"}
                onClick={() => onDirectionChange('BOTH')}
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
              onValueChange={(value) => onAlertChange('notificationType', value)}
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
                  onClick={() => onTimeframeToggle(tf)}
                >
                  {tf === 'D' ? '1d' : tf === 'W' ? '1w' : `${tf}m`}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("symbols")}</label>
            <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Criptomoedas</p>
                  <div className="flex flex-wrap gap-2">
                    {symbolGroups.crypto.map((symbol) => (
                      <Badge 
                        key={symbol}
                        variant={currentAlert.symbols.includes(symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => onSymbolToggle(symbol)}
                      >
                        {symbol.split(':')[1]}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Forex - Major</p>
                  <div className="flex flex-wrap gap-2">
                    {symbolGroups.forexMajor.map((symbol) => (
                      <Badge 
                        key={symbol}
                        variant={currentAlert.symbols.includes(symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => onSymbolToggle(symbol)}
                      >
                        {symbol.split(':')[1]}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Forex - Cross</p>
                  <div className="flex flex-wrap gap-2">
                    {symbolGroups.forexCross.map((symbol) => (
                      <Badge 
                        key={symbol}
                        variant={currentAlert.symbols.includes(symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => onSymbolToggle(symbol)}
                      >
                        {symbol.split(':')[1]}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Forex - Exóticos</p>
                  <div className="flex flex-wrap gap-2">
                    {symbolGroups.forexExotic.map((symbol) => (
                      <Badge 
                        key={symbol}
                        variant={currentAlert.symbols.includes(symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => onSymbolToggle(symbol)}
                      >
                        {symbol.split(':')[1]}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Ações</p>
                  <div className="flex flex-wrap gap-2">
                    {symbolGroups.stocks.map((symbol) => (
                      <Badge 
                        key={symbol}
                        variant={currentAlert.symbols.includes(symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => onSymbolToggle(symbol)}
                      >
                        {symbol.split(':')[1]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={onSaveAlert}>
            <Save className="h-4 w-4 mr-2" /> {t("saveAlert")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
