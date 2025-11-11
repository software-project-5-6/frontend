import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { updateUser } from "../../../api/userApi";

export default function EditUserDialog({ open, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    globalRole: "APP_USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        globalRole: user.globalRole || "APP_USER",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateUser(user.id, formData);
      onSave(formData);
      onClose();
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            onClick={handleClose}
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
            Edit User
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update user information and role
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ px: 4, pb: 3 }}>
          <Stack spacing={3}>
            {/* Full Name Field */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <PersonIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="body2" fontWeight={600}>
                  Full Name
                </Typography>
              </Box>
              <TextField
                fullWidth
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Email Field */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <EmailIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="body2" fontWeight={600}>
                  Email Address
                </Typography>
              </Box>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Role Field */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <AdminIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="body2" fontWeight={600}>
                  User Role
                </Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="globalRole"
                  value={formData.globalRole}
                  onChange={handleChange}
                  label="Role"
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="APP_USER">User</MenuItem>
                  <MenuItem value="APP_ADMIN">Administrator</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Error Message */}
            {error && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                }}
              >
                <Typography variant="body2" color="error.main">
                  {error}
                </Typography>
              </Box>
            )}
          </Stack>
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
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
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
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              minWidth: 100,
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
