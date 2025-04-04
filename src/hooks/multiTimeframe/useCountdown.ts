
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { playAlertSound } from '@/utils/audioUtils';
import { sendNotification, getNotificationSettings } from '@/utils/pushNotificationUtils';

export function useCountdown(
  countdown: number, 
  setCountdown: React.Dispatch<React.SetStateAction<number>>,
  analysis: any,
  symbol: string,
  updateCallback?: () => void
) {
  const { t } = useLanguage();
  
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          
          // Quando chega a zero, notifica que é hora da entrada
          if (analysis) {
            toast.info(
              analysis.primarySignal.direction === 'CALL' 
                ? `${t("executeCall")} ${symbol}` 
                : `${t("executePut")} ${symbol}`,
              { description: t("preciseEntryNow") }
            );
            
            // Play entry sound alert
            playAlertSound('entry');
            
            // Envia notificação de entrada se habilitado
            const notifSettings = getNotificationSettings();
            if (notifSettings.enabled) {
              sendNotification(
                'Momento de Entrada!',
                {
                  body: `${symbol} - ${analysis.primarySignal.direction === 'CALL' ? 'COMPRA' : 'VENDA'} AGORA!`,
                  icon: '/favicon.ico',
                }
              );
            }
          }
          
          return 0;
        }
        return prev - 1;
      });
      
      // Call update callback if provided
      if (updateCallback) {
        updateCallback();
      }
      
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown, analysis, symbol, t, updateCallback, setCountdown]);
}
