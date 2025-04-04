
import React from 'react';
import { LanguageProvider as ActualLanguageProvider } from './LanguageContext';

// This is a compatibility wrapper to ensure the app works correctly
// Some files might be importing from LanguageProvider instead of LanguageContext
export const LanguageProvider = ActualLanguageProvider;
