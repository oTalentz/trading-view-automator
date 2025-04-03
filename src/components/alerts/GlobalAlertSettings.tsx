
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Save } from 'lucide-react';

interface GlobalAlertSettingsProps {
  settings: {
    minConfluenceThreshold: number;
    minConfidenceThreshold: number;
    enableSkullAlerts: boolean;
    enableHeartAlerts: boolean;
    alertOnlyForFavorites: boolean;
  };
  onSettingsChange: (field: string, value: any) => void;
  onSaveSettings: () => void;
}

export function GlobalAlertSettings({ 
  settings, 
  onSettingsChange, 
  onSaveSettings 
}: GlobalAlertSettingsProps) {
  const { t } = useLanguage();
  
  return (
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
            <span className="text-sm font-bold">{settings.minConfluenceThreshold}%</span>
          </div>
          <Slider 
            value={[settings.minConfluenceThreshold]} 
            min={50} 
            max={95} 
            step={5}
            onValueChange={(values) => onSettingsChange('minConfluenceThreshold', values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">{t("minimumConfidenceThreshold")}</label>
            <span className="text-sm font-bold">{settings.minConfidenceThreshold}%</span>
          </div>
          <Slider 
            value={[settings.minConfidenceThreshold]} 
            min={50} 
            max={95} 
            step={5}
            onValueChange={(values) => onSettingsChange('minConfidenceThreshold', values[0])}
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-medium">{t("alertOnHighConfluence")}</h4>
            <p className="text-sm text-muted-foreground">💀 {t("skullIndicator")}</p>
          </div>
          <Switch 
            checked={settings.enableSkullAlerts}
            onCheckedChange={(checked) => onSettingsChange('enableSkullAlerts', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-medium">{t("alertOnMediumConfluence")}</h4>
            <p className="text-sm text-muted-foreground">❤️ {t("heartIndicator")}</p>
          </div>
          <Switch 
            checked={settings.enableHeartAlerts}
            onCheckedChange={(checked) => onSettingsChange('enableHeartAlerts', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-medium">{t("alertOnlyForFavorites")}</h4>
            <p className="text-sm text-muted-foreground">{t("alertOnlyForFavoritesDesc")}</p>
          </div>
          <Switch 
            checked={settings.alertOnlyForFavorites}
            onCheckedChange={(checked) => onSettingsChange('alertOnlyForFavorites', checked)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSaveSettings} className="w-full">
          <Save className="h-4 w-4 mr-2" /> {t("saveAlertSettings")}
        </Button>
      </CardFooter>
    </Card>
  );
}
