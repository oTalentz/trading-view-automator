
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LineChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
  const { t } = useLanguage();
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>{t("dashboardSummary")}</CardTitle>
        <CardDescription>{t("performanceMetrics")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">{t("noSignalsYet")}</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {t("startGeneratingSignals")}
        </p>
      </CardContent>
    </Card>
  );
}
