import React from "react";
import { Grid, Card, CardContent, Box, Typography } from "@mui/material";
import {
  Folder as FolderIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { gradients } from "../../../styles/theme";

export default function ProjectStatsCards({ project }) {
  return (
    <Grid container spacing={2.5}>
      {/* Artifacts Count */}
      <Grid item xs={12}>
        <Card
          elevation={0}
          sx={{
            background: gradients.blue,
            color: "white",
            borderRadius: 3,
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "150px",
              height: "150px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
              transform: "translate(50%, -50%)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  p: 1.5,
                  display: "flex",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FolderIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                variant="overline"
                sx={{
                  opacity: 0.9,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                Total Artifacts
              </Typography>
            </Box>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                fontSize: { xs: "2.5rem", sm: "3rem" },
                lineHeight: 1,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {project.artifactCount}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                opacity: 0.8,
                fontSize: "0.85rem",
              }}
            >
              Files & Documents
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Users Count */}
      <Grid item xs={12}>
        <Card
          elevation={0}
          sx={{
            background: gradients.pink,
            color: "white",
            borderRadius: 3,
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "150px",
              height: "150px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
              transform: "translate(50%, -50%)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  p: 1.5,
                  display: "flex",
                  backdropFilter: "blur(10px)",
                }}
              >
                <PeopleIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                variant="overline"
                sx={{
                  opacity: 0.9,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                Team Members
              </Typography>
            </Box>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                fontSize: { xs: "2.5rem", sm: "3rem" },
                lineHeight: 1,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {project.assignedUsers?.length || 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                opacity: 0.8,
                fontSize: "0.85rem",
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
