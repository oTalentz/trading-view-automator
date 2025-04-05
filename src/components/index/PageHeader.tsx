
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Settings } from "lucide-react";

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex gap-2">
        <Link to="/configuration">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t("configuration")}
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t("dashboard")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
