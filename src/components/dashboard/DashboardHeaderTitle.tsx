
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function DashboardHeaderTitle() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{t("performanceAnalytics")}</h2>
      <p className="text-muted-foreground text-sm">{t("dashboardDescription")}</p>
    </div>
  );
}
