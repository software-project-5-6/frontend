import React from "react";
import {
  Dialog,
  DialogContent,
  Button,
  IconButton,
  Typography,
  Box,
  Stack,
  alpha,
  Paper,
  Chip
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

// --- Reusable Component for Data Rows ---
const InfoRow = ({ icon: IconComponent, label, value, isMonospace = false, valueColor = "text.primary" }) => {
  const Icon = IconComponent;
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Icon fontSize="small" sx={{ color: "text.disabled" }} />
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        fontWeight={600}
        color={valueColor}
        sx={{ 
          ml: 4, 
          fontFamily: isMonospace ? 'monospace' : 'inherit',
          wordBreak: 'break-all' 
        }}
      >
        {value || "N/A"}
      </Typography>
    </Paper>
  );
};

export default function ViewUserDialog({ open, onClose, user }) {


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "APP_ADMIN": return "Administrator";
      case "APP_USER": return "User";
      default: return role;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 4, pt: 4, pb: 3, position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 16, top: 16, color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>

        <Stack direction="row" spacing={2.5} alignItems="center">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {user?.fullName || "User Details"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Viewing global system user profile
            </Typography>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ px: 4, py: 2 }}>
        {user && (
          <Box>
            <Stack spacing={2}>
              {/* Name & Role Rows */}
              <InfoRow 
                icon={BadgeIcon} 
                label="FULL NAME" 
                value={user.fullName} 
              />

              <InfoRow 
                icon={EmailIcon} 
                label="EMAIL ADDRESS" 
                value={user.email} 
              />

              <Paper
                elevation={0}
                variant="outlined"
                sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AdminIcon fontSize="small" sx={{ color: "text.disabled" }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    SYSTEM ROLE
                  </Typography>
                </Box>
                <Box sx={{ ml: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={getRoleLabel(user.globalRole)}
                    size="small"
                    color={user.globalRole === "APP_ADMIN" ? "error" : "primary"}
                    sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {user.globalRole === "APP_ADMIN" ? "(Full System Access)" : "(Standard Member)"}
                  </Typography>
                </Box>
              </Paper>

              <InfoRow 
                icon={CalendarIcon} 
                label="ACCOUNT CREATED" 
                value={formatDate(user.createdAt)} 
              />

              {/* Notice Banner */}
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.08), 
                  borderRadius: 2,
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start'
                }}
              >
                <InfoIcon fontSize="small" color="info" sx={{ mt: 0.3 }} />
                <Typography variant="body2" color="text.secondary">
                  This is a read-only view. To update permissions or delete this user, please use the Edit User dialog.
                </Typography>
              </Box>

            </Stack>
          </Box>
        )}
      </DialogContent>

      <Box sx={{ p: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={onClose} sx={{ minWidth: 100, fontWeight: 600 }}>
          Close
        </Button>
      </Box>
    </Dialog>
  );
}
