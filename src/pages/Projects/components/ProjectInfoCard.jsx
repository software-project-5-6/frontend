import React from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Chip,
  Divider,
  CardContent,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { gradients } from "../../../styles/theme";

export default function ProjectInfoCard({ project, getStatusColor }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      {/* Card Header - More compact and elegant */}
      <Box
        sx={{
          background: gradients.primary,
          color: "white",
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 2,
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FolderIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="overline"
              sx={{ opacity: 0.8, fontSize: "0.7rem" }}
            >
              Project Name
            </Typography>
            <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>
              {project.name}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={project.status}
          size="small"
          sx={{
            bgcolor: "white",
            color: "primary.main",
            fontWeight: 700,
            fontSize: "0.75rem",
            height: 28,
          }}
        />
      </Box>

      {/* Card Content - Better organized */}
      <CardContent sx={{ p: 3 }}>
        {/* Description Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            color="primary.main"
            fontWeight={600}
            gutterBottom
            sx={{ mb: 1.5 }}
          >
            PROJECT DESCRIPTION
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
              bgcolor: "action.hover",
              p: 2,
              borderRadius: 2,
              borderLeft: "3px solid",
              borderColor: "primary.main",
            }}
          >
            {project.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Client Information Section */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            color="primary.main"
            fontWeight={600}
            gutterBottom
            sx={{ mb: 2 }}
          >
            CLIENT INFORMATION
          </Typography>
          <Grid container spacing={2.5}>
            {/* Client Email */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: 1,
                  },
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
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      borderRadius: 1,
                      p: 0.75,
                      display: "flex",
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    textTransform="uppercase"
                  >
                    Email Address
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600} sx={{ ml: 4.5 }}>
                  {project.clientEmail}
                </Typography>
              </Box>
            </Grid>

            {/* Client Phone */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: 1,
                  },
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
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      borderRadius: 1,
                      p: 0.75,
                      display: "flex",
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    textTransform="uppercase"
                  >
                    Phone Number
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600} sx={{ ml: 4.5 }}>
                  {project.clientPhone}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Project Metadata */}
        <Box>
          <Typography
            variant="subtitle2"
            color="primary.main"
            fontWeight={600}
            gutterBottom
            sx={{ mb: 2 }}
          >
            PROJECT METADATA
          </Typography>
          <Grid container spacing={2.5}>
            {/* Created Date */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: "success.light",
                    color: "success.dark",
                    borderRadius: 1.5,
                    p: 1,
                    display: "flex",
                  }}
                >
                  <CalendarIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Created Date
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {project.createdDate}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Project Price */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: "info.light",
                    color: "info.dark",
                    borderRadius: 1.5,
                    p: 1,
                    display: "flex",
                  }}
                >
                  <MoneyIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Project Budget
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="info.main"
                  >
                    {project.price || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: "warning.light",
                    color: "warning.dark",
                    borderRadius: 1.5,
                    p: 1,
                    display: "flex",
                  }}
                >
                  <AssessmentIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Project Status
                  </Typography>
                  <Chip
                    label={project.status}
                    size="small"
                    color={getStatusColor(project.status)}
                    sx={{ fontWeight: 700, height: 24 }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Paper>
  );
}
