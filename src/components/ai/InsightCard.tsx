
import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

export const InsightCard = ({ title, description, type }: InsightCardProps) => {
  const getIconForType = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };
  
  const getBackgroundClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900';
      case 'warning':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-900';
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900';
    }
  };
  
  return (
    <div className={`p-4 rounded-lg border ${getBackgroundClass()}`}>
      <div className="flex items-center gap-2 mb-1">
        {getIconForType()}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
