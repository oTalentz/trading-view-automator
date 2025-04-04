
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Alert } from './AlertTypes';
import { AlertForm } from './AlertForm';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AlertsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: Alert | null;
  onSave: (alert: Partial<Alert>) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  symbol: string;
}

export function AlertsDialog({ 
  open, 
  onOpenChange, 
  alert, 
  onSave, 
  onDelete, 
  onCancel,
  symbol
}: AlertsDialogProps) {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {alert?.id ? t("editAlert") : t("createAlert")}
          </DialogTitle>
          <DialogDescription>
            {t("defineCustomAlertConditions")}
          </DialogDescription>
        </DialogHeader>
        
        <AlertForm 
          alert={alert} 
          onSave={onSave} 
          onCancel={onCancel}
          symbol={symbol}
        />
        
        {alert?.id && (
          <DialogFooter className="mt-4 border-t pt-4">
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete(alert.id);
                onOpenChange(false);
              }}
            >
              {t("deleteAlert")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AlertsDialog;
