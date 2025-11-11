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
} from "@mui/material";

const InviteUserDialog = ({
  open,
  onClose,
  inviteData,
  onInviteDataChange,
  onSendInvite,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Invite User to Project</DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, mt: 1 }}
        >
          Send an invitation by email. The invited user will receive a link to
          join the project with the selected role.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
          />
          <FormControl fullWidth required>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              label="Role"
              value={inviteData.role}
              onChange={(e) =>
                onInviteDataChange({ ...inviteData, role: e.target.value })
              }
            >
              <MenuItem value="MANAGER">Manager</MenuItem>
              <MenuItem value="CONTRIBUTOR">Contributor</MenuItem>
              <MenuItem value="VIEWER">Viewer</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSendInvite}
          disabled={!inviteData.email}
        >
          Send Invitation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteUserDialog;
