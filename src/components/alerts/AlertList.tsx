
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AlertConfig } from '@/types/userProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Plus } from 'lucide-react';
import { AlertItem } from './AlertItem';

interface AlertListProps {
  alerts: AlertConfig[];
  onNewAlert: () => void;
  onToggleAlert: (id: string) => void;
  onEditAlert: (alert: AlertConfig) => void;
  onDeleteAlert: (id: string) => void;
}

export function AlertList({ 
  alerts, 
  onNewAlert, 
  onToggleAlert, 
  onEditAlert, 
  onDeleteAlert 
}: AlertListProps) {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t("customAlerts")}</CardTitle>
          <Button variant="outline" size="sm" onClick={onNewAlert}>
            <Plus className="h-4 w-4 mr-2" /> {t("newAlert")}
          </Button>
        </div>
        <CardDescription>{t("customAlertsDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <AlertItem 
                key={alert.id}
                alert={alert}
                onToggle={onToggleAlert}
                onEdit={onEditAlert}
                onDelete={onDeleteAlert}
              />
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
  );
}
