import React, { useState, useRef } from "react";
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
  useTheme
} from "@mui/material";

import { 
  Close as CloseIcon, 
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon
} from "@mui/icons-material";

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
  const [dragActive, setDragActive] = useState(false); // New state for drag visual

  const { tags, addTag, removeTag, resetTags } = useTags();
  const theme = useTheme();
  const inputRef = useRef(null); // Reference for the hidden input

  const handleClose = () => {
    setFile(null);
    setProgress(0);
    setError("");
    setTagInput("");
    setDragActive(false);
    resetTags();
    onClose();
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // --- EXISTING UPLOAD LOGIC (UNCHANGED) ---
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const fileType = getFileType(file);
      const tagsString = tags.join(",");

      await uploadArtifact(
        projectId,
        file,
        fileType, 
        username, 
        tagsString, 
        (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
      );

      setFile(null);
      setProgress(0);
      resetTags();
      setError("");

      if (onUploaded) onUploaded(); 
      handleClose(); 
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const getFileType = (file) => {
    const mimeType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (mimeType.startsWith("image/") || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fileName)) {
      return "IMAGE";
    } else if (mimeType.startsWith("audio/") || /\.(mp3|wav|ogg|m4a|flac)$/.test(fileName)) {
      return "AUDIO";
    } else if (mimeType.startsWith("video/") || /\.(mp4|avi|mov|wmv|flv|mkv)$/.test(fileName)) {
      return "VIDEO";
    } else {
      return "DOCUMENT";
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Upload Artifact
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* --- NEW DRAG & DROP ZONE --- */}
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          sx={{
            border: `2px dashed ${dragActive ? theme.palette.primary.main : theme.palette.grey[400]}`,
            borderRadius: 2,
            bgcolor: dragActive ? "action.hover" : "background.paper",
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            mb: 3,
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              bgcolor: "action.hover"
            }
          }}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={handleFileChange}
          />
          
          {file ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <FileIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="body1" fontWeight="bold">
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(file.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>
          ) : (
            <>
              <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
              <Typography variant="body1" color="text.primary" gutterBottom>
                Drag & Drop your file here
              </Typography>
              <Typography variant="caption" color="text.secondary">
                or click to browse
              </Typography>
            </>
          )}
        </Box>

        {/* TAG INPUT (UNCHANGED VISUALLY) */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Add tag"
            fullWidth
            size="small" // Made slightly smaller for better UI balance
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

        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => removeTag(tag)}
              size="small"
            />
          ))}
        </Box>

        {/* UPLOAD PROGRESS & ERROR */}
        {progress > 0 && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
              </Box>
            </Box>
          </Box>
        )}

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          onClick={handleUpload}
          disabled={uploading || !file}
        >
          {uploading ? "Uploading..." : "Start Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}