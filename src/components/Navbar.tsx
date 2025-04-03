
import { ThemeToggle } from "./ThemeToggle";
import { TrendingUp } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-trading-blue" />
          <span className="hidden font-bold sm:inline-block">
            TradingView Automator
          </span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
