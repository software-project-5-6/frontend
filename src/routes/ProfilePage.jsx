import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
  Divider,
  Grid,
  useTheme,
  CircularProgress
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

// Adjust this path if your theme is located elsewhere
import { gradients } from "../styles/theme";
import { useAuth } from "../context/AuthContext";

// Reusable Component for Data Rows
const InfoRow = ({ icon: Icon, label, value, valueColor = "text.primary" }) => (
  <Paper
    elevation={0}
    variant="outlined"
    sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, height: "100%" }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Icon fontSize="small" sx={{ color: "text.disabled" }} />
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        {label}
      </Typography>
    </Box>
    <Typography
      variant="body1"
      fontWeight={600}
      color={valueColor}
      sx={{ ml: 4, wordBreak: "break-all" }}
    >
      {value || "N/A"}
    </Typography>
  </Paper>
);

export default function ProfilePage() {
  const theme = useTheme();
  
  // 1. Grab everything we need globally from AuthContext!
  const { dbUser, userAttributes, userRole, loading, authTime } = useAuth(); 

  // Helper functions for UI
  const getInitials = (name) => {
    if (!name || name === "Unknown User") return "UU";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "APP_ADMIN": return "Administrator";
      case "APP_USER": return "User";
      default: return role || "User";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  // UI: Global Context Loading State
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // 2. The Smart Fallback Logic
  const displayName = dbUser?.fullName || userAttributes?.name || "Unknown User";
  const displayEmail = dbUser?.email || userAttributes?.email || "No email";
  const displayRole = dbUser?.globalRole || userRole || "APP_USER";
  
  // Explicitly check for dbUser.createdAt, then fallback to authTime
  const displayDate = dbUser?.createdAt ? dbUser.createdAt : authTime;
  const dateLabel = dbUser?.createdAt ? "MEMBER SINCE" : "LAST LOGIN";

  // UI: Success State
  return (
    <Container maxWidth="md" sx={{ py: 1 }}>
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View your personal information and account details
        </Typography>
      </Box>

      {/* Main Profile Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        {/* Banner / Top Section */}
        <Box
          sx={{
            background: gradients?.primary || theme.palette.primary.main,
            height: 80,
            position: "relative",
          }}
        />

        <Box sx={{ px: 4, pb: 4, pt: 0, position: "relative" }}>
          {/* Avatar Row */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mt: -6, mb: 1 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#bcd1f4",
                color: "primary.dark",
                border: "4px solid",
                borderColor: "background.paper",
                fontSize: "2.5rem",
                fontWeight: 700,
              }}
            >
              {getInitials(displayName)}
            </Avatar>
          </Box>

          {/* User Name & Quick Badges */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              {displayName}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                <EmailIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">{displayEmail}</Typography>
              </Box>
              <Typography color="text.disabled">•</Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                color={displayRole === "APP_ADMIN" ? "error.main" : "primary.main"}
              >
                {getRoleLabel(displayRole)}
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Detailed Information Grid */}
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ letterSpacing: 1, textTransform: "uppercase", display: "block", mb: 2 }}
          >
            Account Details
          </Typography>

          <Grid container spacing={2}>
            {/* MUI v6 syntax used here -> size={{ xs: 12, sm: 6 }} */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <InfoRow icon={PersonIcon} label="FULL NAME" value={displayName} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InfoRow icon={EmailIcon} label="EMAIL ADDRESS" value={displayEmail} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InfoRow
                icon={AdminIcon}
                label="ACCOUNT ROLE"
                value={getRoleLabel(displayRole)}
                valueColor={displayRole === "APP_ADMIN" ? "error.main" : "primary.main"}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {/* Smart label updates depending on which date we are showing! */}
              <InfoRow icon={CalendarIcon} label={dateLabel} value={formatDate(displayDate)} />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}