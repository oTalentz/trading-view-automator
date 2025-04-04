
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AlertTriangle } from 'lucide-react';

export function DisclaimerFooter() {
  const { t } = useLanguage();
  
  return (
    <div className="mt-4 pt-3 border-t border-dashed">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground italic">
          {t("signalDisclaimer")}
        </p>
      </div>
    </div>
  );
}
