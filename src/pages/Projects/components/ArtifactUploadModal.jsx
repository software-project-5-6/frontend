import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Chip,
  Box,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";

import { uploadArtifact } from "../../../api/artifactApi";
import useTags from "../../../hooks/useTags";

export default function ArtifactUploadModal({
  open,
  onClose,
  projectId,
  username,
  onUploaded,
}) {
  const [file, setFile] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { tags, addTag, removeTag, resetTags } = useTags();

  const handleClose = () => {
    // Reset form state when closing
    setFile(null);
    setProgress(0);
    setError("");
    setTagInput("");
    resetTags();
    onClose();
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setUploading(true);
      setError("");

      // Determine file type based on extension or MIME type
      const fileType = getFileType(file);
      const tagsString = tags.join(",");

      await uploadArtifact(
        projectId,
        file,
        fileType, // DOCUMENT, IMAGE, AUDIO, VIDEO
        username, // uploadedBy
        tagsString, // comma-separated tags
        (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
      );

      // Reset everything after successful upload
      setFile(null);
      setProgress(0);
      resetTags();
      setError("");

      if (onUploaded) onUploaded(); // Refresh artifact list
      handleClose(); // Close modal with cleanup
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  // Helper function to determine file type
  const getFileType = (file) => {
    const mimeType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (
      mimeType.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fileName)
    ) {
      return "IMAGE";
    } else if (
      mimeType.startsWith("audio/") ||
      /\.(mp3|wav|ogg|m4a|flac)$/.test(fileName)
    ) {
      return "AUDIO";
    } else if (
      mimeType.startsWith("video/") ||
      /\.(mp4|avi|mov|wmv|flv|mkv)$/.test(fileName)
    ) {
      return "VIDEO";
    } else {
      return "DOCUMENT";
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Upload Artifact
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* FILE INPUT */}
        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
          Choose File
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>

        {file && (
          <Typography sx={{ mb: 2 }}>
            Selected: <b>{file.name}</b>
          </Typography>
        )}

        {/* TAG INPUT */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Add tag"
            fullWidth
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag(tagInput)}
          />
          <Button
            variant="contained"
            onClick={() => {
              addTag(tagInput);
              setTagInput("");
            }}
          >
            Add
          </Button>
        </Box>

        {/* TAG LIST */}
        <Box sx={{ mt: 1 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => removeTag(tag)}
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>

        {/* UPLOAD PROGRESS */}
        {progress > 0 && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography
              variant="caption"
              sx={{ mt: 0.5, display: "block", textAlign: "center" }}
            >
              Uploading... {progress}%
            </Typography>
          </Box>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {/* SUBMIT BUTTON */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleUpload}
          disabled={uploading || !file}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
