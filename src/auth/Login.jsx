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
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
      }}
    >
      <Card sx={{ p: 4, maxWidth: 400, width: "100%", boxShadow: 3 }}>
        <Typography variant="h5" align="center" mb={2}>
          Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        {message && (
          <Typography align="center" mt={2} color="text.secondary">
            {message}
          </Typography>
        )}

        {/* Forgot Password Link */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={() => navigate("/forgot-password")}
            sx={{ textTransform: "none", fontSize: "0.875rem" }}
          >
            Forgot Password?
          </Button>
        </Box>

        <Typography align="center" mt={2}>
          Don't have an account?{" "}
          <Button
            onClick={() => navigate("/signup")}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Sign up
          </Button>
        </Typography>
      </Card>
    </Box>
  );
}
