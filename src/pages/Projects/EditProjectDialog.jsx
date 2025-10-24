import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { gradients } from "../../styles/theme";

export default function EditProjectDialog({ open, onClose, project, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    clientEmail: "",
    clientPhone: "",
    description: "",
    status: "Active",
    price: "",
  });

  // Update form data whenever project changes
  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id,
        name: project.name || "",
        clientEmail: project.clientEmail || "",
        clientPhone: project.clientPhone || "",
        description: project.description || "",
        status: project.status || "Active",
        price: project.price || "",
      });
    }
  }, [project]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = () => {
    // TODO: Implement save functionality
    console.log("Updated project:", formData);
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          background: gradients.orange,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Edit Project
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        {project && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Project Name"
                fullWidth
                value={formData.name}
                onChange={handleChange("name")}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Client Email"
                type="email"
                fullWidth
                value={formData.clientEmail}
                onChange={handleChange("clientEmail")}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Client Phone"
                fullWidth
                value={formData.clientPhone}
                onChange={handleChange("clientPhone")}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Project Budget"
                fullWidth
                value={formData.price}
                onChange={handleChange("price")}
                placeholder="e.g. $45,000"
                helperText="Enter the project budget (optional)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Status"
                select
                fullWidth
                value={formData.status}
                onChange={handleChange("status")}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange("description")}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="warning">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
