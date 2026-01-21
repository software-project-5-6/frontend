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
  TablePagination, // Imported for pagination
  TableSortLabel,  // Imported for sorting
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
  Refresh as RefreshIcon, // Added Refresh Icon
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
  
  // --- NEW: Pagination State ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // --- NEW: Sorting State ---
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('projectName');

  // Dialog States
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

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

  // --- NEW: Sorting Handlers ---
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // --- NEW: Sorting Logic ---
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- NEW: Apply Sort and Pagination ---
  const visibleProjects = filteredProjects
    .sort(getComparator(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // --- NEW: Pagination Handlers ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Navigation & Dialog Handlers (Kept same)
  const handleProjectClick = (projectId) => navigate(`/projects/${projectId}`);
  const handleViewOpen = (project) => { setSelectedProject(project); setViewDialogOpen(true); };
  const handleViewClose = () => { setViewDialogOpen(false); setSelectedProject(null); };
  const handleEditOpen = (project) => { setSelectedProject(project); setEditDialogOpen(true); };
  const handleEditClose = () => { setEditDialogOpen(false); setSelectedProject(null); };
  const handleDeleteOpen = (project) => { setSelectedProject(project); setDeleteDialogOpen(true); };
  const handleDeleteClose = () => { setDeleteDialogOpen(false); setSelectedProject(null); };
  
  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(selectedProject.id);
      setProjects(projects.filter((p) => p.id !== selectedProject.id));
      handleDeleteClose();
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project. Please try again.");
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
          Project Spaces
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Centralized all project related documents
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

      {/* Controls Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Search projects..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 300, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
            }}
          />
          {/* NEW: Refresh Button */}
          <Tooltip title="Refresh List">
            <IconButton onClick={fetchProjects} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <ShowForAdmin>
          <Tooltip title="Create New Project" arrow>
            <Fab
              color="primary"
              aria-label="add"
              size="medium"
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                background: gradients.primary,
                "&:hover": { background: gradients.primary, transform: "scale(1.05)" },
                transition: "transform 0.2s",
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </ShowForAdmin>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: gradients.primary }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }} align="center">Project ID</TableCell>
                
                {/* SORTABLE HEADER: PROJECT NAME */}
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'projectName'}
                    direction={orderBy === 'projectName' ? order : 'asc'}
                    onClick={() => handleRequestSort('projectName')}
                    sx={{
                      '&.MuiTableSortLabel-root': { color: 'white' },
                      '&.MuiTableSortLabel-root:hover': { color: 'rgba(255,255,255,0.8)' },
                      '&.Mui-active': { color: 'white' },
                      '& .MuiTableSortLabel-icon': { color: 'white !important' },
                    }}
                  >
                    Project Name
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: 600 }} align="center">Team Members</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }} align="center">Artifact Count</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Client Reference</TableCell>
                
                <ShowForAdmin>
                  {/* SORTABLE HEADER: PRICE */}
                  <TableCell sx={{ color: "white", fontWeight: 600 }} align="center">
                    <TableSortLabel
                      active={orderBy === 'price'}
                      direction={orderBy === 'price' ? order : 'asc'}
                      onClick={() => handleRequestSort('price')}
                      sx={{
                        '&.MuiTableSortLabel-root': { color: 'white' },
                        '&.Mui-active': { color: 'white' },
                        '& .MuiTableSortLabel-icon': { color: 'white !important' },
                      }}
                    >
                      Price
                    </TableSortLabel>
                  </TableCell>
                </ShowForAdmin>
                
                <TableCell sx={{ color: "white", fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleProjects.map((project, index) => (
                <TableRow
                  key={project.id}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    bgcolor: index % 2 === 0 ? "background.paper" : "action.hover",
                  }}
                >
                  <TableCell align="center">
                    <Chip label={project.id} size="small" color="default" variant="outlined" />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", "&:hover": { "& .MuiTypography-root": { color: "primary.main", textDecoration: "underline" } } }} onClick={() => handleProjectClick(project.id)}>
                      <FolderIcon color="primary" />
                      <Typography variant="body2" fontWeight={600}>{project.projectName}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Chip icon={<PeopleIcon />} label={project.userCount || 0} size="small" color="secondary" variant="outlined" />
                  </TableCell>

                  <TableCell align="center">
                    <Chip icon={<AttachFileIcon />} label={project.artifactCount || 0} size="small" color="primary" variant="outlined" />
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="body2" fontSize="0.8rem">{project.clientEmail || "N/A"}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="body2" fontSize="0.8rem">{project.clientPhone || "N/A"}</Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <ShowForAdmin>
                    <TableCell align="center">
                      <Chip label={`$${project.price?.toFixed(2) || "0.00"}`} size="small" color="success" variant="filled" />
                    </TableCell>
                  </ShowForAdmin>

                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                      <Tooltip title="View Details" arrow>
                        <IconButton size="small" color="info" onClick={() => handleViewOpen(project)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <ShowForAdmin>
                        <Tooltip title="Edit Project" arrow>
                          <IconButton size="small" color="warning" onClick={() => handleEditOpen(project)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Project" arrow>
                          <IconButton size="small" color="error" onClick={() => handleDeleteOpen(project)}>
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
          
          {/* NEW: Pagination Controls */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProjects.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {/* No Results Message */}
      {!loading && filteredProjects.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">No projects found</Typography>
          <Typography variant="body2" color="text.secondary">Try adjusting your search query</Typography>
        </Box>
      )}

      {/* Dialogs (Unchanged) */}
      <ViewProjectDialog open={viewDialogOpen} onClose={handleViewClose} project={selectedProject} />
      <EditProjectDialog open={editDialogOpen} onClose={handleEditClose} project={selectedProject} onUpdate={fetchProjects} />
      <DeleteProjectDialog open={deleteDialogOpen} onClose={handleDeleteClose} project={selectedProject} onConfirm={handleDeleteConfirm} />
      <CreateProjectDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onCreate={fetchProjects} />
    </Container>
  );
}