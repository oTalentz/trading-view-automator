
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UpcomingEventsCard() {
  const { t } = useLanguage();
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> {t("upcomingEvents")}
        </CardTitle>
        <CardDescription>{t("marketEventsAndCalendar")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("economicCalendarIntegration")}</p>
          <p className="text-sm">{t("comingSoon")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
