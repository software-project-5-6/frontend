import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import {
  authorizeGoogle,
  fetchGmailArtifacts,
  uploadArtifact,
} from "../../../api/artifactApi";
import useTags from "../../../hooks/useTags";
import { useAuth } from "../../../context/AuthContext";

export default function ArtifactUploadModal({
  open,
  onClose,
  projectId,
  username,
  onUploaded,
  googleConnected = false,
}) {
  const [file, setFile] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [activeView, setActiveView] = useState(null);

  const [gmailFilters, setGmailFilters] = useState({
    senderEmail: "",
    lastDays: "7",
    label: "INBOX",
    maxResults: "10",
  });
  const [gmailLoading, setGmailLoading] = useState(false);
  const [gmailError, setGmailError] = useState("");
  const [emails, setEmails] = useState([]);
  const [selectedEmailIds, setSelectedEmailIds] = useState(new Set());
  const [expandedEmailIndex, setExpandedEmailIndex] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailTags, setEmailTags] = useState({});
  const [emailTagInputs, setEmailTagInputs] = useState({});
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const { tags, addTag, removeTag, resetTags } = useTags();
  const { userAttributes } = useAuth();
  const theme = useTheme();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && googleConnected) {
      setActiveView("gmail");
    }
  }, [open, googleConnected]);

  const handleClose = () => {
    setFile(null);
    setProgress(0);
    setError("");
    setTagInput("");
    setDragActive(false);
    setActiveView(null);
    setEmails([]);
    setSelectedEmailIds(new Set());
    setExpandedEmailIndex(null);
    setSelectedEmails([]);
    setEmailTags({});
    setEmailTagInputs({});
    setUploadingIndex(null);
    resetTags();
    onClose();
  };

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

  const handleGoogleAuth = () => {
    try {
      authorizeGoogle(userAttributes?.sub);
    } catch (err) {
      console.error("Google auth failed:", err);
      setError("Failed to initiate Google authorization. Please try again.");
    }
  };

  const handleLoadEmails = async () => {
    try {
      setGmailLoading(true);
      setGmailError("");
      setEmails([]);
      setSelectedEmailIds(new Set());
      setExpandedEmailIndex(null);

      const query = {
        ...(gmailFilters.senderEmail && {
          senderEmail: gmailFilters.senderEmail,
        }),
        ...(gmailFilters.lastDays && {
          lastDays: Number(gmailFilters.lastDays),
        }),
        ...(gmailFilters.label && { label: gmailFilters.label }),
        ...(gmailFilters.maxResults && {
          maxResults: Number(gmailFilters.maxResults),
        }),
      };

      const result = await fetchGmailArtifacts(projectId, query);
      setEmails(Array.isArray(result) ? result : []);
    } catch (err) {
      setGmailError(
        err.response?.data?.message ||
          "Failed to load emails. Please try again.",
      );
    } finally {
      setGmailLoading(false);
    }
  };

  const handleToggleEmail = (index) => {
    setSelectedEmailIds((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleImportSelected = () => {
    const chosen = emails.filter((_, i) => selectedEmailIds.has(i));
    setSelectedEmails(chosen);
    setEmailTags({});
    setEmailTagInputs({});
    setExpandedEmailIndex(null);
    setActiveView(null);
  };

  const handleSendEmails = async () => {
    try {
      setUploading(true);
      setError("");

      for (let i = 0; i < selectedEmails.length; i++) {
        const email = selectedEmails[i];
        setUploadingIndex(i);

        const tagsString = (emailTags[i] || []).join(",");
        const safeSubject = (email.subject || "no-subject")
          .replace(/[^a-zA-Z0-9 -]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .substring(0, 40);
        const fileName = `gmail-${safeSubject}-${Date.now()}.json`;

        const blob = new Blob([JSON.stringify(email, null, 2)], {
          type: "application/json",
        });
        const emailFile = new File([blob], fileName, {
          type: "application/json",
        });

        await uploadArtifact(
          projectId,
          emailFile,
          "DOCUMENT",
          username,
          tagsString,
          () => {},
        );
      }

      if (onUploaded) onUploaded();
      handleClose();
    } catch (err) {
      console.error("Send emails failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to import emails. Please try again.",
      );
    } finally {
      setUploading(false);
      setUploadingIndex(null);
    }
  };

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

  const getFileType = (selectedFile) => {
    const mimeType = selectedFile.type.toLowerCase();
    const fileName = selectedFile.name.toLowerCase();

    if (
      mimeType.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fileName)
    ) {
      return "IMAGE";
    }
    if (
      mimeType.startsWith("audio/") ||
      /\.(mp3|wav|ogg|m4a|flac)$/.test(fileName)
    ) {
      return "AUDIO";
    }
    if (
      mimeType.startsWith("video/") ||
      /\.(mp4|avi|mov|wmv|flv|mkv)$/.test(fileName)
    ) {
      return "VIDEO";
    }
    return "DOCUMENT";
  };

  const maxWidth = selectedEmails.length > 0 ? "md" : "sm";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {activeView && (
            <IconButton onClick={() => setActiveView(null)} size="small">
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6">
            {activeView === "gmail"
              ? googleConnected
                ? "Add Emails"
                : "Add Emails"
              : "Upload Artifact"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {activeView === "gmail" ? (
          <Box sx={{ py: 1 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
            >
              <img
                src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_32dp.png"
                alt="Gmail"
                style={{ width: 32, height: 32 }}
              />
              <Typography variant="h6">
                {googleConnected
                  ? "Load Emails as Artifacts"
                  : "Add emails from your Gmail account"}
              </Typography>
            </Box>

            {!googleConnected ? (
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Allow access to import emails and attachments directly as
                  artifacts.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGoogleAuth}
                >
                  Authorize with Google
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Sender Email"
                  placeholder="e.g. someone@example.com"
                  size="small"
                  fullWidth
                  value={gmailFilters.senderEmail}
                  onChange={(e) =>
                    setGmailFilters((f) => ({
                      ...f,
                      senderEmail: e.target.value,
                    }))
                  }
                />

                <FormControl size="small" fullWidth>
                  <InputLabel>Last N Days</InputLabel>
                  <Select
                    label="Last N Days"
                    value={gmailFilters.lastDays}
                    onChange={(e) =>
                      setGmailFilters((f) => ({
                        ...f,
                        lastDays: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="1">Last 1 day</MenuItem>
                    <MenuItem value="3">Last 3 days</MenuItem>
                    <MenuItem value="7">Last 7 days</MenuItem>
                    <MenuItem value="14">Last 14 days</MenuItem>
                    <MenuItem value="30">Last 30 days</MenuItem>
                    <MenuItem value="90">Last 90 days</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel>Label</InputLabel>
                  <Select
                    label="Label"
                    value={gmailFilters.label}
                    onChange={(e) =>
                      setGmailFilters((f) => ({ ...f, label: e.target.value }))
                    }
                  >
                    <MenuItem value="INBOX">Inbox</MenuItem>
                    <MenuItem value="SENT">Sent</MenuItem>
                    <MenuItem value="STARRED">Starred</MenuItem>
                    <MenuItem value="IMPORTANT">Important</MenuItem>
                    <MenuItem value="UNREAD">Unread</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel>Max Emails to Load</InputLabel>
                  <Select
                    label="Max Emails to Load"
                    value={gmailFilters.maxResults}
                    onChange={(e) =>
                      setGmailFilters((f) => ({
                        ...f,
                        maxResults: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="5">5 emails</MenuItem>
                    <MenuItem value="10">10 emails</MenuItem>
                    <MenuItem value="25">25 emails</MenuItem>
                    <MenuItem value="50">50 emails</MenuItem>
                    <MenuItem value="100">100 emails</MenuItem>
                  </Select>
                </FormControl>

                {gmailError && <Alert severity="error">{gmailError}</Alert>}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleLoadEmails}
                  disabled={gmailLoading}
                  startIcon={
                    gmailLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : null
                  }
                >
                  {gmailLoading ? "Loading..." : "Load Emails"}
                </Button>

                {emails.length > 0 && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        {emails.length} email{emails.length !== 1 ? "s" : ""}{" "}
                        found
                        {selectedEmailIds.size > 0 &&
                          ` · ${selectedEmailIds.size} selected`}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() =>
                          setSelectedEmailIds(
                            selectedEmailIds.size === emails.length
                              ? new Set()
                              : new Set(emails.map((_, i) => i)),
                          )
                        }
                      >
                        {selectedEmailIds.size === emails.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        maxHeight: 320,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        pr: 0.5,
                      }}
                    >
                      {emails.map((email, index) => (
                        <Card
                          key={index}
                          variant="outlined"
                          sx={{
                            borderColor: selectedEmailIds.has(index)
                              ? "primary.main"
                              : "divider",
                            bgcolor: selectedEmailIds.has(index)
                              ? "primary.50"
                              : "background.paper",
                            transition: "border-color 0.15s",
                          }}
                        >
                          <CardContent sx={{ p: "10px 12px !important" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1,
                              }}
                            >
                              <Checkbox
                                size="small"
                                checked={selectedEmailIds.has(index)}
                                onChange={() => handleToggleEmail(index)}
                                sx={{ mt: -0.5, ml: -0.5 }}
                              />
                              <Box
                                sx={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                                onClick={() =>
                                  setExpandedEmailIndex(
                                    expandedEmailIndex === index ? null : index,
                                  )
                                }
                              >
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  noWrap
                                >
                                  {email.subject || "(No subject)"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                >
                                  {email.from}
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setExpandedEmailIndex(
                                    expandedEmailIndex === index ? null : index,
                                  )
                                }
                              >
                                {expandedEmailIndex === index ? (
                                  <ExpandLessIcon fontSize="small" />
                                ) : (
                                  <ExpandMoreIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Box>

                            <Collapse in={expandedEmailIndex === index}>
                              <Divider sx={{ my: 1 }} />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                component="pre"
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                  fontFamily: "inherit",
                                  maxHeight: 180,
                                  overflowY: "auto",
                                  display: "block",
                                }}
                              >
                                {email.body || "(No content)"}
                              </Typography>
                            </Collapse>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      disabled={selectedEmailIds.size === 0}
                      onClick={handleImportSelected}
                    >
                      Import{" "}
                      {selectedEmailIds.size > 0 ? selectedEmailIds.size : ""}{" "}
                      Selected
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={
                  <img
                    src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_32dp.png"
                    alt="Gmail"
                    style={{ width: 20, height: 20 }}
                  />
                }
                onClick={() => setActiveView("gmail")}
              >
                {googleConnected ? "Load Email" : "Connect Gmail"}
              </Button>
            </Box>

            {selectedEmails.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2">
                    {selectedEmails.length} email
                    {selectedEmails.length !== 1 ? "s" : ""} ready to import
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      setSelectedEmails([]);
                      setEmailTags({});
                      setEmailTagInputs({});
                    }}
                  >
                    Clear
                  </Button>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {selectedEmails.map((email, index) => (
                    <Card
                      key={index}
                      variant="outlined"
                      sx={{
                        borderColor:
                          uploadingIndex === index ? "primary.main" : "divider",
                        opacity:
                          uploading && uploadingIndex !== index ? 0.5 : 1,
                        transition: "opacity 0.2s, border-color 0.2s",
                      }}
                    >
                      <CardContent sx={{ p: "14px 16px !important" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setExpandedEmailIndex(
                              expandedEmailIndex === index ? null : index,
                            )
                          }
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {email.subject || "(No subject)"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                            >
                              From: {email.from}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            {expandedEmailIndex === index ? (
                              <ExpandLessIcon fontSize="small" />
                            ) : (
                              <ExpandMoreIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>

                        <Collapse in={expandedEmailIndex === index}>
                          <Divider sx={{ my: 1 }} />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="pre"
                            sx={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              fontFamily: "inherit",
                              maxHeight: 100,
                              overflowY: "auto",
                              display: "block",
                              mb: 1,
                            }}
                          >
                            {email.body || "(No content)"}
                          </Typography>
                        </Collapse>

                        <Divider sx={{ mt: 2, mb: 1.5 }} />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 1, fontWeight: 600 }}
                        >
                          Tags for this email
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            size="small"
                            placeholder="Add tag..."
                            value={emailTagInputs[index] || ""}
                            onChange={(e) =>
                              setEmailTagInputs((prev) => ({
                                ...prev,
                                [index]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                emailTagInputs[index]?.trim()
                              ) {
                                setEmailTags((prev) => ({
                                  ...prev,
                                  [index]: [
                                    ...(prev[index] || []),
                                    emailTagInputs[index].trim(),
                                  ],
                                }));
                                setEmailTagInputs((prev) => ({
                                  ...prev,
                                  [index]: "",
                                }));
                              }
                            }}
                            sx={{ flex: 1 }}
                            disabled={uploading}
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={
                              uploading || !emailTagInputs[index]?.trim()
                            }
                            onClick={() => {
                              if (!emailTagInputs[index]?.trim()) return;
                              setEmailTags((prev) => ({
                                ...prev,
                                [index]: [
                                  ...(prev[index] || []),
                                  emailTagInputs[index].trim(),
                                ],
                              }));
                              setEmailTagInputs((prev) => ({
                                ...prev,
                                [index]: "",
                              }));
                            }}
                          >
                            Add
                          </Button>
                        </Box>

                        <Box
                          sx={{
                            mt: 1.5,
                            mb: 0.5,
                            minHeight: 32,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.75,
                            alignItems: "center",
                          }}
                        >
                          {(emailTags[index] || []).length === 0 ? (
                            <Typography
                              variant="caption"
                              color="text.disabled"
                              sx={{ fontStyle: "italic" }}
                            >
                              No tags added yet
                            </Typography>
                          ) : (
                            (emailTags[index] || []).map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                onDelete={() =>
                                  setEmailTags((prev) => ({
                                    ...prev,
                                    [index]: prev[index].filter(
                                      (t) => t !== tag,
                                    ),
                                  }))
                                }
                              />
                            ))
                          )}
                        </Box>

                        {uploadingIndex === index && (
                          <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CircularProgress size={14} />
                            <Typography variant="caption" color="primary">
                              Uploading...
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
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
                    bgcolor: "action.hover",
                  },
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
                {file ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
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
                    <CloudUploadIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                    />
                    <Typography
                      variant="body1"
                      color="text.primary"
                      gutterBottom
                    >
                      Drag & Drop your file here
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      or click to browse
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {selectedEmails.length === 0 && (
              <>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Add tag"
                    fullWidth
                    size="small"
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

                <Box
                  sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 0.5 }}
                >
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              </>
            )}

            {progress > 0 && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress variant="determinate" value={progress} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">
                      {`${Math.round(progress)}%`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mt: 2, textAlign: "center" }}
              >
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              onClick={
                selectedEmails.length > 0 ? handleSendEmails : handleUpload
              }
              disabled={uploading || (selectedEmails.length === 0 && !file)}
            >
              {uploading
                ? selectedEmails.length > 0
                  ? "Importing..."
                  : "Uploading..."
                : selectedEmails.length > 0
                  ? `Import ${selectedEmails.length} Email${selectedEmails.length !== 1 ? "s" : ""}`
                  : "Start Upload"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
