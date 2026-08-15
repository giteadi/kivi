import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Dark mode removed — app always stays in light/normal mode
  const darkMode = false;

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.remove('dark');

    try {
      localStorage.removeItem('darkMode');
    } catch {
      // ignore
    }
  }, []);

  const toggleDarkMode = () => {};
  const enableDarkMode = () => {};
  const disableDarkMode = () => {};

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
