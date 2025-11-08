import { createTheme } from "@mui/material/styles";

// 🎨 CENTRALIZED THEME CONFIGURATION

// ================== COLOR PALETTE ==================
const colors = {
  // Primary Brand Colors
  primary: {
    main: "#667eea",
    light: "#8a9ff5",
    dark: "#4d5fd6",
    contrastText: "#ffffff",
  },

  // Secondary Brand Colors
  secondary: {
    main: "#764ba2",
    light: "#9b6bc9",
    dark: "#5a3a7d",
    contrastText: "#ffffff",
  },

  // Background Colors
  background: {
    default: "#f5f7fa",
    paper: "#ffffff",
  },

  // Text Colors
  text: {
    primary: "#2d3748",
    secondary: "#718096",
    disabled: "#a0aec0",
  },

  // Status Colors
  success: {
    main: "#43e97b",
    light: "#6ff59a",
    dark: "#2ec764",
  },
  error: {
    main: "#f5576c",
    light: "#f77d8d",
    dark: "#d93d53",
  },
  warning: {
    main: "#feca57",
    light: "#fed976",
    dark: "#e5b14f",
  },
  info: {
    main: "#4facfe",
    light: "#72bdfe",
    dark: "#3892e5",
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
    letterSpacing: "0.02857em",
  },
};

// ================== SPACING ==================
const spacing = 8;

// ================== BORDER RADIUS ==================
const shape = {
  borderRadius: 6,
};

// ================== COMPONENT OVERRIDES ==================
const components = {
  // Button Component
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: "10px 24px",
        fontSize: "0.875rem",
        fontWeight: 600,
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      },
      contained: {
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },

  // Card Component
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      },
    },
  },

  // TextField Component
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
        },
      },
    },
  },

  // Paper Component
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
      elevation2: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
      elevation3: {
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
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
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  purple: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  pink: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  blue: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  orange: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
};
