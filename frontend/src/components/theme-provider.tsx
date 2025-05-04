"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    // Remove the old theme class
    document.documentElement.classList.remove("light", "dark");
    // Add the new theme class
    document.documentElement.classList.add(theme);

    if (disableTransitionOnChange) {
      document.documentElement.classList.add("[&_*]:!transition-none");
      setTimeout(() => {
        document.documentElement.classList.remove("[&_*]:!transition-none");
      }, 0);
    }
  }, [theme, disableTransitionOnChange]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
