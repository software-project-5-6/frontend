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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  Send as SendIcon,
  AccessTime as ClockIcon,
} from "@mui/icons-material";
import { invitationApi } from "../../../api/invitationApi";
import { gradients } from "../../../styles/theme";

export default function PendingInvitations({ projectId, refreshTrigger }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [resendDialog, setResendDialog] = useState({ open: false, invitationId: null, email: "" });
  const [revokeDialog, setRevokeDialog] = useState({ open: false, invitationId: null, email: "" });
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
      setError(err.response?.data?.message || "Failed to load pending invitations");
    } finally {
      setLoading(false);
    }
  };

  const openRevokeDialog = (invitation) => {
    setRevokeDialog({ open: true, invitationId: invitation.id, email: invitation.email });
  };

  const closeRevokeDialog = () => {
    if (!actionLoading) setRevokeDialog({ open: false, invitationId: null, email: "" });
  };

  const confirmRevoke = async () => {
    setActionLoading(true);
    try {
      await invitationApi.revokeInvitation(revokeDialog.invitationId);
      setInvitations(invitations.filter((inv) => inv.id !== revokeDialog.invitationId));
      setRevokeDialog({ open: false, invitationId: null, email: "" });
      setSnackbar({ open: true, message: "Invitation revoked successfully.", severity: "success" });
    } catch (err) {
      console.error("Error revoking invitation:", err);
      setRevokeDialog({ open: false, invitationId: null, email: "" });
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to revoke invitation.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openResendDialog = (invitation) => {
    setResendDialog({ open: true, invitationId: invitation.id, email: invitation.email });
  };

  const closeResendDialog = () => {
    if (!actionLoading) setResendDialog({ open: false, invitationId: null, email: "" });
  };

  const confirmResend = async () => {
    setActionLoading(true);
    try {
      await invitationApi.resendInvitation(resendDialog.invitationId);
      setResendDialog({ open: false, invitationId: null, email: "" });
      setSnackbar({ open: true, message: "Invitation email resent successfully!", severity: "success" });
    } catch (err) {
      console.error("Error resending invitation:", err);
      setResendDialog({ open: false, invitationId: null, email: "" });
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to resend invitation.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
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
                sx={{ "&:hover": { bgcolor: "action.hover" } }}
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
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Tooltip title="Resend invitation">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => openResendDialog(invitation)}
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Revoke invitation">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openRevokeDialog(invitation)}
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

      {/* Resend Confirmation Dialog */}
      <Dialog open={resendDialog.open} onClose={closeResendDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ background: gradients.blue, color: "white" }}>
          Resend Invitation
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            Resend the invitation email to{" "}
            <strong>{resendDialog.email}</strong>?{" "}
            The expiry will be extended by 7 days.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResendDialog} disabled={actionLoading} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={confirmResend}
            disabled={actionLoading}
            variant="contained"
            color="success"
            startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          >
            {actionLoading ? "Sending…" : "Resend"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <Dialog open={revokeDialog.open} onClose={closeRevokeDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ background: gradients.red, color: "white" }}>
          Revoke Invitation
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            Are you sure you want to revoke the invitation for{" "}
            <strong>{revokeDialog.email}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRevokeDialog} disabled={actionLoading} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={confirmRevoke}
            disabled={actionLoading}
            variant="contained"
            color="error"
            startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
          >
            {actionLoading ? "Revoking…" : "Revoke"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
