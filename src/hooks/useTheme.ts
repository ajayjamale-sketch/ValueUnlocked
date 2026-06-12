import { useState, useEffect } from 'react';
import { getTheme, setTheme } from '@/lib/auth';

export const useTheme = () => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    // Read the already-applied theme from the DOM to stay in sync
    if (document.documentElement.classList.contains('dark')) return 'dark';
    return getTheme();
  });

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
};
