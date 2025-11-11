import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import {
  Folder as ProjectIcon,
  People as UsersIcon,
  AutoAwesome as AIIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { gradients } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import { ShowForAdmin } from "./RoleBasedComponents";

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, isAdmin } = useAuth();

  // Menu items visible to all authenticated users
  const commonMenuItems = [
    {
      text: "AI Assistant",
      icon: <AIIcon />,
      path: "/",
    },
    {
      text: "Projects",
      icon: <ProjectIcon />,
      path: "/projects",
    },
  ];

  // Menu items visible only to admins
  const adminMenuItems = [
    {
      text: "Users",
      icon: <UsersIcon />,
      path: "/users",
      adminOnly: true,
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      adminOnly: true,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Format role display text
  const getRoleDisplayText = () => {
    if (!userRole) return "Loading...";
    return userRole.replace("APP_", "");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar /> {/* Spacer for AppBar */}
      {/* User Role Badge - at top */}
      <Box sx={{ px: 2, pt: 1, pb: 2 }}>
        <Chip
          label={getRoleDisplayText()}
          size="small"
          color={isAdmin() ? "error" : "primary"}
          sx={{
            fontWeight: 600,
            fontSize: "0.65rem",
            height: "20px",
            textTransform: "uppercase",
            letterSpacing: 0.3,
          }}
        />
      </Box>
      {/* Main Navigation */}
      <List sx={{ px: 1, pt: 0, flex: 1 }}>
        {/* Common menu items - visible to all */}
        {commonMenuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  backgroundColor: isActive ? "primary.light" : "grey.200",
                  color: isActive ? "#000" : "text.primary",
                  "&:hover": {
                    backgroundColor: isActive ? "primary.light" : "grey.300",
                    opacity: isActive ? 0.9 : 1,
                  },
                  transition: "all 0.2s",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#000" : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* Admin-only menu items */}
        <ShowForAdmin>
          <Divider sx={{ mx: 2, my: 2 }} />
          <ListItem sx={{ px: 2, mb: 1 }}>
            <ListItemText
              primary="Admin Tools"
              primaryTypographyProps={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            />
          </ListItem>

          {adminMenuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    backgroundColor: isActive ? "error.light" : "grey.200",
                    color: isActive ? "#000" : "text.primary",
                    "&:hover": {
                      backgroundColor: isActive ? "error.light" : "grey.300",
                      opacity: isActive ? 0.9 : 1,
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#000" : "text.secondary",
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.9rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </ShowForAdmin>
      </List>
      {/* Bottom Section */}
      <Box sx={{ px: 2, pb: 2 }}>
        {/* Help Section */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: gradients.primary,
            color: "white",
            textAlign: "center",
            cursor: "pointer",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <Box sx={{ fontSize: "0.75rem", opacity: 0.9, mb: 0.5 }}>
            Need Help?
          </Box>
          <Box sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
            Contact Support
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
