import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  Send as SendIcon,
  AccessTime as ClockIcon,
} from "@mui/icons-material";
import { invitationApi } from "../../../api/invitationApi";

export default function PendingInvitations({ projectId, refreshTrigger }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId) {
      loadInvitations();
    }
  }, [projectId, refreshTrigger]);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invitationApi.getPendingInvitations(projectId);
      setInvitations(data);
    } catch (err) {
      console.error("Error loading invitations:", err);
      setError(
        err.response?.data?.message || "Failed to load pending invitations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (invitationId) => {
    if (!window.confirm("Are you sure you want to revoke this invitation?")) {
      return;
    }

    try {
      await invitationApi.revokeInvitation(invitationId);
      // Remove from list
      setInvitations(invitations.filter((inv) => inv.id !== invitationId));
    } catch (err) {
      console.error("Error revoking invitation:", err);
      alert(err.response?.data?.message || "Failed to revoke invitation");
    }
  };

  const handleResend = async (invitationId) => {
    try {
      await invitationApi.resendInvitation(invitationId);
      alert("Invitation email resent successfully!");
    } catch (err) {
      console.error("Error resending invitation:", err);
      alert(err.response?.data?.message || "Failed to resend invitation");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "MANAGER":
        return "error";
      case "CONTRIBUTOR":
        return "primary";
      case "VIEWER":
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isExpiringSoon = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 2 && daysUntilExpiry > 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (invitations.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No pending invitations
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Pending Invitations ({invitations.length})
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Invited By</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Sent Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Expires</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow
                key={invitation.id}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {invitation.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={invitation.role}
                    size="small"
                    color={getRoleColor(invitation.role)}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {invitation.invitedByName || "Unknown"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(invitation.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(invitation.expiresAt)}
                    </Typography>
                    {isExpiringSoon(invitation.expiresAt) && (
                      <Tooltip title="Expiring soon">
                        <ClockIcon fontSize="small" color="warning" />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    <Tooltip title="Resend invitation">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleResend(invitation.id)}
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Revoke invitation">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRevoke(invitation.id)}
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
    </Box>
  );
}
