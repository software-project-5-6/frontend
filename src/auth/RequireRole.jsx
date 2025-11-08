import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";

/**
 * Component to protect routes based on user roles
 * Usage: <RequireRole allowedRoles={["APP_ADMIN"]}><YourComponent /></RequireRole>
 */
export default function RequireRole({ children, allowedRoles }) {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check if user has required role
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have permission to access this page.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Required role: {allowedRoles.join(" or ")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your role: {userRole || "None"}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return children;
}
