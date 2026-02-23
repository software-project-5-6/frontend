import React, { useState } from "react";
import { Box, Toolbar, Fade } from "@mui/material";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Navbar */}
      <Navbar onMenuClick={handleDrawerToggle} />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          minHeight: "100vh",
          backgroundColor: "#f5f7fa",
          overflow: "auto",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Fade in={true} timeout={400} key={location.pathname}>
          <Box>{children}</Box>
        </Fade>
      </Box>
    </Box>
  );
}
