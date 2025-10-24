# 🎨 Theme Usage Guide

## ✅ How to Use theme.js in Your Components

### **Method 1: Using Theme Colors Directly (Recommended)**

```jsx
import { Box, Typography, Button } from "@mui/material";

<Box sx={{
  color: 'primary.main',              // Uses theme primary color
  bgcolor: 'background.paper',        // Uses theme background
  borderRadius: 2,                    // Uses theme.shape.borderRadius * 2
  p: 3,                              // Uses theme.spacing(3) = 24px
}} />

<Typography color="text.secondary">  // Uses theme text color
<Button color="primary">             // Uses theme primary color
```

### **Method 2: Import Gradients & Colors**

```jsx
import { gradients, themeColors } from "../styles/theme";

<Box
  sx={{
    background: gradients.primary, // Pre-defined gradient
    color: themeColors.accent.blue, // Specific color
  }}
/>;
```

### **Method 3: Access Theme in sx (Advanced)**

```jsx
<Box
  sx={(theme) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    boxShadow: `0 4px 20px ${theme.palette.primary.main}40`, // 40 = 25% opacity
  })}
/>
```

---

## 📚 Available Theme Values

### **Colors** (use as strings in `sx` prop)

```jsx
// Primary & Secondary
color: "primary.main";
color: "primary.light";
color: "primary.dark";
color: "secondary.main";

// Status Colors
color: "success.main";
color: "error.main";
color: "warning.main";
color: "info.main";

// Background
bgcolor: "background.default"; // Page background (#f5f7fa)
bgcolor: "background.paper"; // Card background (#ffffff)

// Text
color: "text.primary"; // Main text (#2d3748)
color: "text.secondary"; // Secondary text (#718096)
color: "text.disabled"; // Disabled text
```

### **Gradients** (import from theme)

```jsx
import { gradients } from "../styles/theme";

background: gradients.primary; // Purple gradient
background: gradients.pink; // Pink gradient
background: gradients.blue; // Blue gradient
background: gradients.green; // Green gradient
background: gradients.orange; // Orange gradient
```

### **Spacing** (multiply by 8px)

```jsx
p: 1; // padding: 8px
p: 2; // padding: 16px
p: 3; // padding: 24px
mt: 4; // margin-top: 32px
px: 2; // padding-left & padding-right: 16px
```

### **Border Radius**

```jsx
borderRadius: 1; // 12px * 1
borderRadius: 2; // 12px * 2 = 24px
borderRadius: 3; // 12px * 3 = 36px
```

### **Box Shadows**

```jsx
boxShadow: 1; // Light shadow
boxShadow: 2; // Medium shadow
boxShadow: 3; // Heavy shadow
```

---

## ✅ Updated Components Using Theme

### ✅ **Dashboard.jsx** - Uses theme properly

- ✅ `gradients.primary` for avatar
- ✅ `gradients.purple/pink/blue/green` for stat cards
- ✅ `color: "primary.main"` for icons
- ✅ `boxShadow` using theme values

### ✅ **Navbar.jsx** - Uses theme properly

- ✅ `gradients.primary` for AppBar background
- ✅ `boxShadow: 3` for elevation

### ✅ **Sidebar.jsx** - Uses theme properly

- ✅ `gradients.primary` for help card
- ✅ `color: "primary.main"` for active items
- ✅ `bgcolor: "primary.light"` for active background

---

## 🎯 Benefits of Using Theme

✅ **Change colors once** - Update `theme.js`, all components update automatically
✅ **Consistency** - Same colors everywhere
✅ **Easy rebranding** - Client wants new colors? Change theme.js in 2 minutes
✅ **Professional** - Industry standard approach

---

## 🚀 Quick Examples

### Card with Theme Colors

```jsx
<Card
  sx={{
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 3,
  }}
>
  <Typography color="primary.main" variant="h6">
    Title
  </Typography>
</Card>
```

### Button with Theme

```jsx
<Button
  variant="contained"
  color="primary" // Uses theme.palette.primary
  sx={{
    borderRadius: 2,
    px: 3,
    py: 1.5,
  }}
>
  Click Me
</Button>
```

### Gradient Card

```jsx
import { gradients } from "../styles/theme";

<Card
  sx={{
    background: gradients.primary,
    color: "white",
    p: 3,
  }}
>
  Beautiful Gradient Card
</Card>;
```

---

## 🔧 Where to Change Colors

**File**: `/src/styles/theme.js`

Change colors in the `colors` object:

```javascript
const colors = {
  primary: {
    main: "#667eea", // ← Change this for primary color
  },
  // ... change any color here
};
```

All components will automatically update! 🎉
