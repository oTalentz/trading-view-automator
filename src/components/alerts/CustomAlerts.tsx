
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Import new components
import { Alert } from './AlertTypes';
import { AlertsList } from './AlertsList';
import { AlertsDialog } from './AlertsDialog';
import { EmptyAlertState } from './EmptyAlertState';

// Import the available symbols and timeframes from alertUtils
import { availableTimeframes, availableSymbols } from '@/utils/alertUtils';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);

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

  // Create/Edit alert
  const handleOpenDialog = (alert?: Alert) => {
    if (alert) {
      setCurrentAlert(alert);
    } else {
      setCurrentAlert(null);
    }
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentAlert(null);
  };

  // Handle save alert
  const handleSaveAlert = (newAlert: Partial<Alert>) => {
    if (currentAlert?.id) {
      // Update existing
      setAlerts(alerts.map(alert => 
        alert.id === currentAlert.id ? { ...alert, ...newAlert } : alert
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
          <EmptyAlertState onCreateAlert={() => handleOpenDialog()} />
        ) : (
          <AlertsList 
            alerts={alerts}
            onToggleAlert={toggleAlert}
            onEditAlert={handleOpenDialog}
          />
        )}

        <AlertsDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          alert={currentAlert}
          onSave={handleSaveAlert}
          onDelete={deleteAlert}
          onCancel={handleCloseDialog}
          symbol={symbol}
        />
      </CardContent>
    </Card>
  );
}

export default CustomAlerts;
