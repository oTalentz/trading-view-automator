
import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { IndexContent } from "@/components/index/IndexContent";

const Index = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <IndexContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
