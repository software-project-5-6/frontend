/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getAppTheme } from "../styles/theme";

const THEME_STORAGE_KEY = "psms_theme_mode";

const ThemeContext = createContext({
  mode: "light",
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === "dark" || saved === "light" ? saved : "light";
    } catch {
      return "light";
    }
  });

  const setThemeMode = (newMode) => {
    if (newMode !== "light" && newMode !== "dark") return;
    setMode(newMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (err) {
      console.warn("Failed to persist theme mode to localStorage:", err);
    }
  };

  const toggleTheme = () => {
    setThemeMode(mode === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const isDark = mode === "dark";
    document.documentElement.setAttribute("data-theme", mode);
    document.body.setAttribute("data-theme", mode);
    document.body.style.backgroundColor = isDark ? "#0f172a" : "#f8fafc";
    document.body.style.color = isDark ? "#f8fafc" : "#0f172a";
  }, [mode]);

  const activeTheme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setThemeMode, toggleTheme }}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a CustomThemeProvider");
  }
  return context;
};
