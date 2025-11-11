import React from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  alpha,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

export default function DeleteUserDialog({ open, onClose, user, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Warning Icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 4,
            pb: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningIcon sx={{ fontSize: 32, color: "error.main" }} />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ px: 4, pb: 3, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Delete User
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to delete this user?
          </Typography>

          {user && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
                textAlign: "left",
              }}
            >
              <Typography variant="body2" fontWeight={600} gutterBottom>
                {user.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
              border: (theme) =>
                `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            }}
          >
            <Typography variant="caption" color="warning.dark">
              ⚠️ This action cannot be undone. All user data will be permanently
              removed.
            </Typography>
          </Box>
        </Box>

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
            variant="outlined"
            sx={{
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 100,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="error"
            sx={{
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 100,
            }}
          >
            Delete
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
