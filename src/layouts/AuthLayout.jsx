import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { gradients } from "../styles/theme";

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        maxHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: gradients.primary,
        position: "relative",
        overflow: "auto",
        py: { xs: 2, sm: 3 },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container
        maxWidth="xs"
        sx={{ position: "relative", zIndex: 1, my: "auto" }}
      >
        {/* Logo/Brand Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 2.5, sm: 3 } }}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              color: "white",
              mb: 0.5,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              letterSpacing: 1,
              fontSize: { xs: "2rem", sm: "2.5rem" },
            }}
          >
            PSMS
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.95)",
              fontWeight: 500,
              fontSize: { xs: "0.875rem", sm: "0.95rem" },
            }}
          >
            Project & Software Management System
          </Typography>
        </Box>

        {/* Auth Form Container */}
        <Paper
          elevation={24}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          {children}
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: "center", mt: { xs: 2.5, sm: 3 } }}>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.85)",
              display: "block",
              mb: 0.5,
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
            }}
          >
            © 2025 PSMS. All rights reserved.
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
            }}
          >
            Secure authentication powered by AWS Cognito
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
