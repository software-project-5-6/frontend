import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { gradients } from "../../../styles/theme";

export default function AddUserDialog({
  open,
  onClose,
  inviteData,
  onInviteDataChange,
  onSendInvite,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          background: gradients.secondary,
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Invite User to Project
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={inviteData.email}
              onChange={(e) =>
                onInviteDataChange({ ...inviteData, email: e.target.value })
              }
              placeholder="user@example.com"
              required
              helperText="User will receive an invitation email to join the project"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Role"
              select
              fullWidth
              value={inviteData.role}
              onChange={(e) =>
                onInviteDataChange({ ...inviteData, role: e.target.value })
              }
            >
              <MenuItem value="MANAGER">Manager</MenuItem>
              <MenuItem value="CONTRIBUTOR">Contributor</MenuItem>
              <MenuItem value="VIEWER">Viewer</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onSendInvite}
          variant="contained"
          color="primary"
          disabled={!inviteData.email}
        >
          Send Invitation
        </Button>
      </DialogActions>
    </Dialog>
  );
}
