
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/LanguageContext';

interface ConfluenceProgressProps {
  overallConfluence: number;
  confluenceDirection: 'CALL' | 'PUT' | 'NEUTRAL';
}

export function ConfluenceProgress({ 
  overallConfluence, 
  confluenceDirection 
}: ConfluenceProgressProps) {
  const { t } = useLanguage();
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm">{t("confluenceLevel")}</span>
        <span className={`text-sm font-medium ${
          overallConfluence > 70 ? 'text-green-600 dark:text-green-400' : 
          overallConfluence > 40 ? 'text-amber-600 dark:text-amber-400' : 
          'text-gray-600 dark:text-gray-400'
        }`}>{overallConfluence}%</span>
      </div>
      <Progress value={overallConfluence} className={
        confluenceDirection === 'CALL' ? 'bg-green-100 dark:bg-green-900/20' :
        confluenceDirection === 'PUT' ? 'bg-red-100 dark:bg-red-900/20' :
        'bg-amber-100 dark:bg-amber-900/20'
      } />
    </div>
  );
}
