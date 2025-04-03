import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { UserProfile as UserProfileType, defaultUserProfile, SoundSettings } from '@/types/userProfile';
import { getSoundSettings, saveSoundSettings, initAudio, playAlertSound } from '@/utils/audioUtils';
import { getNotificationSettings, saveNotificationSettings, requestNotificationPermission } from '@/utils/pushNotificationUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bell, Volume2, VolumeX, MessageSquare } from 'lucide-react';

export function UserProfile() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfileType>(() => {
    try {
      const savedProfile = localStorage.getItem('trading-automator-user-profile');
      return savedProfile ? JSON.parse(savedProfile) : defaultUserProfile;
    } catch (error) {
      console.error('Error loading user profile', error);
      return defaultUserProfile;
    }
  });
  
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(getSoundSettings());
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  
  useEffect(() => {
    const checkNotificationPermission = async () => {
      if ('Notification' in window) {
        setNotificationEnabled(Notification.permission === 'granted');
      }
    };
    
    checkNotificationPermission();
    
    const settings = getNotificationSettings();
    setNotificationEnabled(settings.enabled);
  }, []);
  
  const handleSaveProfile = () => {
    localStorage.setItem('trading-automator-user-profile', JSON.stringify({
      ...profile,
      soundSettings,
      lastActive: new Date().toISOString()
    }));
    saveSoundSettings(soundSettings);
    saveNotificationSettings({ enabled: notificationEnabled });
    toast.success(t("profileSaved"));
  };
  
  const handleRequestNotificationPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
    
    if (granted) {
      toast.success("Permissão de notificação concedida");
      saveNotificationSettings({ enabled: true });
    } else {
      toast.error("Permissão de notificação negada");
      saveNotificationSettings({ enabled: false });
    }
  };
  
  const handleTestSound = () => {
    initAudio();
    playAlertSound('notification');
    toast.info("Teste de som executado");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>{t("userProfile")}</CardTitle>
          </div>
          <CardDescription>{t("manageYourProfile")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input 
                  id="name" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={profile.email || ''} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultSymbol">{t("defaultSymbol")}</Label>
                <Input 
                  id="defaultSymbol" 
                  value={profile.tradingPreferences.defaultSymbol} 
                  onChange={(e) => setProfile({
                    ...profile, 
                    tradingPreferences: {
                      ...profile.tradingPreferences,
                      defaultSymbol: e.target.value
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultTimeframe">{t("defaultTimeframe")}</Label>
                <Input 
                  id="defaultTimeframe" 
                  value={profile.tradingPreferences.defaultTimeframe} 
                  onChange={(e) => setProfile({
                    ...profile, 
                    tradingPreferences: {
                      ...profile.tradingPreferences,
                      defaultTimeframe: e.target.value
                    }
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="investmentAmount">{t("defaultInvestmentAmount")}</Label>
              <Input 
                id="investmentAmount" 
                type="number"
                value={profile.tradingPreferences.defaultInvestmentAmount} 
                onChange={(e) => setProfile({
                  ...profile, 
                  tradingPreferences: {
                    ...profile.tradingPreferences,
                    defaultInvestmentAmount: Number(e.target.value)
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-trade">{t("autoTrade")}</Label>
                <Switch 
                  id="auto-trade" 
                  checked={profile.tradingPreferences.autoTrade}
                  onCheckedChange={(checked) => setProfile({
                    ...profile, 
                    tradingPreferences: {
                      ...profile.tradingPreferences,
                      autoTrade: checked
                    }
                  })}
                />
              </div>
              {profile.tradingPreferences.autoTrade && (
                <p className="text-sm text-muted-foreground">
                  {t("autoTradeWarning")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <CardTitle>Notificações</CardTitle>
          </div>
          <CardDescription>Configurar as notificações do navegador</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browser-notifications">Notificações do navegador</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas mesmo quando o navegador estiver em segundo plano
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRequestNotificationPermission}
                >
                  {notificationEnabled ? "Habilitado" : "Solicitar permissão"}
                </Button>
                <Switch 
                  id="browser-notifications" 
                  checked={notificationEnabled}
                  disabled={Notification.permission !== 'granted'}
                  onCheckedChange={(checked) => {
                    setNotificationEnabled(checked);
                    saveNotificationSettings({ enabled: checked });
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>{t("notificationSettings")}</CardTitle>
          </div>
          <CardDescription>{t("manageYourNotifications")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">{t("pushNotifications")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("receiveAlertsPush")}
                </p>
              </div>
              <Switch 
                id="push-notifications" 
                checked={profile.notificationSettings.pushEnabled}
                onCheckedChange={(checked) => setProfile({
                  ...profile, 
                  notificationSettings: {
                    ...profile.notificationSettings,
                    pushEnabled: checked
                  }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">{t("emailNotifications")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("receiveAlertsEmail")}
                </p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={profile.notificationSettings.emailEnabled}
                onCheckedChange={(checked) => setProfile({
                  ...profile, 
                  notificationSettings: {
                    ...profile.notificationSettings,
                    emailEnabled: checked
                  }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="signals-notifications">{t("signalAlerts")}</Label>
              <Switch 
                id="signals-notifications" 
                checked={profile.notificationSettings.signalAlerts}
                onCheckedChange={(checked) => setProfile({
                  ...profile, 
                  notificationSettings: {
                    ...profile.notificationSettings,
                    signalAlerts: checked
                  }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="entry-notifications">{t("entryTimeAlerts")}</Label>
              <Switch 
                id="entry-notifications" 
                checked={profile.notificationSettings.entryTimeAlerts}
                onCheckedChange={(checked) => setProfile({
                  ...profile, 
                  notificationSettings: {
                    ...profile.notificationSettings,
                    entryTimeAlerts: checked
                  }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {soundSettings.enabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
            <CardTitle>{t("soundSettings")}</CardTitle>
          </div>
          <CardDescription>{t("manageAlertSounds")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled">Habilitar sons</Label>
              <Switch 
                id="sound-enabled" 
                checked={soundSettings.enabled}
                onCheckedChange={(checked) => setSoundSettings({
                  ...soundSettings,
                  enabled: checked
                })}
              />
            </div>
            
            {soundSettings.enabled && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="volume-slider">Volume</Label>
                    <span className="text-sm">{Math.round(soundSettings.volume * 100)}%</span>
                  </div>
                  <Slider
                    id="volume-slider"
                    defaultValue={[soundSettings.volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setSoundSettings({
                      ...soundSettings,
                      volume: value[0] / 100
                    })}
                  />
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleTestSound}
                    >
                      Testar som
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="signal-sounds">Sons de sinais</Label>
                  <Switch 
                    id="signal-sounds" 
                    checked={soundSettings.signalAlerts}
                    onCheckedChange={(checked) => setSoundSettings({
                      ...soundSettings,
                      signalAlerts: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="entry-sounds">Sons de entrada</Label>
                  <Switch 
                    id="entry-sounds" 
                    checked={soundSettings.entryAlerts}
                    onCheckedChange={(checked) => setSoundSettings({
                      ...soundSettings,
                      entryAlerts: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification-sounds">Sons de notificação</Label>
                  <Switch 
                    id="notification-sounds" 
                    checked={soundSettings.notificationAlerts}
                    onCheckedChange={(checked) => setSoundSettings({
                      ...soundSettings,
                      notificationAlerts: checked
                    })}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveProfile}>{t("saveProfile")}</Button>
      </div>
    </div>
  );
}
