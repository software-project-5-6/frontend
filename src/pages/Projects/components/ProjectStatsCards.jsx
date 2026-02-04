import React from "react";
import { Grid, Card, CardContent, Box, Typography } from "@mui/material";
import {
  Folder as FolderIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { gradients } from "../../../styles/theme";

export default function ProjectStatsCards({ project }) {
  return (
    <Grid container spacing={2}>
      {/* Artifacts Count */}
      <Grid item xs={12} sm={6}>
        <Card
          elevation={0}
          sx={{
            background: gradients.blue,
            color: "white",
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
            },
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  borderRadius: 1.5,
                  p: 1,
                  display: "flex",
                }}
              >
                <FolderIcon sx={{ fontSize: 24 }} />
              </Box>
              <Typography
                variant="overline"
                sx={{
                  opacity: 0.9,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                Total Artifacts
              </Typography>
            </Box>
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem" },
                lineHeight: 1,
              }}
            >
              {project.artifactCount || 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                opacity: 0.8,
                fontSize: "0.75rem",
              }}
            >
              Files & Documents
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Users Count */}
      <Grid item xs={12} sm={6}>
        <Card
          elevation={0}
          sx={{
            background: gradients.pink,
            color: "white",
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
            },
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  borderRadius: 1.5,
                  p: 1,
                  display: "flex",
                }}
              >
                <PeopleIcon sx={{ fontSize: 24 }} />
              </Box>
              <Typography
                variant="overline"
                sx={{
                  opacity: 0.9,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                Team Members
              </Typography>
            </Box>
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem" },
                lineHeight: 1,
              }}
            >
              {project.assignedUsers?.length || 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                opacity: 0.8,
                fontSize: "0.75rem",
              }}
            >
              Active Collaborators
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
