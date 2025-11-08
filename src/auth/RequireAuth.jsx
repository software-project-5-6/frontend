import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";
import { CircularProgress, Box } from "@mui/material";

export default function RequireAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

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

  if (!isAuthenticated) {
    // Save the intended destination (including search params for invitation token)
    const intendedPath = location.pathname + location.search;
    return <Navigate to="/login" state={{ from: intendedPath }} replace />;
  }

  return children;
}
