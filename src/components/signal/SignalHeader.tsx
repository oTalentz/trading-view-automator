
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';

interface SignalHeaderProps {
  direction: 'CALL' | 'PUT';
}

export function SignalHeader({ direction }: SignalHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold">{t("entrySignal")}</h3>
        <Badge variant={direction === 'CALL' ? 'success' : 'destructive'} className="px-3 py-1 text-sm font-medium">
          {direction}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {direction === 'CALL' ? (
          <>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="font-medium text-green-700 dark:text-green-400">
              {t("buySignal")}
            </span>
          </>
        ) : (
          <>
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="font-medium text-red-700 dark:text-red-400">
              {t("sellSignal")}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
