import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("aspu:theme") || "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    try { localStorage.setItem("aspu:theme", theme); } catch (e) {}
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const value = { theme, setTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
