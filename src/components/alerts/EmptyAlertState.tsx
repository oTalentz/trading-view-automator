
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { BellOff } from 'lucide-react';

interface EmptyAlertStateProps {
  onCreateAlert: () => void;
}

export function EmptyAlertState({ onCreateAlert }: EmptyAlertStateProps) {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-8 text-muted-foreground">
      <BellOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
      <p>{t("noAlertsConfigured")}</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4"
        onClick={onCreateAlert}
      >
        {t("createYourFirstAlert")}
      </Button>
    </div>
  );
}

export default EmptyAlertState;
