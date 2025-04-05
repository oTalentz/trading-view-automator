
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t py-6">
      <div className="container text-center text-sm text-muted-foreground">
        <p>{t("tradingViewAutomator")} - {t("tradingMadeSimple")}</p>
      </div>
    </footer>
  );
}
