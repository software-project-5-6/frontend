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
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { gradients } from "../../styles/theme";
import { ShowForAdmin } from "../../components/RoleBasedComponents";
import { getAllUsers, deleteUser } from "../../api/userApi";
import ViewUserDialog from "./components/ViewUserDialog";
import EditUserDialog from "./components/EditUserDialog";
import DeleteUserDialog from "./components/DeleteUserDialog";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle navigation to user details
  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  // Handle View Dialog
  const handleViewOpen = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedUser(null);
  };

  // Handle Edit Dialog
  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  // Handle Delete Dialog
  const handleDeleteOpen = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser.id);
      // Remove user from state after successful deletion
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      handleDeleteClose();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  // Handle Create Dialog
  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateUser = (newUser) => {
    // Refresh the users list after creation
    fetchUsers();
  };

  // Handle Edit Save
  const handleEditSave = (updatedUser) => {
    // Refresh the users list after update
    fetchUsers();
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "APP_ADMIN":
        return "error";
      case "APP_USER":
        return "primary";
      default:
        return "default";
    }
  };

  // Get role label
  const getRoleLabel = (role) => {
    switch (role) {
      case "APP_ADMIN":
        return "Admin";
      case "APP_USER":
        return "User";
      default:
        return role;
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
          Users
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and track all system users
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
          placeholder="Search users..."
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
      </Box>

      {/* Users Table */}
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
                  User ID
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  User Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Contact Information
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 600 }}
                  align="center"
                >
                  Role
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
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    bgcolor:
                      index % 2 === 0 ? "background.paper" : "action.hover",
                  }}
                >
                  {/* User ID */}
                  <TableCell align="center">
                    <Chip
                      label={`#${user.id}`}
                      size="small"
                      color="default"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* User Name */}
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        cursor: "pointer",
                        "&:hover": {
                          "& .MuiTypography-root": {
                            color: "primary.main",
                            textDecoration: "underline",
                          },
                        },
                      }}
                      onClick={() => handleUserClick(user.id)}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 36,
                          height: 36,
                          fontSize: "0.875rem",
                        }}
                      >
                        {getInitials(user.fullName)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        {user.fullName}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Contact Information */}
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <EmailIcon
                        sx={{ fontSize: 14, color: "text.secondary" }}
                      />
                      <Typography variant="body2" fontSize="0.8rem">
                        {user.email || "N/A"}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Role */}
                  <TableCell align="center">
                    <Chip
                      icon={
                        user.globalRole === "APP_ADMIN" ? (
                          <AdminIcon />
                        ) : (
                          <PersonIcon />
                        )
                      }
                      label={getRoleLabel(user.globalRole)}
                      size="small"
                      color={getRoleColor(user.globalRole)}
                      variant="filled"
                    />
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
                      {/* View Button - Visible to all users */}
                      <Tooltip title="View Details" arrow>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewOpen(user)}
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

                      {/* Delete Button - Admin Only */}
                      <ShowForAdmin>
                        <Tooltip title="Delete User" arrow>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteOpen(user)}
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
      {!loading && filteredUsers.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search query
          </Typography>
        </Box>
      )}

      {/* Dialog Components */}
      <ViewUserDialog
        open={viewDialogOpen}
        onClose={handleViewClose}
        user={selectedUser}
      />

      <EditUserDialog
        open={editDialogOpen}
        onClose={handleEditClose}
        user={selectedUser}
        onSave={handleEditSave}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        user={selectedUser}
        onConfirm={handleDeleteConfirm}
      />

      {/* TODO: Add CreateUserDialog when needed */}
      {/* <CreateUserDialog
        open={createDialogOpen}
        onClose={handleCreateClose}
        onCreate={handleCreateUser}
      /> */}
    </Container>
  );
}
