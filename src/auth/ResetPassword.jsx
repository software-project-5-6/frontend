import React, { useState, useEffect } from "react";
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
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [stage, setStage] = useState("form"); // "form" | "success"
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase redirects back with tokens in the URL hash.
    // getSession() picks them up automatically after the client initialises.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      } else {
        setMessage("Invalid or expired reset link. Please request a new one.");
        setMessageType("error");
      }
    });
  }, []);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in both fields.");
      setMessageType("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setLoading(false);

    if (error) {
      setMessage("❌ " + error.message);
      setMessageType("error");
    } else {
      setStage("success");
      setTimeout(() => { navigate("/login"); }, 3000);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
      {stage === "success" ? (
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
              Password Updated!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your password has been changed. Redirecting to login...
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, mb: 2 }}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Redirecting...
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/login")}
              sx={{ textTransform: "none", borderRadius: 2 }}
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
            sx={{ mb: 0.5, color: "primary.main", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Set New Password
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 2.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            Enter and confirm your new password
          </Typography>

          {message && (
            <Alert severity={messageType} sx={{ mb: 2, borderRadius: 2 }}>
              {message}
            </Alert>
          )}

          {sessionReady && (
            <>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="dense"
                size="small"
                required
                autoFocus
                sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReset()}
                margin="dense"
                size="small"
                required
                sx={{ mb: 0.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 2, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
              >
                Password must be at least 8 characters long
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  boxShadow: 2,
                  "&:hover": { boxShadow: 4 },
                }}
                onClick={handleReset}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
              </Button>
            </>
          )}

          {!sessionReady && !message && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
