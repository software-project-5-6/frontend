import React, { useState } from "react";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Card,
  CircularProgress,
  Box,
  Alert,
  Fade,
  Zoom,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { gradients } from "../styles/theme";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState("request"); // "request" → "reset" → "success"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "success", "error", "info"
  const navigate = useNavigate();

  // 🔹 Step 1: Request password reset code
  const handleRequestReset = async () => {
    setLoading(true);
    setMessage("");

    if (!email) {
      setMessage("Please enter your email address");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ username: email });
      setStage("reset");
      setMessage("✅ Verification code sent to your email!");
      setMessageType("success");
    } catch (error) {
      setMessage("❌ " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2: Confirm reset with code and new password
  const handleConfirmReset = async () => {
    setLoading(true);
    setMessage("");

    // Validation
    if (!code || !newPassword || !confirmPassword) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });

      // Show success stage with animation
      setStage("success");
      setMessageType("success");

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setMessage("❌ " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRequest = () => {
    setStage("request");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: gradients.primary,
        p: 2,
      }}
    >
      <Card sx={{ p: 4, maxWidth: 450, width: "100%", boxShadow: 6 }}>
        {stage === "success" ? (
          // 🎉 Success Stage with Animation
          <Fade in={true} timeout={800}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Zoom in={true} timeout={600}>
                <CheckCircleIcon
                  sx={{
                    fontSize: 100,
                    color: "success.main",
                    mb: 3,
                    animation: "pulse 1.5s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%": {
                        transform: "scale(1)",
                      },
                      "50%": {
                        transform: "scale(1.1)",
                      },
                      "100%": {
                        transform: "scale(1)",
                      },
                    },
                  }}
                />
              </Zoom>

              <Typography
                variant="h4"
                fontWeight={700}
                color="success.main"
                mb={2}
              >
                Password Reset Successful! 🎉
              </Typography>

              <Typography variant="body1" color="text.secondary" mb={1}>
                Your password has been successfully updated.
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={4}>
                You will be redirected to the login page in a moment...
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Redirecting to login...
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{ mt: 2 }}
              >
                Go to Login Now
              </Button>
            </Box>
          </Fade>
        ) : (
          <>
            <Typography
              variant="h5"
              align="center"
              mb={1}
              fontWeight={700}
              color="primary"
            >
              {stage === "request" ? "Forgot Password?" : "Reset Password"}
            </Typography>

            <Typography
              variant="body2"
              align="center"
              mb={3}
              color="text.secondary"
            >
              {stage === "request"
                ? "Enter your email to receive a verification code"
                : "Enter the code sent to your email and set a new password"}
            </Typography>

            {/* Message Alert */}
            {message && (
              <Alert severity={messageType} sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            {stage === "request" ? (
              // 🔹 Step 1: Request Reset Code
              <>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  placeholder="Enter your email"
                  required
                  autoFocus
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2, py: 1.5 }}
                  onClick={handleRequestReset}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/login")}
                >
                  <ArrowBackIcon sx={{ mr: 1, fontSize: 18 }} />
                  Back to Login
                </Button>
              </>
            ) : (
              // 🔹 Step 2: Confirm Reset with Code
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Check your email: <strong>{email}</strong>
                </Alert>

                <TextField
                  label="Verification Code"
                  fullWidth
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  margin="normal"
                  placeholder="Enter 6-digit code"
                  required
                  autoFocus
                />

                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  placeholder="Enter new password"
                  required
                />

                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  placeholder="Confirm new password"
                  required
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Password must be at least 8 characters long
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 3, py: 1.5 }}
                  onClick={handleConfirmReset}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  sx={{ mt: 2 }}
                  onClick={handleBackToRequest}
                >
                  <ArrowBackIcon sx={{ mr: 1, fontSize: 18 }} />
                  Back to Email Entry
                </Button>
              </>
            )}

            {/* Link to Signup */}
            {stage === "request" && (
              <Typography align="center" mt={3} variant="body2">
                Don't have an account?{" "}
                <Button
                  onClick={() => navigate("/signup")}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Sign up
                </Button>
              </Typography>
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
