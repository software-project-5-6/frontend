import React from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { gradients } from "../../../styles/theme";

export default function ProjectTeamSection({
  project,
  onAddUserOpen,
  onRemoveUser,
  getRoleColor,
  getInitials,
}) {
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
      {/* Section Header - More professional */}
      <Box
        sx={{
          background: gradients.primary,
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
            <PeopleIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>
              Project Team
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {project.users?.length || 0} member
              {project.users?.length !== 1 ? "s" : ""} • Manage access & roles
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={onAddUserOpen}
          sx={{
            bgcolor: "white",
            color: "primary.main",
            fontWeight: 600,
            boxShadow: 2,
            "&:hover": {
              bgcolor: "grey.50",
              boxShadow: 4,
            },
          }}
        >
          Add Member
        </Button>
      </Box>

      {/* Users Table - Enhanced styling */}
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
                Team Member
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
                Email Address
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
                Role
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
            {project.users && project.users.length > 0 ? (
              project.users.map((user, index) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                      "& .delete-btn": {
                        opacity: 1,
                      },
                    },
                    transition: "background-color 0.2s",
                  }}
                >
                  {/* User Name with Avatar */}
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 40,
                          height: 40,
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          boxShadow: 2,
                        }}
                      >
                        {getInitials(user.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          {user.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.25 }}
                        >
                          Member ID: {user.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </TableCell>

                  {/* Role */}
                  <TableCell align="center">
                    <Chip
                      label={user.role}
                      size="small"
                      color={getRoleColor(user.role)}
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        height: 26,
                        minWidth: 90,
                      }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <Tooltip title="Remove from project" arrow placement="top">
                      <IconButton
                        className="delete-btn"
                        size="small"
                        onClick={() => onRemoveUser(user.id)}
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Box>
                    <PeopleIcon
                      sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Team Members Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click "Add Member" to invite people to this project
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
