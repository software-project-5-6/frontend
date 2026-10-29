import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  FormHelperText,
  useTheme,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  SupportAgent as SupportIcon,
  CheckCircle as SuccessIcon,
  Send as SendIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  ConfirmationNumber as TicketIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { submitSupportRequest } from "../api/supportApi";
import { BRANDING } from "../config/branding";

const CATEGORIES = [
  { value: "Technical Issue", label: "Technical Issue" },
  { value: "Account & Login", label: "Account & Login" },
  { value: "Projects", label: "Projects" },
  { value: "AI Assistant", label: "AI Assistant" },
  { value: "Feature Request", label: "Feature Request" },
  { value: "Other", label: "Other" },
];

export default function ContactSupportDialog({ open, onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user, dbUser, userAttributes } = useAuth();

  // Initial user identity values
  const defaultName =
    dbUser?.fullName ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    userAttributes?.name ||
    "";
  const defaultEmail =
    user?.email || dbUser?.email || userAttributes?.email || "";

  // Form states
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [category, setCategory] = useState("Technical Issue");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Validation & feedback
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Sync user profile when dialog opens or auth context changes
  useEffect(() => {
    if (open) {
      setName((prev) => prev || defaultName);
      setEmail((prev) => prev || defaultEmail);
      setErrorMessage("");
    }
  }, [open, defaultName, defaultEmail]);

  const handleClose = () => {
    if (loading) return; // Prevent closing mid-request
    setErrorMessage("");
    if (successData) {
      // If closing after success, reset form for next time
      setSuccessData(null);
      setSubject("");
      setMessage("");
      setCategory("Technical Issue");
      setErrors({});
    }
    onClose();
  };

  const validate = () => {
    const newErrors = {};

    if (!category.trim()) {
      newErrors.category = "Please select an issue category.";
    }

    if (!subject.trim()) {
      newErrors.subject = "Subject is required.";
    } else if (subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters.";
    } else if (subject.length > 150) {
      newErrors.subject = "Subject cannot exceed 150 characters.";
    }

    if (!message.trim()) {
      newErrors.message = "Detailed description is required.";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    } else if (message.length > 3000) {
      newErrors.message = "Message cannot exceed 3000 characters.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setErrorMessage("");
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await submitSupportRequest({
        category,
        subject: subject.trim(),
        message: message.trim(),
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      });

      if (response && response.success) {
        setSuccessData(response);
        setErrors({});
      } else {
        throw new Error(
          response?.message ||
            "Unable to deliver your support request. Please try again."
        );
      }
    } catch (err) {
      console.error("[ContactSupportDialog] Submission failed:", err);
      setSuccessData(null);
      setErrorMessage(
        err.message ||
          "We were unable to deliver your support request at this time. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetForAnotherTicket = () => {
    setSuccessData(null);
    setSubject("");
    setMessage("");
    setCategory("Technical Issue");
    setErrorMessage("");
    setErrors({});
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="contact-support-dialog-title"
      PaperProps={{
        elevation: 12,
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
        },
      }}
    >
      {/* DIALOG HEADER */}
      <DialogTitle
        id="contact-support-dialog-title"
        sx={{
          p: 0,
          background: "linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)",
          color: "white",
          position: "relative",
        }}
      >
        <Box
          sx={{
            p: { xs: 2.5, sm: 3 },
            display: "flex",
            alignItems: "flex-start",
            pr: 6,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(4px)",
              mr: 2,
              flexShrink: 0,
            }}
          >
            <SupportIcon sx={{ color: "white", fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                color: "white",
                letterSpacing: "0.2px",
                lineHeight: 1.3,
              }}
            >
              Contact Majstro Support
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                mt: 0.5,
              }}
            >
              We're here to help you with {BRANDING.appName}.
            </Typography>
          </Box>
        </Box>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={loading}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* DIALOG BODY */}
      <DialogContent
        dividers
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }}
      >
        {successData ? (
          /* SUCCESS VIEW */
          <Box
            sx={{
              py: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "rgba(46, 125, 50, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <SuccessIcon sx={{ color: "success.main", fontSize: 40 }} />
            </Box>

            <Typography variant="h6" fontWeight={700} gutterBottom>
              Support Request Submitted!
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 440, mb: 3 }}
            >
              Thank you for contacting us. Your ticket has been recorded by our
              support team and delivered to our engineers. We will review your
              inquiry and respond to{" "}
              <strong>{email || user?.email || "your account email"}</strong>{" "}
              shortly.
            </Typography>

            {successData.ticketId && (
              <Chip
                icon={<TicketIcon fontSize="small" />}
                label={`Reference: ${successData.ticketId}`}
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  py: 1,
                  px: 0.5,
                  mb: 2,
                }}
              />
            )}
          </Box>
        ) : (
          /* FORM VIEW */
          <Box
            component="form"
            id="support-request-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {errorMessage && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  "& .MuiAlert-message": { fontSize: "0.875rem" },
                }}
                onClose={() => setErrorMessage("")}
              >
                {errorMessage}
              </Alert>
            )}

            {/* User Info Row */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                mb: 2,
              }}
            >
              <TextField
                label="Your Name"
                fullWidth
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <PersonIcon
                      fontSize="small"
                      sx={{ color: "text.secondary", mr: 1 }}
                    />
                  ),
                }}
                helperText="Pre-filled from your profile"
              />

              <TextField
                label="Contact Email"
                fullWidth
                size="small"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email || "Replies will be sent here"}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <EmailIcon
                      fontSize="small"
                      sx={{ color: "text.secondary", mr: 1 }}
                    />
                  ),
                }}
              />
            </Box>

            {/* Issue Category */}
            <FormControl
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              error={Boolean(errors.category)}
              required
            >
              <InputLabel id="support-category-label">Issue Category</InputLabel>
              <Select
                labelId="support-category-label"
                id="support-category"
                value={category}
                label="Issue Category *"
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>

            {/* Subject */}
            <TextField
              label="Subject"
              required
              fullWidth
              size="small"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              error={Boolean(errors.subject)}
              helperText={
                errors.subject || `${subject.length}/150 characters`
              }
              placeholder="Brief summary of your issue or request"
              disabled={loading}
              inputProps={{ maxLength: 150 }}
              sx={{ mb: 2 }}
            />

            {/* Message / Description */}
            <TextField
              label="Detailed Description"
              required
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={Boolean(errors.message)}
              helperText={
                errors.message ||
                `${message.length}/3000 characters • Please describe the issue and steps to reproduce`
              }
              placeholder="What happened? Include any relevant project names, error messages, or details that can help us resolve your issue quickly."
              disabled={loading}
              inputProps={{ maxLength: 3000 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.9rem",
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      {/* DIALOG ACTIONS */}
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 2,
          backgroundColor: isDark ? "rgba(0,0,0,0.15)" : "#f8fafc",
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }}
      >
        {successData ? (
          <>
            <Button
              variant="text"
              color="inherit"
              onClick={handleResetForAnotherTicket}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Submit Another Request
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClose}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                borderRadius: 2,
              }}
            >
              Done
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleClose}
              disabled={loading}
              color="inherit"
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="support-request-form"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SendIcon fontSize="small" />
                )
              }
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                borderRadius: 2,
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              {loading ? "Sending Request..." : "Send Support Request"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
