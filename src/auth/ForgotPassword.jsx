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
    <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
      {stage === "success" ? (
        // 🎉 Success Stage with Animation
        <Fade in={true} timeout={800}>
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Zoom in={true} timeout={600}>
              <CheckCircleIcon
                sx={{
                  fontSize: { xs: 70, sm: 85 },
                  color: "success.main",
                  mb: 2,
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
              variant="h5"
              fontWeight={700}
              color="success.main"
              sx={{ mb: 1.5, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
              Password Reset Successful! 🎉
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5, fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
            >
              Your password has been successfully updated.
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "0.8rem", sm: "0.85rem" } }}
            >
              You will be redirected to the login page in a moment...
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              <CircularProgress size={18} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.85rem" }}
              >
                Redirecting to login...
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/login")}
              sx={{
                mt: 1.5,
                textTransform: "none",
                borderRadius: 2,
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
              }}
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
            fontWeight={700}
            sx={{
              mb: 0.5,
              color: "primary.main",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            {stage === "request" ? "Forgot Password?" : "Reset Password"}
          </Typography>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 2.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            {stage === "request"
              ? "Enter your email to receive a verification code"
              : "Enter the code sent to your email and set a new password"}
          </Typography>

          {/* Message Alert */}
          {message && (
            <Alert
              severity={messageType}
              sx={{
                mb: 2,
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                borderRadius: 2,
              }}
            >
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
                margin="dense"
                size="small"
                required
                autoFocus
                sx={{
                  mb: 1.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
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
                sx={{
                  mt: 1.5,
                  textTransform: "none",
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                }}
                onClick={() => navigate("/login")}
              >
                <ArrowBackIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Back to Login
              </Button>
            </>
          ) : (
            // 🔹 Step 2: Confirm Reset with Code
            <>
              <Alert
                severity="info"
                sx={{
                  mb: 2,
                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  borderRadius: 2,
                }}
              >
                Check your email: <strong>{email}</strong>
              </Alert>

              <TextField
                label="Verification Code"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                margin="dense"
                size="small"
                required
                autoFocus
                sx={{
                  mb: 1.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="dense"
                size="small"
                required
                sx={{
                  mb: 1.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="dense"
                size="small"
                required
                sx={{
                  mb: 0.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  display: "block",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              >
                Password must be at least 8 characters long
              </Typography>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
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
                sx={{
                  mt: 1.5,
                  textTransform: "none",
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                }}
                onClick={handleBackToRequest}
              >
                <ArrowBackIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Back to Email Entry
              </Button>
            </>
          )}

          {/* Link to Signup */}
          {stage === "request" && (
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
          )}
        </>
      )}
    </Box>
  );
}
