
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

const Index: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">Smart Signal</h1>
            <nav className="hidden md:block">
              <ul className="flex gap-4">
                <li>
                  <Link to="/" className="text-sm font-medium">
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-sm font-medium">
                    {t("dashboard")}
                  </Link>
                </li>
                <li>
                  <Link to="/pocket-option-otc" className="text-sm font-medium">
                    Pocket Option OTC
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="grid gap-6">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-4">
              {t("welcome")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("welcomeDescription")}
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/dashboard">{t("dashboard")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/pocket-option-otc">Pocket Option OTC</Link>
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-bold mb-2">{t("featuresTitle1")}</h3>
              <p className="text-muted-foreground">
                {t("featuresDescription1")}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-bold mb-2">{t("featuresTitle2")}</h3>
              <p className="text-muted-foreground">
                {t("featuresDescription2")}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-bold mb-2">{t("featuresTitle3")}</h3>
              <p className="text-muted-foreground">
                {t("featuresDescription3")}
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Smart Signal. {t("rightsReserved")}
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              {t("termsAndConditions")}
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              {t("privacyPolicy")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
