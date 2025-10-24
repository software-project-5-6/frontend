import React, { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Card,
  CircularProgress,
  Box,
} from "@mui/material";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [stage, setStage] = useState("signup"); // "signup" → "confirm"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 🔹 1. Handle Sign Up (Send confirmation code)
  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    // Validate password match
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });
      setStage("confirm");
      setMessage("✅ Verification code sent to your email.");
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 2. Handle Confirmation (verify code)
  const handleConfirm = async () => {
    setLoading(true);
    setMessage("");
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: confirmCode,
      });
      setMessage("✅ Account confirmed! You can now log in.");
      window.location.href = "/login";
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
          Sign Up
        </Typography>

        {stage === "signup" ? (
          <>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              placeholder="Enter your full name"
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              placeholder="Enter password"
              required
            />
            <TextField
              label="Confirm password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              placeholder="Reenter password"
              required
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign up"
              )}
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="Verification Code"
              fullWidth
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Confirm"
              )}
            </Button>
          </>
        )}

        {message && (
          <Typography align="center" mt={2} color="text.secondary">
            {message}
          </Typography>
        )}

        {stage === "signup" && (
          <Typography align="center" mt={3}>
            Already have an account?{" "}
            <Button
              onClick={() => navigate("/login")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Log in
            </Button>
          </Typography>
        )}
      </Card>
    </Box>
  );
}
