import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { gradients } from "../../styles/theme";

export default function DeleteProjectDialog({
  open,
  onClose,
  project,
  onConfirm,
}) {
  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete project:", project?.id);
    if (onConfirm) {
      onConfirm(project);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          background: gradients.pink,
          color: "white",
        }}
      >
        Confirm Delete
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Typography>
          Are you sure you want to delete the project{" "}
          <strong>"{project?.name}"</strong>?
        </Typography>
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
