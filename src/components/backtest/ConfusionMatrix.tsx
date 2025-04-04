
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SignalHistoryEntry } from '@/utils/signalHistoryUtils';
import { CheckCircle, XCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ConfusionMatrixProps {
  signals: SignalHistoryEntry[];
}

export function ConfusionMatrix({ signals }: ConfusionMatrixProps) {
  const { t } = useLanguage();
  
  // Calculate confusion matrix
  const calculateMatrix = () => {
    const matrix = {
      truePositives: 0, // Predicted CALL, Actual WIN
      falsePositives: 0, // Predicted CALL, Actual LOSS
      trueNegatives: 0, // Predicted PUT, Actual WIN
      falseNegatives: 0, // Predicted PUT, Actual LOSS
    };
    
    signals.forEach(signal => {
      if (!signal.result) return;
      
      if (signal.direction === 'CALL') {
        if (signal.result === 'WIN') {
          matrix.truePositives++;
        } else if (signal.result === 'LOSS') {
          matrix.falsePositives++;
        }
      } else if (signal.direction === 'PUT') {
        if (signal.result === 'WIN') {
          matrix.trueNegatives++;
        } else if (signal.result === 'LOSS') {
          matrix.falseNegatives++;
        }
      }
    });
    
    // Calculate metrics
    const total = matrix.truePositives + matrix.falsePositives + 
                 matrix.trueNegatives + matrix.falseNegatives;
    
    const accuracy = total > 0 ? 
      ((matrix.truePositives + matrix.trueNegatives) / total) * 100 : 0;
    
    const precision = (matrix.truePositives + matrix.falsePositives) > 0 ?
      (matrix.truePositives / (matrix.truePositives + matrix.falsePositives)) * 100 : 0;
    
    const recall = (matrix.truePositives + matrix.falseNegatives) > 0 ?
      (matrix.truePositives / (matrix.truePositives + matrix.falseNegatives)) * 100 : 0;
    
    const f1Score = (precision + recall) > 0 ?
      (2 * precision * recall) / (precision + recall) : 0;
    
    return {
      matrix,
      metrics: {
        accuracy: Math.round(accuracy),
        precision: Math.round(precision),
        recall: Math.round(recall),
        f1Score: Math.round(f1Score / 100)
      }
    };
  };
  
  const { matrix, metrics } = calculateMatrix();
  
  // Count by prediction direction
  const callSignals = signals.filter(s => s.direction === 'CALL').length;
  const putSignals = signals.filter(s => s.direction === 'PUT').length;
  const callPercentage = signals.length > 0 ? Math.round((callSignals / signals.length) * 100) : 0;
  const putPercentage = signals.length > 0 ? Math.round((putSignals / signals.length) * 100) : 0;
  
  // Calculate win rates by direction
  const callWinRate = callSignals > 0 ? 
    Math.round((matrix.truePositives / callSignals) * 100) : 0;
  
  const putWinRate = putSignals > 0 ? 
    Math.round((matrix.trueNegatives / putSignals) * 100) : 0;
  
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-medium">{t("directionAnalysis")}</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-green-800 dark:text-green-400">CALL</div>
            <div className="text-sm text-green-800/70 dark:text-green-400/70">{callPercentage}%</div>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center">
            {callWinRate}%
            <CheckCircle className="ml-2 h-5 w-5" />
          </div>
          <div className="text-xs text-green-800/70 dark:text-green-400/70 mt-1">
            {callSignals} {t("signals")}
          </div>
        </div>
        
        <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-red-800 dark:text-red-400">PUT</div>
            <div className="text-sm text-red-800/70 dark:text-red-400/70">{putPercentage}%</div>
          </div>
          <div className="text-2xl font-bold text-red-700 dark:text-red-400 flex items-center">
            {putWinRate}%
            <XCircle className="ml-2 h-5 w-5" />
          </div>
          <div className="text-xs text-red-800/70 dark:text-red-400/70 mt-1">
            {putSignals} {t("signals")}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">{t("accuracy")}</div>
          <Progress value={metrics.accuracy} className="h-2" />
          <div className="text-xl font-medium">{metrics.accuracy}%</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">{t("precision")}</div>
          <Progress value={metrics.precision} className="h-2" />
          <div className="text-xl font-medium">{metrics.precision}%</div>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-sm text-muted-foreground mb-2">{t("matrixBreakdown")}</div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">{t("truePositives")}</div>
            <div className="font-medium">{matrix.truePositives}</div>
          </div>
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">{t("falsePositives")}</div>
            <div className="font-medium">{matrix.falsePositives}</div>
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">{t("trueNegatives")}</div>
            <div className="font-medium">{matrix.trueNegatives}</div>
          </div>
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">{t("falseNegatives")}</div>
            <div className="font-medium">{matrix.falseNegatives}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
