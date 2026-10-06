import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Fade,
  Zoom,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("request"); // "request" → "sent"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const navigate = useNavigate();

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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setMessage("❌ " + error.message);
        setMessageType("error");
      } else {
        setStage("sent");
      }
    } catch (error) {
      setMessage("❌ " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
      {stage === "sent" ? (
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
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" },
                    "100%": { transform: "scale(1)" },
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
              Check Your Email
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5, fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
            >
              We sent a password reset link to:
            </Typography>
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ mb: 2, wordBreak: "break-all" }}
            >
              {email}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "0.8rem", sm: "0.85rem" } }}
            >
              Click the link in the email to set your new password. Check your
              spam folder if you don't see it.
            </Typography>

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
              Back to Login
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
            Forgot Password?
          </Typography>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 2.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            Enter your email and we'll send you a reset link
          </Typography>

          {message && (
            <Alert
              severity={messageType}
              sx={{ mb: 2, fontSize: { xs: "0.8rem", sm: "0.85rem" }, borderRadius: 2 }}
            >
              {message}
            </Alert>
          )}

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRequestReset()}
            margin="dense"
            size="small"
            required
            autoFocus
            sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
              "&:hover": { boxShadow: 4 },
            }}
            onClick={handleRequestReset}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <Button
            fullWidth
            variant="text"
            sx={{ mt: 1.5, textTransform: "none", fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
            onClick={() => navigate("/login")}
          >
            <ArrowBackIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Back to Login
          </Button>

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
                  "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
