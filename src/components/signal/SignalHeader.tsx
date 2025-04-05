
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';

interface SignalHeaderProps {
  direction: 'CALL' | 'PUT';
}

export function SignalHeader({ direction }: SignalHeaderProps) {
  const { t } = useLanguage();
  
  const gradientBg = direction === 'CALL' 
    ? 'bg-gradient-to-r from-green-900 to-green-800' 
    : 'bg-gradient-to-r from-red-900 to-red-800';
  
  const glowColor = direction === 'CALL'
    ? 'shadow-[0_0_15px_rgba(34,197,94,0.5)]'
    : 'shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  
  return (
    <div className={`${gradientBg} rounded-t-lg -mx-4 -mt-4 px-4 py-3 border-b border-gray-700/50 mb-4 ${glowColor} transform perspective-[1000px] rotate-x-1`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white">{t("entrySignal")}</h3>
        <Badge variant={direction === 'CALL' ? 'success' : 'destructive'} 
               className="px-4 py-1 text-sm font-bold uppercase tracking-wider transform hover:scale-110 transition-transform shadow-lg">
          {direction}
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-white">
        {direction === 'CALL' ? (
          <>
            <div className="bg-green-500/20 p-2 rounded-full transform hover:rotate-y-12 transition-transform">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <span className="font-medium text-green-400">
              {t("buySignal")} <span className="text-gray-400 text-sm ml-1">{t("forNextCandle")}</span>
            </span>
          </>
        ) : (
          <>
            <div className="bg-red-500/20 p-2 rounded-full transform hover:rotate-y-12 transition-transform">
              <TrendingDown className="h-5 w-5 text-red-400" />
            </div>
            <span className="font-medium text-red-400">
              {t("sellSignal")} <span className="text-gray-400 text-sm ml-1">{t("forNextCandle")}</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
