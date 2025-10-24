import React, { useState } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { gradients } from "../../styles/theme";
import ViewProjectDialog from "./ViewProjectDialog";
import EditProjectDialog from "./EditProjectDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";
import CreateProjectDialog from "./CreateProjectDialog";

// 🎯 Dummy data - 10 projects
const dummyProjects = [
  {
    id: 1,
    name: "E-Commerce Platform",
    artifactCount: 45,
    clientEmail: "john.doe@ecommerce.com",
    clientPhone: "+1 234-567-8900",
    usersCount: 8,
    createdDate: "2024-01-15",
    status: "Active",
    description: "Full-stack e-commerce platform with payment integration",
  },
  {
    id: 2,
    name: "Mobile Banking App",
    artifactCount: 32,
    clientEmail: "sarah.smith@bank.com",
    clientPhone: "+1 234-567-8901",
    usersCount: 12,
    createdDate: "2024-02-20",
    status: "Active",
    description: "Secure mobile banking application for iOS and Android",
  },
  {
    id: 3,
    name: "Healthcare Management System",
    artifactCount: 67,
    clientEmail: "michael.brown@health.com",
    clientPhone: "+1 234-567-8902",
    usersCount: 15,
    createdDate: "2024-01-10",
    status: "Active",
    description: "Patient management and appointment scheduling system",
  },
  {
    id: 4,
    name: "Real Estate Portal",
    artifactCount: 28,
    clientEmail: "lisa.johnson@realty.com",
    clientPhone: "+1 234-567-8903",
    usersCount: 5,
    createdDate: "2024-03-05",
    status: "Active",
    description: "Property listing and management portal",
  },
  {
    id: 5,
    name: "Educational Learning Platform",
    artifactCount: 53,
    clientEmail: "david.wilson@edu.com",
    clientPhone: "+1 234-567-8904",
    usersCount: 10,
    createdDate: "2024-02-12",
    status: "Pending",
    description: "Online learning platform with video courses",
  },
  {
    id: 6,
    name: "Restaurant Management",
    artifactCount: 19,
    clientEmail: "emma.davis@restaurant.com",
    clientPhone: "+1 234-567-8905",
    usersCount: 4,
    createdDate: "2024-03-18",
    status: "Active",
    description: "Restaurant ordering and inventory management",
  },
  {
    id: 7,
    name: "Travel Booking System",
    artifactCount: 41,
    clientEmail: "james.miller@travel.com",
    clientPhone: "+1 234-567-8906",
    usersCount: 9,
    createdDate: "2024-01-25",
    status: "Active",
    description: "Flight and hotel booking platform",
  },
  {
    id: 8,
    name: "Fitness Tracking App",
    artifactCount: 24,
    clientEmail: "olivia.taylor@fitness.com",
    clientPhone: "+1 234-567-8907",
    usersCount: 6,
    createdDate: "2024-02-28",
    status: "Completed",
    description: "Personal fitness tracker with workout plans",
  },
  {
    id: 9,
    name: "Social Media Dashboard",
    artifactCount: 36,
    clientEmail: "william.anderson@social.com",
    clientPhone: "+1 234-567-8908",
    usersCount: 11,
    createdDate: "2024-03-10",
    status: "Active",
    description: "Analytics dashboard for social media management",
  },
  {
    id: 10,
    name: "Inventory Management System",
    artifactCount: 58,
    clientEmail: "sophia.martinez@inventory.com",
    clientPhone: "+1 234-567-8909",
    usersCount: 7,
    createdDate: "2024-01-30",
    status: "Active",
    description: "Warehouse and inventory tracking system",
  },
];

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(dummyProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const handleDeleteConfirm = () => {
    // TODO: Implement delete functionality with API call
    console.log("Delete project:", selectedProject.id);
    // Remove project from state for now
    setProjects(projects.filter((p) => p.id !== selectedProject.id));
    handleDeleteClose();
  };

  // Handle Create Dialog
  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateProject = (newProject) => {
    // TODO: Implement create functionality with API call
    console.log("Create new project:", newProject);
    // Add project to state for now
    setProjects([...projects, newProject]);
  };

  // Handle Edit Save
  const handleEditSave = (updatedProject) => {
    // TODO: Implement update functionality with API call
    console.log("Update project:", updatedProject);
    // Update project in state for now
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    );
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Pending":
        return "warning";
      case "Completed":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
          Projects
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and track all your projects
        </Typography>
      </Box>

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

        {/* Add Project Button - Top Right */}
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
      </Box>

      {/* Projects Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: gradients.primary,
              }}
            >
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Project Name
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
              <TableCell
                sx={{ color: "white", fontWeight: 600 }}
                align="center"
              >
                Users
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: 600 }}
                align="center"
              >
                Status
              </TableCell>
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
                      {project.name}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Artifact Count */}
                <TableCell align="center">
                  <Chip
                    label={project.artifactCount}
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
                        {project.clientEmail}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PhoneIcon
                        sx={{ fontSize: 14, color: "text.secondary" }}
                      />
                      <Typography variant="body2" fontSize="0.8rem">
                        {project.clientPhone}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Users Count */}
                <TableCell align="center">
                  <Chip
                    icon={<PersonIcon />}
                    label={project.usersCount}
                    size="small"
                    color="secondary"
                    variant="filled"
                  />
                </TableCell>

                {/* Status */}
                <TableCell align="center">
                  <Chip
                    label={project.status}
                    size="small"
                    color={getStatusColor(project.status)}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}
                  >
                    {/* View Button */}
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

                    {/* Edit Button */}
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

                    {/* Delete Button */}
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
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* No Results Message */}
      {filteredProjects.length === 0 && (
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
        onSave={handleEditSave}
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
