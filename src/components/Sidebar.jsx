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
} from "@mui/material";
import {
  Folder as ProjectIcon,
  People as UsersIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { gradients } from "../styles/theme";

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
    },
    {
      text: "Projects",
      icon: <ProjectIcon />,
      path: "/projects",
    },
    {
      text: "Users",
      icon: <UsersIcon />,
      path: "/users",
    },
    // Add more menu items here later
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const drawer = (
    <Box>
      <Toolbar /> {/* Spacer for AppBar */}
      <List sx={{ px: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  backgroundColor: isActive ? "primary.light" : "transparent",
                  color: isActive ? "primary.main" : "text.primary",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "primary.light"
                      : "action.hover",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "primary.main" : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ mx: 2, my: 2 }} />
      {/* You can add more sections here later */}
      <Box sx={{ px: 2, py: 1 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: gradients.primary,
            color: "white",
            textAlign: "center",
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
