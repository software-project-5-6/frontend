import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  IconButton,
  Typography,
  TextField,
  Box,
  Stack,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { updateProject } from "../../../api/projectApi";

export default function EditProjectDialog({
  open,
  onClose,
  project,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    iconUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Update form data whenever project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.projectName || project.name || "",
        description: project.description || "",
        clientName: project.clientName || "",
        clientEmail: project.clientEmail || "",
        clientPhone: project.clientPhone || "",
        iconUrl: project.iconUrl || "",
      });
    }
  }, [project]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError("");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.clientName?.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!formData.clientEmail?.trim()) {
      newErrors.clientEmail = "Client email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Invalid email format";
    }

    if (!formData.clientPhone?.trim()) {
      newErrors.clientPhone = "Client phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    setApiError("");

    const projectData = {
      projectName: formData.name,
      description: formData.description,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      iconUrl: formData.iconUrl,
      artifactCount: project?.artifactCount || 0,
      userRoleList: project?.userRoleList || [],
    };

    try {
      const response = await updateProject(
        project.projectId || project.id,
        projectData,
      );
      console.log("Project updated successfully:", response);

      // Call the onUpdate callback if provided and wait for it to complete
      if (onUpdate) {
        await onUpdate(response);
      }

      onClose();
    } catch (error) {
      console.error("Failed to update project:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with error
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to update project. Please try again.";
        setApiError(errorMessage);
      } else if (error.request) {
        // Request made but no response
        setApiError("No response from server. Please check your connection.");
      } else {
        // Something else happened
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setApiError("");
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
            Edit Project
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your project details and client information
          </Typography>
        </Box>

        {/* Form */}
        <Box sx={{ px: 4, pb: 3 }}>
          <Stack spacing={3}>
            {/* API Error Alert */}
            {apiError && (
              <Alert
                severity="error"
                onClose={() => setApiError("")}
                sx={{ borderRadius: 2 }}
              >
                {apiError}
              </Alert>
            )}

            {/* Project Details */}
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
                Project Details
              </Typography>

              <Stack spacing={2.5}>
                <TextField
                  label="Project Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange("name")}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  placeholder="Enter project name"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.paper",
                    },
                  }}
                />

                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange("description")}
                  placeholder="Brief project description (optional)"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.paper",
                    },
                  }}
                />

                <TextField
                  label="Project Icon URL"
                  fullWidth
                  value={formData.iconUrl}
                  onChange={handleChange("iconUrl")}
                  placeholder="https://..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <ImageIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "text.disabled" }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.paper",
                    },
                  }}
                />
              </Stack>
            </Box>

            {/* Client Information */}
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
                Client Information
              </Typography>

              <Stack spacing={2.5}>
                <TextField
                  label="Client Name"
                  fullWidth
                  value={formData.clientName}
                  onChange={handleChange("clientName")}
                  error={!!errors.clientName}
                  helperText={errors.clientName}
                  required
                  placeholder="Client or company name"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <PersonIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "text.disabled" }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.paper",
                    },
                  }}
                />

                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.clientEmail}
                  onChange={handleChange("clientEmail")}
                  error={!!errors.clientEmail}
                  helperText={errors.clientEmail}
                  required
                  placeholder="client@example.com"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <EmailIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "text.disabled" }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.paper",
                    },
                  }}
                />

                <TextField
                  label="Phone"
                  fullWidth
                  value={formData.clientPhone}
                  onChange={handleChange("clientPhone")}
                  error={!!errors.clientPhone}
                  helperText={errors.clientPhone}
                  required
                  placeholder="+1 (234) 567-8900"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "text.disabled" }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.paper",
                    },
                  }}
                />
              </Stack>
            </Box>
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
            color="inherit"
            disabled={loading}
            sx={{
              px: 3,
              textTransform: "none",
              fontWeight: 500,
              borderColor: "divider",
              color: "text.secondary",
              "&:hover": {
                borderColor: "text.secondary",
                bgcolor: "action.hover",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disableElevation
            disabled={loading}
            sx={{
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "warning.main",
              color: "white",
              "&:hover": {
                bgcolor: "warning.dark",
              },
              minWidth: 140,
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
