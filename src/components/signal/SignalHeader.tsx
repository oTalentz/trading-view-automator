
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SignalHeaderProps {
  direction: 'CALL' | 'PUT';
}

export function SignalHeader({ direction }: SignalHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{t("entrySignal")}</h3>
        <div className={`px-2 py-1 rounded text-white ${
          direction === 'CALL' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {direction}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {direction === 'CALL' ? (
          <ArrowUpCircle className="h-6 w-6 text-green-500" />
        ) : (
          <ArrowDownCircle className="h-6 w-6 text-red-500" />
        )}
        <span className="font-medium">
          {direction === 'CALL' ? t("buySignal") : t("sellSignal")}
        </span>
      </div>
    </>
  );
}
