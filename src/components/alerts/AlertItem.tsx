
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AlertConfig } from '@/types/userProfile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Save, Trash2 } from 'lucide-react';

interface AlertItemProps {
  alert: AlertConfig;
  onToggle: (id: string) => void;
  onEdit: (alert: AlertConfig) => void;
  onDelete: (id: string) => void;
}

export function AlertItem({ alert, onToggle, onEdit, onDelete }: AlertItemProps) {
  const { t } = useLanguage();
  
  return (
    <div className={`border rounded-lg p-3 ${alert.enabled ? '' : 'opacity-60'}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium flex items-center gap-2">
          <Bell className={`h-4 w-4 ${alert.enabled ? 'text-blue-500' : 'text-gray-400'}`} />
          {alert.name}
        </h3>
        <div className="flex items-center gap-2">
          <Switch 
            checked={alert.enabled}
            onCheckedChange={() => onToggle(alert.id)}
          />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(alert)}>
            <span className="sr-only">{t("edit")}</span>
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => onDelete(alert.id)}>
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
  );
}
