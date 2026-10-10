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

// ================== SPACING ==================
const spacing = 8;

// ================== BORDER RADIUS ==================
const shape = {
  borderRadius: 7,
};

// ================== COMPONENT OVERRIDES ==================
const components = {
  // Button Component
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

  // IconButton Component
  MuiIconButton: {
    defaultProps: {
      size: "small",
    },
  },

  // TextField Component
  MuiTextField: {
    defaultProps: {
      size: "small",
    },
  },

  // Card Component
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
      },
    },
  },

  // TextField / Outlined Input
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 7,
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
        padding: "10px 16px",
        borderColor: "#f1f5f9",
        fontSize: "0.8125rem",
      },
      head: {
        padding: "10px 16px",
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
        fontSize: "1.05rem",
        fontWeight: 700,
        padding: "18px 20px 14px 20px",
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: "6px 20px 20px 20px",
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: "12px 20px 18px 20px",
        gap: 6,
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
  primary: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)", // Royal Indigo
  purple: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",  // Violet
  pink: "linear-gradient(135deg, #db2777 0%, #ec4899 100%)",    // Pink
  blue: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",    // Sky Blue
  orange: "linear-gradient(135deg, #f97316 0%, #eab308 100%)",  // Amber Orange
  red: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",     // Danger Red (destructive confirmations)
};

