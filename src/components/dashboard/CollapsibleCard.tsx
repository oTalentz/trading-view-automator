
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Star, LucideIcon } from 'lucide-react';

type CollapsibleCardProps = {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  id: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
};

export function CollapsibleCard({
  title,
  icon: Icon,
  children,
  defaultExpanded = false,
  id,
  favorites,
  onToggleFavorite
}: CollapsibleCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer bg-muted/50" 
        onClick={() => setExpanded(prev => !prev)}>
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(id);
            }}
          >
            <Star className={`h-4 w-4 ${favorites.includes(id) ? 'fill-primary text-primary' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="p-4">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
