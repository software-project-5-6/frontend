import React, { useState, useEffect, useMemo } from "react";
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
  CircularProgress,
  Alert,
  Avatar,
  Card,
  CardContent,
  Button,
  Snackbar,
  Skeleton,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Clear as ClearIcon,
  PeopleAltOutlined as PeopleIcon,
  AdminPanelSettingsOutlined as AdminCardIcon,
  PersonOutline as UserCardIcon,
  SearchOff as SearchOffIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { ShowForAdmin } from "../../components/RoleBasedComponents";
import { getAllUsers, deleteUser } from "../../api/userApi";
import ViewUserDialog from "./components/ViewUserDialog";
import DeleteUserDialog from "./components/DeleteUserDialog";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query (case-insensitive on name & email)
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const name = (user.fullName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [users, searchQuery]);

  // Genuine summary counts calculated from real API data
  const summaryCounts = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.globalRole === "APP_ADMIN").length;
    const regular = users.filter((u) => u.globalRole !== "APP_ADMIN").length;
    return { total, admins, regular };
  }, [users]);

  // Handle View Dialog
  const handleViewOpen = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
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
    if (!selectedUser?.id) return;
    try {
      await deleteUser(selectedUser.id);
      const targetName = selectedUser.fullName || selectedUser.email || "User";
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setSuccessMessage(`User "${targetName}" was successfully deleted.`);
      handleDeleteClose();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
      handleDeleteClose();
    }
  };

  // Get initials for avatar (e.g., "charuka niluminda" -> "CN")
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "U";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={0.75}>
          Users
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage system users, access roles, and permissions
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2.5,
          mb: 3.5,
        }}
      >
        {/* Total Users */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 16px rgba(0, 0, 0, 0.4)"
                  : "0 4px 16px rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Total Users
                </Typography>
                <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mt: 0.5 }}>
                  {loading ? <Skeleton width={48} height={32} /> : summaryCounts.total}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                <PeopleIcon />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Administrators */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 16px rgba(0, 0, 0, 0.4)"
                  : "0 4px 16px rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Administrators
                </Typography>
                <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mt: 0.5 }}>
                  {loading ? <Skeleton width={48} height={32} /> : summaryCounts.admins}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(99, 102, 241, 0.2)"
                      : "rgba(79, 70, 229, 0.1)",
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#a5b4fc" : "#4338ca",
                }}
              >
                <AdminCardIcon />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Regular Users */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 16px rgba(0, 0, 0, 0.4)"
                  : "0 4px 16px rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Regular Users
                </Typography>
                <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mt: 0.5 }}>
                  {loading ? <Skeleton width={48} height={32} /> : summaryCounts.regular}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                  color: "info.main",
                }}
              >
                <UserCardIcon />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Search Toolbar */}
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
        <TextField
          placeholder="Search by name or email..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            minWidth: { xs: "100%", sm: 320 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "background.paper",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {!loading && (
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Showing {filteredUsers.length} of {users.length} users
            </Typography>
          )}
          <Tooltip title="Refresh user list" arrow>
            <IconButton
              size="small"
              aria-label="Refresh user list"
              onClick={fetchUsers}
              disabled={loading}
              sx={{
                color: "text.secondary",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                "&:hover": { color: "primary.main" },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Users Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      ) : filteredUsers.length === 0 ? (
        /* Empty State */
        <Paper
          elevation={0}
          sx={{
            py: 8,
            px: 3,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              color: "primary.main",
              mb: 2,
            }}
          >
            <SearchOffIcon sx={{ fontSize: 26 }} />
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
            {searchQuery ? `No users matching "${searchQuery}"` : "No users found"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 380, mb: searchQuery ? 2.5 : 0 }}
          >
            {searchQuery
              ? "We couldn't find any users matching your search terms. Try searching with a different name or email address."
              : "There are currently no users registered in the system."}
          </Typography>
          {searchQuery && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              onClick={() => setSearchQuery("")}
              sx={{
                borderRadius: 2,
                borderColor: "divider",
                color: "text.primary",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              Clear Search
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {/* Desktop & Tablet Table Layout */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              display: { xs: "none", md: "block" },
              borderRadius: 2.5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.03)
                        : alpha(theme.palette.primary.main, 0.03),
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <TableCell
                    sx={{
                      py: 1.75,
                      px: 3,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "text.primary",
                      bgcolor: "transparent",
                      borderBottom: "none",
                      width: "55%",
                    }}
                  >
                    User
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      py: 1.75,
                      px: 2,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "text.primary",
                      bgcolor: "transparent",
                      borderBottom: "none",
                      width: "25%",
                    }}
                  >
                    Role
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      py: 1.75,
                      px: 3,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "text.primary",
                      bgcolor: "transparent",
                      borderBottom: "none",
                      width: "20%",
                    }}
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
                      borderBottom:
                        index === filteredUsers.length - 1 ? "none" : "1px solid",
                      borderColor: "divider",
                      transition: "background-color 0.15s ease",
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.common.white, 0.02)
                            : alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                  >
                    {/* User: Initials avatar + Name + Email */}
                    <TableCell sx={{ py: 1.75, px: 3, borderBottom: "none" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.primary.light, 0.2)
                                : alpha(theme.palette.primary.main, 0.12),
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.palette.primary.light
                                : theme.palette.primary.dark,
                            border: "1px solid",
                            borderColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.primary.light, 0.3)
                                : alpha(theme.palette.primary.main, 0.2),
                          }}
                        >
                          {getInitials(user.fullName)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="text.primary"
                            noWrap
                            sx={{
                              cursor: "pointer",
                              transition: "color 0.15s ease",
                              "&:hover": {
                                color: "primary.main",
                                textDecoration: "underline",
                              },
                            }}
                            onClick={() => handleViewOpen(user)}
                          >
                            {user.fullName || "Unnamed User"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{ display: "block", mt: 0.25 }}
                          >
                            {user.email || "No email"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Role Badge */}
                    <TableCell align="center" sx={{ py: 1.75, px: 2, borderBottom: "none" }}>
                      <Chip
                        icon={
                          user.globalRole === "APP_ADMIN" ? (
                            <AdminIcon sx={{ fontSize: "14px !important" }} />
                          ) : (
                            <PersonIcon sx={{ fontSize: "14px !important" }} />
                          )
                        }
                        label={user.globalRole === "APP_ADMIN" ? "Admin" : "User"}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                          borderRadius: 1.5,
                          ...(user.globalRole === "APP_ADMIN"
                            ? {
                                color: (theme) =>
                                  theme.palette.mode === "dark" ? "#a5b4fc" : "#4338ca",
                                bgcolor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "rgba(99, 102, 241, 0.2)"
                                    : "rgba(79, 70, 229, 0.08)",
                                borderColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "rgba(99, 102, 241, 0.4)"
                                    : "rgba(79, 70, 229, 0.25)",
                                "& .MuiChip-icon": {
                                  color: (theme) =>
                                    theme.palette.mode === "dark" ? "#a5b4fc" : "#4338ca",
                                },
                              }
                            : {
                                color: (theme) =>
                                  theme.palette.mode === "dark" ? "#cbd5e1" : "#475569",
                                bgcolor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "rgba(148, 163, 184, 0.12)"
                                    : "rgba(100, 116, 139, 0.06)",
                                borderColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "rgba(148, 163, 184, 0.25)"
                                    : "rgba(203, 213, 225, 0.6)",
                                "& .MuiChip-icon": {
                                  color: (theme) =>
                                    theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                                },
                              }),
                        }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ py: 1.75, px: 3, borderBottom: "none" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 0.75,
                        }}
                      >
                        {/* View Button */}
                        <Tooltip title="View user details" arrow>
                          <IconButton
                            size="small"
                            aria-label={`View details for ${user.fullName || user.email}`}
                            onClick={() => handleViewOpen(user)}
                            sx={{
                              color: "text.secondary",
                              borderRadius: 1.5,
                              border: "1px solid",
                              borderColor: "transparent",
                              "&:hover": {
                                color: "primary.main",
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                              },
                              transition: "all 0.15s ease",
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {/* Delete Button (Admin Only) */}
                        <ShowForAdmin>
                          <Tooltip title="Delete user" arrow>
                            <IconButton
                              size="small"
                              aria-label={`Delete user ${user.fullName || user.email}`}
                              onClick={() => handleDeleteOpen(user)}
                              sx={{
                                color: "text.secondary",
                                borderRadius: 1.5,
                                border: "1px solid",
                                borderColor: "transparent",
                                "&:hover": {
                                  color: "error.main",
                                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                                  borderColor: (theme) => alpha(theme.palette.error.main, 0.2),
                                },
                                transition: "all 0.15s ease",
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

          {/* Mobile View - Responsive Cards */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              gap: 2,
            }}
          >
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                elevation={0}
                sx={{
                  borderRadius: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.primary.light, 0.2)
                            : alpha(theme.palette.primary.main, 0.12),
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.dark,
                        border: "1px solid",
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.primary.light, 0.3)
                            : alpha(theme.palette.primary.main, 0.2),
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(user.fullName)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                        noWrap
                        sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
                        onClick={() => handleViewOpen(user)}
                      >
                        {user.fullName || "Unnamed User"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ display: "block" }}
                      >
                        {user.email || "No email"}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    icon={
                      user.globalRole === "APP_ADMIN" ? (
                        <AdminIcon sx={{ fontSize: "14px !important" }} />
                      ) : (
                        <PersonIcon sx={{ fontSize: "14px !important" }} />
                      )
                    }
                    label={user.globalRole === "APP_ADMIN" ? "Admin" : "User"}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      height: 22,
                      borderRadius: 1.5,
                      flexShrink: 0,
                      ...(user.globalRole === "APP_ADMIN"
                        ? {
                            color: (theme) =>
                              theme.palette.mode === "dark" ? "#a5b4fc" : "#4338ca",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(99, 102, 241, 0.2)"
                                : "rgba(79, 70, 229, 0.08)",
                            borderColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(99, 102, 241, 0.4)"
                                : "rgba(79, 70, 229, 0.25)",
                            "& .MuiChip-icon": {
                              color: (theme) =>
                                theme.palette.mode === "dark" ? "#a5b4fc" : "#4338ca",
                            },
                          }
                        : {
                            color: (theme) =>
                              theme.palette.mode === "dark" ? "#cbd5e1" : "#475569",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(148, 163, 184, 0.12)"
                                : "rgba(100, 116, 139, 0.06)",
                            borderColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(148, 163, 184, 0.25)"
                                : "rgba(203, 213, 225, 0.6)",
                            "& .MuiChip-icon": {
                              color: (theme) =>
                                theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                            },
                          }),
                    }}
                  />
                </Box>

                {/* Mobile Actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    pt: 1.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ViewIcon fontSize="small" />}
                    onClick={() => handleViewOpen(user)}
                    sx={{
                      borderRadius: 1.5,
                      borderColor: "divider",
                      color: "text.primary",
                      fontSize: "0.75rem",
                      px: 1.5,
                      py: 0.5,
                    }}
                  >
                    View Details
                  </Button>
                  <ShowForAdmin>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon fontSize="small" />}
                      onClick={() => handleDeleteOpen(user)}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: "0.75rem",
                        px: 1.5,
                        py: 0.5,
                      }}
                    >
                      Delete
                    </Button>
                  </ShowForAdmin>
                </Box>
              </Card>
            ))}
          </Box>
        </>
      )}

      {/* Success Feedback Snackbar */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Dialog Components */}
      <ViewUserDialog
        open={viewDialogOpen}
        onClose={handleViewClose}
        user={selectedUser}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        user={selectedUser}
        onConfirm={handleDeleteConfirm}
      />
    </Container>
  );
}
