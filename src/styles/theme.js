import { createTheme } from "@mui/material/styles";

// 🎨 CENTRALIZED THEME CONFIGURATION

// ================== COLOR PALETTE ==================
const colors = {
  // Primary Brand Colors (Modern Indigo)
  primary: {
    main: "#4f46e5",
    light: "#e0e7ff",
    dark: "#4338ca",
    contrastText: "#ffffff",
  },

  // Secondary Brand Colors (Sleek Slate)
  secondary: {
    main: "#0f172a",
    light: "#f1f5f9",
    dark: "#020617",
    contrastText: "#ffffff",
  },

  // Background Colors
  background: {
    default: "#f8fafc",
    paper: "#ffffff",
  },

  // Text Colors
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    disabled: "#94a3b8",
  },

  // Status Colors (Modern Pastel/Semi-vibrant)
  success: {
    main: "#10b981",
    light: "#d1fae5",
    dark: "#065f46",
    contrastText: "#047857",
  },
  error: {
    main: "#ef4444",
    light: "#fee2e2",
    dark: "#991b1b",
    contrastText: "#b91c1c",
  },
  warning: {
    main: "#f59e0b",
    light: "#fef3c7",
    dark: "#92400e",
    contrastText: "#b45309",
  },
  info: {
    main: "#06b6d4",
    light: "#ecfeff",
    dark: "#0891b2",
    contrastText: "#0e7490",
  },
};

// ================== TYPOGRAPHY ==================
const typography = {
  fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  fontSize: 14,

  button: {
    fontSize: "0.875rem",
    fontWeight: 600,
    textTransform: "none",
    letterSpacing: "0.01em",
  },
  h1: { fontWeight: 800 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 700 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  subtitle1: { fontWeight: 500 },
  subtitle2: { fontWeight: 600 },
  body1: { fontSize: "0.925rem", lineHeight: 1.5 },
  body2: { fontSize: "0.85rem", lineHeight: 1.43 },
};

// ================== SPACING ==================
const spacing = 8;

// ================== BORDER RADIUS ==================
const shape = {
  borderRadius: 8,
};

// ================== COMPONENT OVERRIDES ==================
const components = {
  // Button Component
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: "8px 18px",
        fontSize: "0.875rem",
        fontWeight: 600,
        boxShadow: "none",
        textTransform: "none",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        },
      },
      contained: {
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "&:hover": {
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        },
      },
      outlined: {
        borderColor: "#e2e8f0",
        color: "#334155",
        "&:hover": {
          borderColor: "#cbd5e1",
          backgroundColor: "#f8fafc",
        },
      },
    },
  },

  // Card Component
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
      },
    },
  },

  // TextField / Outlined Input
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e2e8f0",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#cbd5e1",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#4f46e5",
          borderWidth: "2px",
        },
      },
    },
  },

  // Paper Component
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        backgroundImage: "none",
      },
      elevation0: {
        boxShadow: "none",
        border: "none",
      },
      elevation1: {
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
      },
      elevation2: {
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
      },
      elevation3: {
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
      },
      elevation24: {
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        border: "none",
      },
    },
  },

  // Chip Component
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 600,
        fontSize: "0.75rem",
        height: "24px",
      },
      outlined: {
        borderColor: "#e2e8f0",
      },
      colorDefault: {
        backgroundColor: "#f1f5f9",
        color: "#475569",
      },
      colorPrimary: {
        backgroundColor: "#e0e7ff",
        color: "#4338ca",
        border: "none",
      },
      colorSecondary: {
        backgroundColor: "#f1f5f9",
        color: "#334155",
        border: "none",
      },
      colorSuccess: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
        border: "none",
      },
      colorError: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        border: "none",
      },
      colorWarning: {
        backgroundColor: "#fef3c7",
        color: "#92400e",
        border: "none",
      },
      colorInfo: {
        backgroundColor: "#ecfeff",
        color: "#0891b2",
        border: "none",
      },
    },
  },

  // Table Styling Overrides
  MuiTableHead: {
    styleOverrides: {
      root: {
        "& .MuiTableCell-head": {
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: "16px 20px",
        borderColor: "#f1f5f9",
      },
      head: {
        padding: "14px 20px",
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        transition: "background-color 0.15s ease-in-out",
      },
    },
  },

  // Dialog Overrides
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: "1.125rem",
        fontWeight: 700,
        padding: "24px 24px 16px 24px",
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: "8px 24px 24px 24px",
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: "16px 24px 24px 24px",
        gap: 8,
      },
    },
  },
};

// ================== CREATE THEME ==================
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: colors.text,
  },
  typography,
  spacing,
  shape,
  components,
});

// ================== EXPORT GRADIENTS ==================
export const gradients = {
  primary: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", // Midnight Slate
  purple: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",  // Premium Indigo
  pink: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",    // Violet-Indigo (replaces loud pink)
  blue: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",    // Sky-Royal Blue
  orange: "linear-gradient(135deg, #f97316 0%, #eab308 100%)",  // Amber Orange
};

