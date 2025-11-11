import React, { useState, useEffect } from "react";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";

export default function ConfirmSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get email from navigation state (when redirected from login)
    if (location.state?.email) {
      setEmail(location.state.email);
      if (location.state.fromLogin) {
        setMessage(
          "⚠️ Your account is not verified yet. Please enter the verification code sent to your email."
        );
      }
    }
  }, [location]);

  const handleConfirm = async () => {
    if (!email) {
      setMessage("❌ Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: confirmCode,
      });
      setMessage("✅ Account verified successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setMessage("❌ Please enter your email address first");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await resendSignUpCode({
        username: email,
      });
      setMessage("✅ New verification code sent to your email.");
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
        Verify Your Email
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mb: 2.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
      >
        Enter your email and the verification code to complete registration
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        If you closed the signup page before verifying, enter your email and the
        verification code sent to you. If you need a new code, click "Resend
        Code".
      </Alert>

      <TextField
        label="Email Address"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="dense"
        size="small"
        disabled={location.state?.email} // Disable if email came from navigation
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      <TextField
        label="Verification Code"
        fullWidth
        value={confirmCode}
        onChange={(e) => setConfirmCode(e.target.value)}
        margin="dense"
        size="small"
        placeholder="Enter 6-digit code"
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
        onClick={handleConfirm}
        disabled={loading || !email || !confirmCode}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Verify Email"
        )}
      </Button>

      {message && (
        <Typography
          align="center"
          sx={{
            mt: 1.5,
            fontSize: "0.85rem",
            color: message.includes("✅")
              ? "success.main"
              : message.includes("⚠️")
                ? "warning.main"
                : "error.main",
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}

      {/* Resend Code Button */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Didn't receive the code?
        </Typography>
        <Button
          onClick={handleResendCode}
          disabled={loading || !email}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            p: 0.5,
            minWidth: "auto",
          }}
        >
          Resend Code
        </Button>
      </Box>

      {/* Back to Login */}
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
          Remember your password?{" "}
          <Button
            onClick={() => navigate("/login")}
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
            Back to Login
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
