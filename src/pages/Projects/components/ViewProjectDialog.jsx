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
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";

export default function ViewProjectDialog({ open, onClose, project }) {
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

  // Format price
  const formatPrice = (price) => {
    if (!price) return "$0.00";
    return `$${price.toFixed(2)}`;
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
            Project Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View project information and client details
          </Typography>
        </Box>

        {/* Content */}
        {project && (
          <Box sx={{ px: 4, pb: 3 }}>
            <Stack spacing={3}>
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
                  {/* Project Name */}
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
                      <FolderIcon
                        fontSize="small"
                        sx={{ color: "text.disabled" }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        Project Name
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600} sx={{ ml: 4 }}>
                      {project.projectName || project.name || "N/A"}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mb: 1, display: "block" }}
                    >
                      Description
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.description || "No description provided"}
                    </Typography>
                  </Box>

                  {/* Price and Date Row */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {/* Price (Admin Only) */}
                    {isAdmin() && (
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
                          <MoneyIcon
                            fontSize="small"
                            sx={{ color: "text.disabled" }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={600}
                          >
                            Price
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="success.main"
                          sx={{ ml: 4 }}
                        >
                          {formatPrice(project.price)}
                        </Typography>
                      </Box>
                    )}

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
                          Created
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{ ml: 4 }}
                      >
                        {formatDate(project.createdAt || project.createdDate)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Artifact Count */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mb: 1, display: "block" }}
                    >
                      Artifact Count
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {project.artifactCount || 0} artifacts
                    </Typography>
                  </Box>
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
                  {/* Client Name */}
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
                        Client Name
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600} sx={{ ml: 4 }}>
                      {project.clientName || "N/A"}
                    </Typography>
                  </Box>

                  {/* Client Email */}
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
                      {project.clientEmail || "N/A"}
                    </Typography>
                  </Box>

                  {/* Client Phone */}
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
                      <PhoneIcon
                        fontSize="small"
                        sx={{ color: "text.disabled" }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        Phone Number
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600} sx={{ ml: 4 }}>
                      {project.clientPhone || "N/A"}
                    </Typography>
                  </Box>
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
                  ℹ️ This is a read-only view. Click "Edit Project" to make
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
