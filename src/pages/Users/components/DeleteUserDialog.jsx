import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  alpha,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  WarningAmber as WarningIcon,
  DeleteForever as DeleteIcon,
} from "@mui/icons-material";

export default function DeleteUserDialog({ open, onClose, user, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Wrapper to handle loading state
  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(); // Waits for the API call to finish
      // Dialog usually closes via parent state, so we don't manually close here
    } catch (error) {
      console.error("Delete failed", error);
      setIsDeleting(false); // Only stop loading if it failed
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!isDeleting ? onClose : undefined} // Prevent closing while deleting
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          overflow: "hidden", // Keeps the clean look
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* 1. Big Warning Header */}
        <Box
          sx={{
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            py: 4,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: (theme) => alpha(theme.palette.error.main, 0.1),
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <WarningIcon sx={{ fontSize: 40, color: "error.main" }} />
          </Box>
          <Box sx={{ textAlign: "center", px: 3 }}>
            <Typography variant="h6" fontWeight={800} color="text.primary">
              Delete User?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              You are about to permanently delete this account.
            </Typography>
          </Box>
        </Box>

        {/* 2. User Preview Card */}
        <Box sx={{ px: 3, py: 3 }}>
          {user && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "background.paper",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.light",
                  color: "primary.main",
                  fontWeight: 700,
                }}
              >
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  {user.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          )}

          {/* 3. Consequence Warning */}
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.05),
              color: "error.dark",
              display: "flex",
              gap: 1.5,
              alignItems: "start",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{ lineHeight: 1.5 }}
            >
              ⚠️ Warning: This action cannot be undone. All associated data
              (projects, files, logs) will be removed immediately.
            </Typography>
          </Box>
        </Box>

        {/* 4. Footer Actions */}
        <Box
          sx={{
            p: 3,
            bgcolor: "grey.50",
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between", // Spaced out for safety
            gap: 2,
          }}
        >
          <Button
            onClick={onClose}
            disabled={isDeleting}
            color="inherit"
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting}
            startIcon={
              isDeleting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
            sx={{
              fontWeight: 700,
              px: 3,
              boxShadow: (theme) =>
                `0 8px 16px ${alpha(theme.palette.error.main, 0.24)}`,
            }}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete User"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
