import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ConfigurationPage from "./pages/ConfigurationPage";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from './context/LanguageContext';
import { AIAnalysisProvider } from './context/AIAnalysisContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AIAnalysisProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/configuration" element={<ConfigurationPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AIAnalysisProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
