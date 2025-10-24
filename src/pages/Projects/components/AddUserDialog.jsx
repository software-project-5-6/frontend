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
  newUser,
  onUserChange,
  onAddUser,
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
          Add User to Project
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="User Name"
              fullWidth
              value={newUser.name}
              onChange={(e) =>
                onUserChange({ ...newUser, name: e.target.value })
              }
              placeholder="Enter user name"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={newUser.email}
              onChange={(e) =>
                onUserChange({ ...newUser, email: e.target.value })
              }
              placeholder="user@example.com"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Role"
              select
              fullWidth
              value={newUser.role}
              onChange={(e) =>
                onUserChange({ ...newUser, role: e.target.value })
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
          onClick={onAddUser}
          variant="contained"
          color="primary"
          disabled={!newUser.name || !newUser.email}
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
}
