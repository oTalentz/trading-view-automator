
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function DisclaimerFooter() {
  const { t } = useLanguage();
  
  return (
    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {t("disclaimer")}
    </div>
  );
}
