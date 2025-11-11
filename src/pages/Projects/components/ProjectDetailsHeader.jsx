import React from "react";
import { Box, Typography, IconButton, Button, Tooltip } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { gradients } from "../../../styles/theme";
import { ShowForAdmin } from "../../../components/RoleBasedComponents";

export default function ProjectDetailsHeader({ onBack, onEdit }) {
  return (
    <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <Tooltip title="Back to Projects" arrow>
        <IconButton
          onClick={onBack}
          sx={{
            background: gradients.primary,
            color: "white",
            "&:hover": {
              background: gradients.primary,
              transform: "scale(1.05)",
            },
            transition: "transform 0.2s",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Project Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage project information
        </Typography>
      </Box>
      {/* Edit Button - Admin Only */}
      <ShowForAdmin>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
          sx={{
            background: "#ed6c02",
            "&:hover": {
              background: "#e65100",
            },
          }}
        >
          Edit Project
        </Button>
      </ShowForAdmin>
    </Box>
  );
}
