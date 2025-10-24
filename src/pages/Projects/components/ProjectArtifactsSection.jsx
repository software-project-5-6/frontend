import React from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Button,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import { gradients } from "../../../styles/theme";

// Dummy artifacts data
const dummyArtifacts = [
  {
    id: 1,
    name: "Project Requirements.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "John Smith",
    uploadedDate: "2024-03-15",
  },
  {
    id: 2,
    name: "Design Mockups.fig",
    type: "Figma",
    size: "5.1 MB",
    uploadedBy: "Sarah Johnson",
    uploadedDate: "2024-03-16",
  },
  {
    id: 3,
    name: "Database Schema.sql",
    type: "SQL",
    size: "124 KB",
    uploadedBy: "Mike Wilson",
    uploadedDate: "2024-03-17",
  },
  {
    id: 4,
    name: "API Documentation.docx",
    type: "DOCX",
    size: "876 KB",
    uploadedBy: "Emily Brown",
    uploadedDate: "2024-03-18",
  },
  {
    id: 5,
    name: "Logo Assets.zip",
    type: "ZIP",
    size: "15.8 MB",
    uploadedBy: "David Lee",
    uploadedDate: "2024-03-19",
  },
];

export default function ProjectArtifactsSection({ project }) {
  const handleUpload = () => {
    // TODO: Implement file upload
    console.log("Upload artifact");
  };

  const handleDownload = (artifactId) => {
    // TODO: Implement download
    console.log("Download artifact:", artifactId);
  };

  const handleDelete = (artifactId) => {
    // TODO: Implement delete
    console.log("Delete artifact:", artifactId);
  };

  const getFileTypeColor = (type) => {
    switch (type.toUpperCase()) {
      case "PDF":
        return "error";
      case "FIGMA":
        return "secondary";
      case "SQL":
        return "info";
      case "DOCX":
        return "primary";
      case "ZIP":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          background: gradients.orange,
          color: "white",
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 2,
              p: 1.5,
              display: "flex",
              backdropFilter: "blur(10px)",
            }}
          >
            <DescriptionIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>
              Project Artifacts
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {project.artifactCount} file
              {project.artifactCount !== 1 ? "s" : ""} • Documents & Resources
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={handleUpload}
          sx={{
            bgcolor: "white",
            color: "warning.main",
            fontWeight: 600,
            boxShadow: 2,
            "&:hover": {
              bgcolor: "grey.50",
              boxShadow: 4,
            },
          }}
        >
          Upload File
        </Button>
      </Box>

      {/* Artifacts Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "background.default",
                  borderBottom: 2,
                  borderColor: "divider",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                File Name
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "background.default",
                  borderBottom: 2,
                  borderColor: "divider",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Type
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "background.default",
                  borderBottom: 2,
                  borderColor: "divider",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Size
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "background.default",
                  borderBottom: 2,
                  borderColor: "divider",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Uploaded By
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "background.default",
                  borderBottom: 2,
                  borderColor: "divider",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Date
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  bgcolor: "background.default",
                  borderBottom: 2,
                  borderColor: "divider",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyArtifacts.length > 0 ? (
              dummyArtifacts.map((artifact, index) => (
                <TableRow
                  key={artifact.id}
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                      "& .action-btn": {
                        opacity: 1,
                      },
                    },
                    transition: "background-color 0.2s",
                  }}
                >
                  {/* File Name */}
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          bgcolor: "action.hover",
                          borderRadius: 1.5,
                          p: 1,
                          display: "flex",
                        }}
                      >
                        <FileIcon color="primary" sx={{ fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          {artifact.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Type */}
                  <TableCell align="center">
                    <Chip
                      label={artifact.type}
                      size="small"
                      color={getFileTypeColor(artifact.type)}
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        height: 26,
                        minWidth: 60,
                      }}
                    />
                  </TableCell>

                  {/* Size */}
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {artifact.size}
                    </Typography>
                  </TableCell>

                  {/* Uploaded By */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {artifact.uploadedBy}
                    </Typography>
                  </TableCell>

                  {/* Date */}
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {artifact.uploadedDate}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Download" arrow placement="top">
                        <IconButton
                          className="action-btn"
                          size="small"
                          onClick={() => handleDownload(artifact.id)}
                          sx={{
                            opacity: 0.6,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor: "primary.main",
                              color: "white",
                              opacity: 1,
                            },
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow placement="top">
                        <IconButton
                          className="action-btn"
                          size="small"
                          onClick={() => handleDelete(artifact.id)}
                          sx={{
                            opacity: 0.6,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor: "error.main",
                              color: "white",
                              opacity: 1,
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Box>
                    <DescriptionIcon
                      sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Artifacts Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click "Upload File" to add documents to this project
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
