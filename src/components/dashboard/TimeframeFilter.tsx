
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter } from 'lucide-react';

type TimeframeFilterProps = {
  timeframeFilter: string;
  setTimeframeFilter: (value: string) => void;
  timeframeOptions: string[];
};

export function TimeframeFilter({ 
  timeframeFilter, 
  setTimeframeFilter, 
  timeframeOptions 
}: TimeframeFilterProps) {
  const { t } = useLanguage();
  
  return (
    <Card className="border-muted bg-background/60">
      <CardContent className="p-2">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Filter className="h-3 w-3" />
            {t("timeframeFilter")}
          </div>
          <ToggleGroup 
            type="single" 
            value={timeframeFilter} 
            onValueChange={(value) => setTimeframeFilter(value || 'all')}
            className="flex flex-wrap justify-start"
          >
            {timeframeOptions.map(tf => (
              <ToggleGroupItem 
                key={tf} 
                value={tf} 
                size="sm"
                className="text-xs px-2 h-6"
              >
                {tf === 'all' ? t('all') : tf}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
}
