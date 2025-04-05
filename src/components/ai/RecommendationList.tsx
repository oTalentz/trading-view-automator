
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Info, CheckCircle } from 'lucide-react';

interface RecommendationListProps {
  hasInsights: boolean;
}

export const RecommendationList = ({ hasInsights }: RecommendationListProps) => {
  const { t } = useLanguage();
  
  if (!hasInsights) {
    return (
      <li className="text-muted-foreground">
        {t("generateMoreSignals")}
      </li>
    );
  }
  
  return (
    <>
      <li className="flex items-start gap-2">
        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
        <span>{t("optimizeParameters")}</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
        <span>{t("focusOnTimeframes")}</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
        <span>{t("adjustConfidenceThresholds")}</span>
      </li>
    </>
  );
};
