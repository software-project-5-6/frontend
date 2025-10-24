import React, { useState } from "react";
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

export default function CreateProjectDialog({ open, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: "",
    clientEmail: "",
    clientPhone: "",
    description: "",
    status: "Active",
    price: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Client email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Invalid email format";
    }

    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = "Client phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    // TODO: Implement create functionality with API call
    const newProject = {
      id: Date.now(), // Temporary ID generation
      ...formData,
      artifactCount: 0,
      usersCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
    };

    console.log("Create new project:", newProject);

    if (onCreate) {
      onCreate(newProject);
    }

    // Reset form and close
    setFormData({
      name: "",
      clientEmail: "",
      clientPhone: "",
      description: "",
      status: "Active",
      price: "",
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: "",
      clientEmail: "",
      clientPhone: "",
      description: "",
      status: "Active",
      price: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          background: gradients.primary,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Create New Project
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Project Name"
              fullWidth
              value={formData.name}
              onChange={handleChange("name")}
              error={!!errors.name}
              helperText={errors.name}
              required
              placeholder="Enter project name"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Client Email"
              type="email"
              fullWidth
              value={formData.clientEmail}
              onChange={handleChange("clientEmail")}
              error={!!errors.clientEmail}
              helperText={errors.clientEmail}
              required
              placeholder="client@example.com"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Client Phone"
              fullWidth
              value={formData.clientPhone}
              onChange={handleChange("clientPhone")}
              error={!!errors.clientPhone}
              helperText={errors.clientPhone}
              required
              placeholder="+1 234-567-8900"
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
              rows={4}
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Enter project description (optional)"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}
