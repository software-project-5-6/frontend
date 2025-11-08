import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  InputAdornment,
  Fab,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Folder as FolderIcon,
  AttachFile as AttachFileIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { gradients } from "../../styles/theme";
import ViewProjectDialog from "./components/ViewProjectDialog";
import EditProjectDialog from "./components/EditProjectDialog";
import DeleteProjectDialog from "./components/DeleteProjectDialog";
import CreateProjectDialog from "./components/CreateProjectDialog";
import { getAllProjects, deleteProject } from "../../api/projectApi";
import { ShowForAdmin } from "../../components/RoleBasedComponents";

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle navigation to project details
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  // Handle View Dialog
  const handleViewOpen = (project) => {
    setSelectedProject(project);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedProject(null);
  };

  // Handle Edit Dialog
  const handleEditOpen = (project) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedProject(null);
  };

  // Handle Delete Dialog
  const handleDeleteOpen = (project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(selectedProject.id);
      // Remove project from state after successful deletion
      setProjects(projects.filter((p) => p.id !== selectedProject.id));
      handleDeleteClose();
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project. Please try again.");
    }
  };

  // Handle Create Dialog
  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateProject = (newProject) => {
    // Refresh the projects list after creation
    fetchProjects();
  };

  // Handle Edit Save - FIXED: Now properly refreshes the list
  const handleEditSave = async (updatedProject) => {
    // Refresh the projects list after update
    await fetchProjects();
  };

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
          Project Spaces
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Centralized all project related documents
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Search and Add Button Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Search Field - Top Left */}
        <TextField
          placeholder="Search projects..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            minWidth: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Add Project Button - Top Right (Admin Only) */}
        <ShowForAdmin>
          <Tooltip title="Create New Project" arrow>
            <Fab
              color="primary"
              aria-label="add"
              size="medium"
              onClick={handleCreateOpen}
              sx={{
                background: gradients.primary,
                "&:hover": {
                  background: gradients.primary,
                  transform: "scale(1.05)",
                },
                transition: "transform 0.2s",
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </ShowForAdmin>
      </Box>

      {/* Projects Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: gradients.primary,
                }}
              >
                <TableCell
                  sx={{ color: "white", fontWeight: 600 }}
                  align="center"
                >
                  Project ID
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Project Name
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 600 }}
                  align="center"
                >
                  Team Members
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 600 }}
                  align="center"
                >
                  Artifact Count
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Client Reference
                </TableCell>
                <ShowForAdmin>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Price
                  </TableCell>
                </ShowForAdmin>
                <TableCell
                  sx={{ color: "white", fontWeight: 600 }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.map((project, index) => (
                <TableRow
                  key={project.id}
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    bgcolor:
                      index % 2 === 0 ? "background.paper" : "action.hover",
                  }}
                >
                  {/* Project ID */}
                  <TableCell align="center">
                    <Chip
                      label={`#${project.id}`}
                      size="small"
                      color="default"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Project Name */}
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        "&:hover": {
                          "& .MuiTypography-root": {
                            color: "primary.main",
                            textDecoration: "underline",
                          },
                        },
                      }}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <FolderIcon color="primary" />
                      <Typography variant="body2" fontWeight={600}>
                        {project.projectName}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Team Members Count */}
                  <TableCell align="center">
                    <Chip
                      icon={<PeopleIcon />}
                      label={project.userCount || 0}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Artifact Count */}
                  <TableCell align="center">
                    <Chip
                      icon={<AttachFileIcon />}
                      label={project.artifactCount || 0}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Client Reference */}
                  <TableCell>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mb: 0.5,
                        }}
                      >
                        <EmailIcon
                          sx={{ fontSize: 14, color: "text.secondary" }}
                        />
                        <Typography variant="body2" fontSize="0.8rem">
                          {project.clientEmail || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <PhoneIcon
                          sx={{ fontSize: 14, color: "text.secondary" }}
                        />
                        <Typography variant="body2" fontSize="0.8rem">
                          {project.clientPhone || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Price (Admin Only) */}
                  <ShowForAdmin>
                    <TableCell align="center">
                      <Chip
                        label={`$${project.price?.toFixed(2) || "0.00"}`}
                        size="small"
                        color="success"
                        variant="filled"
                      />
                    </TableCell>
                  </ShowForAdmin>

                  {/* Actions */}
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      {/* View Button - Visible to all users */}
                      <Tooltip title="View Details" arrow>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewOpen(project)}
                          sx={{
                            "&:hover": {
                              bgcolor: "info.light",
                              color: "white",
                            },
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Edit Button - Admin Only */}
                      <ShowForAdmin>
                        <Tooltip title="Edit Project" arrow>
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleEditOpen(project)}
                            sx={{
                              "&:hover": {
                                bgcolor: "warning.light",
                                color: "white",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ShowForAdmin>

                      {/* Delete Button - Admin Only */}
                      <ShowForAdmin>
                        <Tooltip title="Delete Project" arrow>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteOpen(project)}
                            sx={{
                              "&:hover": {
                                bgcolor: "error.light",
                                color: "white",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ShowForAdmin>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No Results Message */}
      {!loading && filteredProjects.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search query
          </Typography>
        </Box>
      )}

      {/* Dialog Components */}
      <ViewProjectDialog
        open={viewDialogOpen}
        onClose={handleViewClose}
        project={selectedProject}
      />

      <EditProjectDialog
        open={editDialogOpen}
        onClose={handleEditClose}
        project={selectedProject}
        onUpdate={handleEditSave}
      />

      <DeleteProjectDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        project={selectedProject}
        onConfirm={handleDeleteConfirm}
      />

      <CreateProjectDialog
        open={createDialogOpen}
        onClose={handleCreateClose}
        onCreate={handleCreateProject}
      />
    </Container>
  );
}
