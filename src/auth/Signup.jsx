import { useState } from "react";
import { signUp, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
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
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      // Check if user already exists but not confirmed
      if (error.name === "UsernameExistsException") {
        setMessage(
          "⚠️ This email is already registered. If you haven't verified, you can resend the code below."
        );
        setStage("confirm");
      } else {
        setMessage("❌ " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Resend Code
  const handleResendCode = async () => {
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

  //Handle Confirmation (verify code)
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
        {stage === "signup" ? "Create Account" : "Verify Email"}
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mb: 2.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
      >
        {stage === "signup"
          ? "Sign up to get started with PSMS"
          : "Enter the verification code sent to your email"}
      </Typography>

      {stage === "signup" ? (
        <>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="dense"
            size="small"
            required
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
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="dense"
            size="small"
            required
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
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>
        </>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            We've sent a verification code to <strong>{email}</strong>. Check
            your email (including spam folder) and enter the code below.
          </Alert>

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
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Verify Email"
            )}
          </Button>

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
              disabled={loading}
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

          {/* Back to Signup Button */}
          <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => setStage("signup")}
              sx={{
                textTransform: "none",
                fontSize: "0.875rem",
                color: "text.secondary",
              }}
            >
              Back to Sign Up
            </Button>
          </Box>
        </>
      )}

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

      {stage === "signup" && (
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
            Already have an account?{" "}
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
              Log In
            </Button>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
