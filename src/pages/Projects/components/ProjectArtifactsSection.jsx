import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  TableSortLabel, // Added for sorting
} from "@mui/material";

import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
  FilterList as FilterIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

// Ensure this path is correct for your project
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
  const [googleConnected, setGoogleConnected] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // --- NEW: Sorting State ---
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("uploadedAt");

  useEffect(() => {
    loadArtifacts();
    const authProvider = searchParams.get("auth_provider");
    if (authProvider === "google") {
      // Google OAuth redirect detected
      setGoogleConnected(true);
      setOpenUpload(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("auth_provider");
      newParams.delete("result");
      setSearchParams(newParams, { replace: true });
    } else if (searchParams.get("result") === "true") {
      // Legacy fallback: Google redirect without auth_provider param
      setGoogleConnected(true);
      setOpenUpload(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("result");
      setSearchParams(newParams, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadArtifacts = async () => {
    try {
      const data = await fetchArtifacts(project.id);
      setArtifacts(data);
    } catch (e) {
      console.error("Error loading artifacts:", e);
    }
  };

  // --- NEW: Sorting Logic ---
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortArtifacts = (array) => {
    return array.sort((a, b) => {
      // Handle null values safely
      const aValue = a[orderBy] || "";
      const bValue = b[orderBy] || "";

      if (bValue < aValue) {
        return order === "asc" ? 1 : -1;
      }
      if (bValue > aValue) {
        return order === "asc" ? -1 : 1;
      }
      return 0;
    });
  };

  const isEmailArtifact = (artifact) =>
    artifact.originalFilename?.startsWith("gmail-") &&
    artifact.originalFilename?.endsWith(".json");

  const getEmailSubject = (filename) => {
    // filename pattern: gmail-[subject]-[timestamp].json
    const inner = filename.replace(/^gmail-/, "").replace(/-\d+\.json$/, "");
    return inner.replace(/-/g, " ") || "Email";
  };

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
      case "IMAGE":
        return "success"; // Added for your new Modal type
      default:
        return "default";
    }
  };

  // Filter then Sort
  const filtered = artifacts.filter((a) =>
    a.originalFilename?.toLowerCase().includes(search.toLowerCase()),
  );
  const sortedAndFiltered = sortArtifacts([...filtered]);

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
          background: gradients.orange, // Make sure 'gradients' is imported or defined
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
              {sortedAndFiltered.length} files • Documents & Resources
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
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              width: 220,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "transparent" },
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setOpenUpload(true)}
            sx={{
              bgcolor: "white",
              color: "warning.main", // Matches the orange theme
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
              {/* Sortable: File Name */}
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "background.default",
                  borderBottom: 2,
                }}
              >
                <TableSortLabel
                  active={orderBy === "originalFilename"}
                  direction={orderBy === "originalFilename" ? order : "asc"}
                  onClick={() => handleRequestSort("originalFilename")}
                >
                  File Name
                </TableSortLabel>
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Type
              </TableCell>

              {/* Sortable: Size */}
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <TableSortLabel
                  active={orderBy === "size"}
                  direction={orderBy === "size" ? order : "asc"}
                  onClick={() => handleRequestSort("size")}
                >
                  Size
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>Uploaded By</TableCell>

              {/* Sortable: Date (Default) */}
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <TableSortLabel
                  active={orderBy === "uploadedAt"}
                  direction={orderBy === "uploadedAt" ? order : "asc"}
                  onClick={() => handleRequestSort("uploadedAt")}
                >
                  Date
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>Tags</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedAndFiltered.length > 0 ? (
              sortedAndFiltered.map((artifact) => (
                <TableRow
                  key={artifact.id}
                  hover
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                      "& .action-btn": { opacity: 1 },
                    },
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          bgcolor: isEmailArtifact(artifact)
                            ? "primary.50"
                            : "action.hover",
                          borderRadius: 1.5,
                          p: 1,
                          display: "flex",
                        }}
                      >
                        {isEmailArtifact(artifact) ? (
                          <EmailIcon color="primary" sx={{ fontSize: 24 }} />
                        ) : (
                          <FileIcon color="primary" sx={{ fontSize: 24 }} />
                        )}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {isEmailArtifact(artifact)
                            ? getEmailSubject(artifact.originalFilename)
                            : artifact.originalFilename}
                        </Typography>
                        {isEmailArtifact(artifact) && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            Gmail import
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={artifact.type}
                      size="small"
                      color={getFileTypeColor(artifact.type)}
                    />
                  </TableCell>

                  <TableCell align="center">
                    {(artifact.size / 1024).toFixed(1)} KB
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {artifact.uploadedBy || "Unknown"}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {artifact.uploadedAt
                      ? new Date(artifact.uploadedAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "N/A"}
                  </TableCell>

                  <TableCell>
                    {artifact.tags?.split(",").map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag.trim()}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5, fontSize: "0.7rem" }}
                      />
                    ))}
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Download">
                      <IconButton
                        className="action-btn"
                        size="small"
                        onClick={() => handleDownload(artifact)}
                        sx={{ opacity: 0.6, transition: "0.2s" }}
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
                          opacity: 0.6,
                          transition: "0.2s",
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <DescriptionIcon
                      sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      No Artifacts Found
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {search
                        ? "Try adjusting your search terms"
                        : "This project has no documents yet"}
                    </Typography>
                    {!search && (
                      <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => setOpenUpload(true)}
                      >
                        Upload First File
                      </Button>
                    )}
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
        onClose={() => setOpenUpload(false)}
        projectId={project.id}
        username={username}
        googleConnected={googleConnected}
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
