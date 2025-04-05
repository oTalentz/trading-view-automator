
import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export function SectionHeader({ icon: Icon, title, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-2 mb-3 ${className}`}>
      <Icon className="h-5 w-5" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
}
