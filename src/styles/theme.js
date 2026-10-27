import { createTheme } from "@mui/material/styles";

// 🎨 CENTRALIZED THEME CONFIGURATION (Supports Light and Dark Modes)

export const gradients = {
  primary: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)", // Royal Indigo / PSMS Purple
  purple: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",  // Violet
  pink: "linear-gradient(135deg, #db2777 0%, #ec4899 100%)",    // Pink
  blue: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",    // Sky Blue
  orange: "linear-gradient(135deg, #f97316 0%, #eab308 100%)",  // Amber Orange
  red: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",     // Danger Red
};

export const getAppTheme = (mode = "light") => {
  const isDark = mode === "dark";

  const colors = {
    primary: {
      main: isDark ? "#6366f1" : "#4f46e5",
      light: isDark ? "#818cf8" : "#e0e7ff",
      dark: isDark ? "#4f46e5" : "#4338ca",
      contrastText: "#ffffff",
    },
    secondary: {
      main: isDark ? "#94a3b8" : "#0f172a",
      light: isDark ? "#cbd5e1" : "#f1f5f9",
      dark: isDark ? "#64748b" : "#020617",
      contrastText: isDark ? "#0f172a" : "#ffffff",
    },
    background: {
      default: isDark ? "#0f172a" : "#f8fafc",
      paper: isDark ? "#1e293b" : "#ffffff",
    },
    text: {
      primary: isDark ? "#f8fafc" : "#0f172a",
      secondary: isDark ? "#94a3b8" : "#475569",
      disabled: isDark ? "#64748b" : "#94a3b8",
    },
    divider: isDark ? "#334155" : "#e2e8f0",
    success: {
      main: "#10b981",
      light: isDark ? "#064e3b" : "#d1fae5",
      dark: "#065f46",
      contrastText: isDark ? "#a7f3d0" : "#047857",
    },
    error: {
      main: "#ef4444",
      light: isDark ? "#7f1d1d" : "#fee2e2",
      dark: "#991b1b",
      contrastText: isDark ? "#fecaca" : "#b91c1c",
    },
    warning: {
      main: "#f59e0b",
      light: isDark ? "#78350f" : "#fef3c7",
      dark: "#92400e",
      contrastText: isDark ? "#fde68a" : "#b45309",
    },
    info: {
      main: "#06b6d4",
      light: isDark ? "#164e63" : "#ecfeff",
      dark: "#0891b2",
      contrastText: isDark ? "#a5f3fc" : "#0e7490",
    },
    grey: {
      50: isDark ? "#0f172a" : "#f8fafc",
      100: isDark ? "#1e293b" : "#f1f5f9",
      200: isDark ? "#334155" : "#e2e8f0",
      300: isDark ? "#475569" : "#cbd5e1",
      400: isDark ? "#64748b" : "#94a3b8",
      500: "#64748b",
      600: isDark ? "#94a3b8" : "#475569",
      700: isDark ? "#cbd5e1" : "#334155",
      800: isDark ? "#e2e8f0" : "#1e293b",
      900: isDark ? "#f8fafc" : "#0f172a",
    },
  };

  const typography = {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 13,
    button: {
      fontSize: "0.8125rem",
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.01em",
    },
    h1: { fontWeight: 800, fontSize: "2.5rem" },
    h2: { fontWeight: 700, fontSize: "2rem" },
    h3: { fontWeight: 700, fontSize: "1.75rem" },
    h4: { fontWeight: 700, fontSize: "1.4rem" },
    h5: { fontWeight: 600, fontSize: "1.1rem" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    subtitle1: { fontWeight: 500, fontSize: "0.9rem" },
    subtitle2: { fontWeight: 600, fontSize: "0.8125rem" },
    body1: { fontSize: "0.875rem", lineHeight: 1.5 },
    body2: { fontSize: "0.8rem", lineHeight: 1.43 },
    caption: { fontSize: "0.7rem" },
  };

  const spacing = 8;
  const shape = { borderRadius: 7 };

  const components = {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: 7,
          padding: "6px 14px",
          fontSize: "0.8125rem",
          fontWeight: 600,
          boxShadow: "none",
          textTransform: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: isDark
              ? "0 2px 4px 0 rgba(0, 0, 0, 0.4)"
              : "0 2px 4px 0 rgba(0, 0, 0, 0.05)",
          },
        },
        contained: {
          boxShadow: isDark
            ? "0 1px 2px 0 rgba(0, 0, 0, 0.3)"
            : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          "&:hover": {
            boxShadow: isDark
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.4)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
        },
        outlined: {
          borderColor: isDark ? "#334155" : "#e2e8f0",
          color: isDark ? "#f8fafc" : "#334155",
          "&:hover": {
            borderColor: isDark ? "#64748b" : "#cbd5e1",
            backgroundColor: isDark ? "#334155" : "#f8fafc",
          },
        },
      },
    },

    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
          boxShadow: isDark
            ? "0 2px 8px 0 rgba(0, 0, 0, 0.35)"
            : "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: isDark ? "#334155" : "#e2e8f0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: isDark ? "#64748b" : "#cbd5e1",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: isDark ? "#6366f1" : "#4f46e5",
            borderWidth: "2px",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: "none",
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
        },
        elevation0: {
          boxShadow: "none",
          border: "none",
        },
        elevation1: {
          boxShadow: isDark
            ? "0 2px 6px 0 rgba(0, 0, 0, 0.3)"
            : "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        },
        elevation2: {
          boxShadow: isDark
            ? "0 4px 8px 0 rgba(0, 0, 0, 0.4)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        },
        elevation3: {
          boxShadow: isDark
            ? "0 8px 16px 0 rgba(0, 0, 0, 0.45)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          borderRight: `1px solid ${isDark ? "#334155" : "rgba(0, 0, 0, 0.08)"}`,
        },
      },
    },

    MuiChip: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: "0.7rem",
          height: "22px",
        },
        outlined: {
          borderColor: isDark ? "#334155" : "#e2e8f0",
        },
        colorDefault: {
          backgroundColor: isDark ? "#334155" : "#f1f5f9",
          color: isDark ? "#f8fafc" : "#475569",
        },
        colorPrimary: {
          backgroundColor: isDark ? "rgba(99, 102, 241, 0.2)" : "#e0e7ff",
          color: isDark ? "#a5b4fc" : "#4338ca",
          border: "none",
        },
        colorSecondary: {
          backgroundColor: isDark ? "#334155" : "#f1f5f9",
          color: isDark ? "#f8fafc" : "#334155",
          border: "none",
        },
        colorSuccess: {
          backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#d1fae5",
          color: isDark ? "#6ee7b7" : "#065f46",
          border: "none",
        },
        colorError: {
          backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : "#fee2e2",
          color: isDark ? "#fca5a5" : "#991b1b",
          border: "none",
        },
        colorWarning: {
          backgroundColor: isDark ? "rgba(245, 158, 11, 0.2)" : "#fef3c7",
          color: isDark ? "#fcd34d" : "#92400e",
          border: "none",
        },
        colorInfo: {
          backgroundColor: isDark ? "rgba(6, 182, 212, 0.2)" : "#ecfeff",
          color: isDark ? "#67e8f9" : "#0891b2",
          border: "none",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "10px 16px",
          borderColor: isDark ? "#334155" : "#f1f5f9",
          fontSize: "0.8125rem",
          color: isDark ? "#f8fafc" : "#0f172a",
        },
        head: {
          padding: "10px 16px",
          backgroundColor: isDark ? "#0f172a" : "#f8fafc",
          color: isDark ? "#94a3b8" : "#475569",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        },
      },
    },
  };

  return createTheme({
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      background: colors.background,
      text: colors.text,
      divider: colors.divider,
      grey: colors.grey,
    },
    typography,
    spacing,
    shape,
    components,
  });
};

// Default static light theme export for backward compatibility
export const theme = getAppTheme("light");
