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
import { useAuth } from "../../../context/AuthContext";

// --- NEW: Reusable Component for Data Rows ---
const InfoRow = ({ icon: Icon, label, value, isMonospace = false, valueColor = "text.primary" }) => (
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

export default function ViewUserDialog({ open, onClose, user }) {
  const { isAdmin } = useAuth();

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
        <Typography variant="h5" fontWeight={700} gutterBottom>
          User Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View system information and role permissions
        </Typography>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {user && (
          <Box sx={{ px: 4, pb: 4 }}>
            <Stack spacing={3}>
              
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>
                Profile Information
              </Typography>

              <Stack spacing={2}>
                <InfoRow 
                  icon={PersonIcon} 
                  label="FULL NAME" 
                  value={user.fullName} 
                />
                
                <InfoRow 
                  icon={EmailIcon} 
                  label="EMAIL ADDRESS" 
                  value={user.email} 
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Box flex={1}>
                    <InfoRow 
                      icon={AdminIcon} 
                      label="ROLE" 
                      value={getRoleLabel(user.globalRole)}
                      valueColor={user.globalRole === "APP_ADMIN" ? "error.main" : "primary.main"}
                    />
                  </Box>
                  <Box flex={1}>
                    <InfoRow 
                      icon={CalendarIcon} 
                      label="JOINED DATE" 
                      value={formatDate(user.createdAt)} 
                    />
                  </Box>
                </Stack>

                {isAdmin() && (
                  <InfoRow 
                    icon={BadgeIcon} 
                    label="COGNITO ID" 
                    value={user.cognitoSub}
                    isMonospace 
                  />
                )}
              </Stack>

              {/* Info Banner */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.05),
                  border: '1px solid',
                  borderColor: (theme) => alpha(theme.palette.info.main, 0.2),
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