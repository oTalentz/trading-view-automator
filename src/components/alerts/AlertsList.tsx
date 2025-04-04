
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Alert } from './AlertTypes';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';

interface AlertsListProps {
  alerts: Alert[];
  onToggleAlert: (id: string) => void;
  onEditAlert: (alert: Alert) => void;
}

export function AlertsList({ alerts, onToggleAlert, onEditAlert }: AlertsListProps) {
  const { t } = useLanguage();
  
  return (
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
              onCheckedChange={() => onToggleAlert(alert.id)}
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEditAlert(alert)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlertsList;
