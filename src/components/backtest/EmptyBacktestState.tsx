
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Sliders } from 'lucide-react';

export function EmptyBacktestState() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Sliders className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{t("runBacktestToSeeResults")}</h3>
      <p className="text-muted-foreground text-center max-w-md">
        {t("advancedBacktestInstructions")}
      </p>
    </div>
  );
}
