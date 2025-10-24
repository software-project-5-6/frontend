import { createTheme } from "@mui/material/styles";

// 🎨 CENTRALIZED THEME CONFIGURATION
// Your  can change all colors, fonts, spacing, and styles from this single file

// ================== COLOR PALETTE ==================
const colors = {
  // Primary Brand Colors
  primary: {
    main: "#667eea", // Main brand color
    light: "#8a9ff5", // Lighter variant
    dark: "#4d5fd6", // Darker variant
    contrastText: "#ffffff", // Text on primary color
  },

  // Secondary Brand Colors
  secondary: {
    main: "#764ba2", // Secondary brand color
    light: "#9b6bc9", // Lighter variant
    dark: "#5a3a7d", // Darker variant
    contrastText: "#ffffff",
  },

  // Accent Colors for Different Purposes
  accent: {
    purple: "#667eea",
    pink: "#f093fb",
    blue: "#4facfe",
    green: "#43e97b",
    orange: "#fa709a",
    red: "#f5576c",
  },

  // Background Colors
  background: {
    default: "#f5f7fa", // Page background
    paper: "#ffffff", // Card/Paper background
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },

  // Text Colors
  text: {
    primary: "#2d3748", // Main text color
    secondary: "#718096", // Secondary text color
    disabled: "#a0aec0", // Disabled text
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
  // Font Family - Change this to your preferred font
  fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",

  // Font Sizes
  fontSize: 14, // Base font size in px

  // Heading Styles
  h1: {
    fontSize: "3rem", // 48px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.01562em",
  },
  h2: {
    fontSize: "2.5rem", // 40px
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: "2rem", // 32px
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: "1.5rem", // 24px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: "1.25rem", // 20px
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: "1rem", // 16px
    fontWeight: 600,
    lineHeight: 1.6,
  },

  // Body Text
  body1: {
    fontSize: "1rem", // 16px
    lineHeight: 1.5,
  },
  body2: {
    fontSize: "0.875rem", // 14px
    lineHeight: 1.43,
  },

  // Button Text
  button: {
    fontSize: "0.875rem", // 14px
    fontWeight: 600,
    textTransform: "none", // Remove uppercase
    letterSpacing: "0.02857em",
  },
};

// ================== SPACING ==================
const spacing = 8; // Base spacing unit (8px) - all margins/paddings multiply by this

// ================== BORDER RADIUS ==================
const shape = {
  borderRadius: 12, // Default border radius for cards, buttons, etc.
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

// ================== EXPORT COLORS FOR DIRECT USE ==================
// Use these in your components when you need specific colors
// Example: import { themeColors } from './styles/theme'
export const themeColors = colors;

// ================== EXPORT GRADIENTS ==================
export const gradients = {
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  purple: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  pink: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  blue: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  green: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  orange: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  sunset: "linear-gradient(135deg, #fa709a 0%, #764ba2 100%)",
};
