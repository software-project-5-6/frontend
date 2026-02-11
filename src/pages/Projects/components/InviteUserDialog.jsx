import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress
} from "@mui/material";
import { PersonAdd as PersonAddIcon, Send as SendIcon } from "@mui/icons-material";

const InviteUserDialog = ({
  open,
  onClose,
  inviteData,
  onInviteDataChange,
  onSendInvite,
  isLoading = false // NEW: Loading state prop
}) => {

  // NEW: Helper text to explain what each role does
  const roleDescriptions = {
    MANAGER: "Can manage members, edit project settings, and upload files.",
    CONTRIBUTOR: "Can upload and edit files, but cannot manage members.",
    VIEWER: "Can only view and download files. Read-only access."
  };

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : undefined} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonAddIcon color="primary" />
        Invite User to Project
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Send an invitation by email. The invited user will receive a link to
          join the project with the specific permissions selected below.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Email Input */}
          <TextField
            label="Email Address"
            type="email"
            value={inviteData.email}
            onChange={(e) =>
              onInviteDataChange({ ...inviteData, email: e.target.value })
            }
            fullWidth
            required
            placeholder="user@example.com"
            disabled={isLoading} // Disable while sending
          />

          {/* Role Selection with Helper Text */}
          <FormControl fullWidth required>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              label="Role"
              value={inviteData.role}
              onChange={(e) =>
                onInviteDataChange({ ...inviteData, role: e.target.value })
              }
              disabled={isLoading}
            >
              <MenuItem value="MANAGER">Manager</MenuItem>
              <MenuItem value="CONTRIBUTOR">Contributor</MenuItem>
              <MenuItem value="VIEWER">Viewer</MenuItem>
            </Select>
            {/* Dynamic Role Description */}
            <FormHelperText sx={{ mt: 1, color: 'text.secondary' }}>
              {roleDescriptions[inviteData.role] || "Select a role to see permissions."}
            </FormHelperText>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSendInvite}
          disabled={!inviteData.email || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        >
          {isLoading ? "Sending..." : "Send Invitation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteUserDialog;