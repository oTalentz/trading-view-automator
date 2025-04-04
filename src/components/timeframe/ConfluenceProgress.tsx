
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/LanguageContext';
import { Direction, DirectionColors, getConfidenceLevelColors } from '@/utils/colorSystem';

interface ConfluenceProgressProps {
  overallConfluence: number;
  confluenceDirection: Direction;
}

export function ConfluenceProgress({ 
  overallConfluence, 
  confluenceDirection 
}: ConfluenceProgressProps) {
  const { t } = useLanguage();
  const confidenceColors = getConfidenceLevelColors(overallConfluence);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm">{t("confluenceLevel")}</span>
        <span className={`text-sm font-medium ${confidenceColors.text} ${confidenceColors.darkText}`}>
          {overallConfluence}%
        </span>
      </div>
      <Progress 
        value={overallConfluence} 
        className={DirectionColors[confluenceDirection].bgLight + ' ' + DirectionColors[confluenceDirection].darkBgLight} 
      />
    </div>
  );
}
