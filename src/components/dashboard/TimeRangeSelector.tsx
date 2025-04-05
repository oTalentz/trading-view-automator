
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Clock } from 'lucide-react';

type TimeRangeSelectorProps = {
  timeRange: '7d' | '30d' | 'all';
  setTimeRange: (value: '7d' | '30d' | 'all') => void;
  buttonClassName?: string;
};

export function TimeRangeSelector({ 
  timeRange, 
  setTimeRange,
  buttonClassName = ''
}: TimeRangeSelectorProps) {
  const { t } = useLanguage();
  
  return (
    <Card className="border-muted bg-background/60">
      <CardContent className="p-2">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t("period")}
          </div>
          <ToggleGroup 
            type="single" 
            value={timeRange} 
            onValueChange={(value) => setTimeRange(value as '7d' | '30d' | 'all')}
          >
            <ToggleGroupItem value="7d" size="sm" className={`text-xs px-2 h-6 ${buttonClassName}`}>
              {t("last7Days")}
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" size="sm" className={`text-xs px-2 h-6 ${buttonClassName}`}>
              {t("last30Days")}
            </ToggleGroupItem>
            <ToggleGroupItem value="all" size="sm" className={`text-xs px-2 h-6 ${buttonClassName}`}>
              {t("allTime")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
}
