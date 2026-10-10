import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get email from navigation state (when redirected from login)
    if (location.state?.email) {
      setEmail(location.state.email);
      if (location.state.fromLogin) {
        setMessage(
          "⚠️ Your account is not verified yet. Please check your email for the confirmation link."
        );
      }
    }
  }, [location]);

  const handleResendLink = async () => {
    if (!email) {
      setMessage("❌ Please enter your email address first");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) {
        setMessage("❌ " + error.message);
      } else {
        setMessage("✅ A new confirmation link has been sent to your email.");
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
        Verify Your Email
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mb: 2.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
      >
        Click the confirmation link we sent you to activate your account
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        We sent a <strong>confirmation link</strong> to your email when you
        signed up. Click that link to verify your account, then come back and
        log in. If you can't find it, enter your email below and resend it.
      </Alert>

      <TextField
        label="Email Address"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="dense"
        size="small"
        disabled={!!location.state?.email} // Disable if email came from navigation
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
        onClick={handleResendLink}
        disabled={loading || !email}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Resend Confirmation Link"
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
          Already verified?{" "}
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
