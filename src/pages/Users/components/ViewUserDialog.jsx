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
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";

export default function ViewUserDialog({ open, onClose, user }) {
  const { isAdmin } = useAuth();

  // Format date from backend
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get role label
  const getRoleLabel = (role) => {
    switch (role) {
      case "APP_ADMIN":
        return "Administrator";
      case "APP_USER":
        return "User";
      default:
        return role;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            position: "relative",
            px: 4,
            pt: 4,
            pb: 3,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "text.secondary",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Typography
            variant="h5"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            User Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View user information and role details
          </Typography>
        </Box>

        {/* Content */}
        {user && (
          <Box sx={{ px: 4, pb: 3 }}>
            <Stack spacing={3}>
              {/* User Information */}
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    mb: 2,
                    display: "block",
                  }}
                >
                  User Information
                </Typography>

                <Stack spacing={2.5}>
                  {/* Full Name */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <PersonIcon
                        fontSize="small"
                        sx={{ color: "text.disabled" }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        Full Name
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600} sx={{ ml: 4 }}>
                      {user.fullName || "N/A"}
                    </Typography>
                  </Box>

                  {/* Email */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <EmailIcon
                        fontSize="small"
                        sx={{ color: "text.disabled" }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        Email Address
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600} sx={{ ml: 4 }}>
                      {user.email || "N/A"}
                    </Typography>
                  </Box>

                  {/* Role and Created Date Row */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {/* Role */}
                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <AdminIcon
                          fontSize="small"
                          sx={{ color: "text.disabled" }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Role
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color={
                          user.globalRole === "APP_ADMIN"
                            ? "error.main"
                            : "primary.main"
                        }
                        sx={{ ml: 4 }}
                      >
                        {getRoleLabel(user.globalRole)}
                      </Typography>
                    </Box>

                    {/* Created Date */}
                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <CalendarIcon
                          fontSize="small"
                          sx={{ color: "text.disabled" }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Joined
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{ ml: 4 }}
                      >
                        {formatDate(user.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Cognito Sub (Admin Only) */}
                  {isAdmin() && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <BadgeIcon
                          fontSize="small"
                          sx={{ color: "text.disabled" }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Cognito ID
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          ml: 4,
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                        }}
                      >
                        {user.cognitoSub || "N/A"}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Info Note */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.04),
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize="0.813rem"
                >
                  ℹ️ This is a read-only view. Click "Edit User" to make
                  changes.
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* Footer Actions */}
        <Box
          sx={{
            px: 4,
            py: 3,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: (theme) => alpha(theme.palette.grey[50], 0.5),
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={onClose}
            variant="contained"
            disableElevation
            sx={{
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              minWidth: 120,
            }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
