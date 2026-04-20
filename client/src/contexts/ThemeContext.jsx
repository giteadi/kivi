import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    try {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // ignore
    }
    // Default to true (dark mode) - since calendar looks best in dark
    return true;
  });

  useEffect(() => {
    // Save to localStorage
    try {
      localStorage.setItem('darkMode', darkMode.toString());
    } catch {
      // ignore
    }
    
    // Apply/remove dark class on html element
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }

    if (import.meta?.env?.DEV) {
      // eslint-disable-next-line no-console
      console.log('[theme] applied', {
        darkMode,
        htmlHasDark: document.documentElement.classList.contains('dark'),
        bodyHasDark: document.body.classList.contains('dark'),
        dataTheme: document.documentElement.getAttribute('data-theme'),
        stored: (() => {
          try {
            return localStorage.getItem('darkMode');
          } catch {
            return 'localStorage_error';
          }
        })(),
      });
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (import.meta?.env?.DEV) {
        // eslint-disable-next-line no-console
        console.log('[theme] toggle click', { prev, next });
      }
      return next;
    });
  };

  const enableDarkMode = () => {
    setDarkMode(true);
  };

  const disableDarkMode = () => {
    setDarkMode(false);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, enableDarkMode, disableDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
