import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { gradients } from "../styles/theme";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { userAttributes } = useAuth();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = () => {
    if (userAttributes?.name) {
      const names = userAttributes.name.split(" ");
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
      }
      return userAttributes.name.charAt(0).toUpperCase();
    }
    if (userAttributes?.email) {
      return userAttributes.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (userAttributes?.name) {
      return userAttributes.name;
    }
    if (userAttributes?.email) {
      return userAttributes.email.split("@")[0];
    }
    return "User";
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: gradients.primary,
        boxShadow: 3,
        borderRadius: "0",
      }}
    >
      <Toolbar>
        {/* Menu Icon for Mobile */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* App Title/Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          Space Management
        </Typography>

        {/* User Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              display: { xs: "none", sm: "block" },
              mr: 1,
            }}
          >
            {getDisplayName()}
          </Typography>

          {/* User Avatar with Menu */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                fontWeight: 600,
                transition: "all 0.3s",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                  transform: "scale(1.05)",
                },
              }}
            >
              {getInitials()}
            </Avatar>
          </IconButton>
        </Box>

        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          TransitionProps={{
            timeout: 300,
          }}
        >
          {/* User Info in Menu */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {getDisplayName()}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize="0.75rem"
            >
              {userAttributes?.email}
            </Typography>
          </Box>

          <Divider />

          {/* Profile Menu Item */}
          <MenuItem
            onClick={handleProfile}
            sx={{
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "primary.light",
                transform: "translateX(4px)",
              },
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>

          {/* Settings Menu Item */}
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "primary.light",
                transform: "translateX(4px)",
              },
            }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>

          <Divider />

          {/* Logout Menu Item */}
          <MenuItem
            onClick={handleSignOut}
            sx={{
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "error.light",
                transform: "translateX(4px)",
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Logout</Typography>
            </ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
