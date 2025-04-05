
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { TrendingUp, Home } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { t } = useLanguage();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-trading-blue" />
          <span className="hidden font-bold sm:inline-block">
            {t("tradingViewAutomator")}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link to="/">
              <Button variant="outline" size="icon" className="mr-2" aria-label="Return to home">
                <Home className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">{t("returnToHome")}</span>
              </Button>
            </Link>
            <LanguageToggle />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
