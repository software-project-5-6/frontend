import React, { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Card,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      // 🔹 AWS Cognito Authentication
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password,
      });

      if (isSignedIn) {
        setMessage("✅ Login successful!");

        // Refresh auth context to load user role before navigation
        await refreshAuth();

        // Use navigate instead of window.location.href for better React routing
        navigate("/", { replace: true });
      }
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
      <Typography
        variant="h5"
        align="center"
        fontWeight={700}
        sx={{
          mb: 0.5,
          color: "primary.main",
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Welcome Back
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mb: 2.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
      >
        Sign in to your account to continue
      </Typography>

      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="dense"
        size="small"
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="dense"
        size="small"
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{
          mt: 1,
          py: 1,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          fontSize: { xs: "0.9rem", sm: "1rem" },
          boxShadow: 2,
          "&:hover": {
            boxShadow: 4,
          },
        }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
      </Button>

      {message && (
        <Typography
          align="center"
          sx={{
            mt: 1.5,
            fontSize: "0.85rem",
            color: message.includes("✅") ? "success.main" : "error.main",
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}

      {/* Forgot Password Link */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
        <Button
          onClick={() => navigate("/forgot-password")}
          sx={{
            textTransform: "none",
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            color: "primary.main",
            "&:hover": {
              backgroundColor: "primary.50",
            },
          }}
        >
          Forgot Password?
        </Button>
      </Box>

      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
        >
          Don't have an account?{" "}
          <Button
            onClick={() => navigate("/signup")}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              p: 0,
              minWidth: "auto",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
