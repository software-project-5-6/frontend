
import React, { useEffect, useState } from "react";
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
  TextField,
} from "@mui/material";

import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";

import { gradients } from "../../../styles/theme";

import {
  fetchArtifacts,
  downloadArtifact,
  deleteArtifact,
} from "../../../api/artifactApi";

import ArtifactUploadModal from "./ArtifactUploadModal";

export default function ProjectArtifactsSection({
  project,
  username,
  onArtifactChange,
}) {
  const [artifacts, setArtifacts] = useState([]);
  const [search, setSearch] = useState("");
  const [openUpload, setOpenUpload] = useState(false);

  // Load artifacts from backend
  useEffect(() => {
    loadArtifacts();
  }, []);

  const loadArtifacts = async () => {
    try {
      const data = await fetchArtifacts(project.id);
      setArtifacts(data);
    } catch (e) {
      console.error("Error loading artifacts:", e);
    }
  };

  const openModal = () => setOpenUpload(true);
  const closeModal = () => setOpenUpload(false);

  const getFileTypeColor = (type) => {
    switch (type?.toUpperCase()) {
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

  const filtered = artifacts.filter((a) =>
    a.originalFilename?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDownload = async (artifact) => {
    try {
      await downloadArtifact(
        project.id,
        artifact.id,
        artifact.originalFilename,
      );
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDelete = async (artifact) => {
    if (!window.confirm(`Delete ${artifact.originalFilename}?`)) return;
    try {
      await deleteArtifact(project.id, artifact.id);
      loadArtifacts();
      if (onArtifactChange) {
        onArtifactChange();
      }
    } catch (error) {
      console.error("Delete failed:", error);
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
      {/* HEADER */}
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
              {filtered.length} files • Documents & Resources
            </Typography>
          </Box>
        </Box>

        {/* Search + Upload */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 1, width: 220 }}
          />

          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={openModal}
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
      </Box>

      {/* TABLE */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "background.default",
                  borderBottom: 2,
                }}
              >
                File Name
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Type
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Size
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Uploaded By</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tags</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((artifact) => (
                <TableRow
                  key={artifact.id}
                  hover
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                      "& .action-btn": {
                        opacity: 1,
                      },
                    },
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
                      <Typography variant="body2" fontWeight={700}>
                        {artifact.originalFilename}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Type */}
                  <TableCell align="center">
                    <Chip
                      label={artifact.type}
                      size="small"
                      color={getFileTypeColor(artifact.type)}
                    />
                  </TableCell>

                  {/* Size */}
                  <TableCell align="center">
                    {(artifact.size / 1024).toFixed(1)} KB
                  </TableCell>

                  {/* Uploaded By */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {artifact.uploadedBy || "Unknown"}
                    </Typography>
                  </TableCell>

                  {/* Date */}
                  <TableCell align="center">
                    {artifact.uploadedAt
                      ? new Date(artifact.uploadedAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>

                  {/* Tags */}
                  <TableCell>
                    {artifact.tags?.split(",").map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag.trim()}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <Tooltip title="Download">
                      <IconButton
                        className="action-btn"
                        size="small"
                        onClick={() => handleDownload(artifact)}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        className="action-btn"
                        size="small"
                        onClick={() => handleDelete(artifact)}
                        sx={{
                          "&:hover": {
                            bgcolor: "error.main",
                            color: "white",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Box>
                    <DescriptionIcon
                      sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
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

      {/* UPLOAD MODAL */}
      <ArtifactUploadModal
        open={openUpload}
        onClose={closeModal}
        projectId={project.id}
        username={username}
        onUploaded={() => {
          loadArtifacts();
          if (onArtifactChange) {
            onArtifactChange();
          }
        }}
      />
    </Paper>
  );
}
