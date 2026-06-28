import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Fade,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Send as SendIcon,
  AutoAwesome as AIIcon,
  ContentCopy as ContentCopyIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { gradients } from "../../styles/theme";
import { useAuth } from "../../context/AuthContext";
import { getAllProjects } from "../../api/projectApi";
import { askProject, getAllMessagesForConversation } from "../../api/chatApi";

export const AIAssistant = ({
  setCurrentProjectWithAssistant,
  currentProjectWithAssistant,
  currentConversationId,
  setCurrentConversationId,
  assistantActivated,
}) => {
  const { user, userRole, isAdmin } = useAuth();
  const welcomeMessage = "How can I help you today?";

  const [messages, setMessages] = useState([]);

  const [isSending, setIsSending] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [openPromptDialog, setOpenPromptDialog] = useState(false);
  const [selectedFinalPrompt, setSelectedFinalPrompt] = useState("");
  const [query, setQuery] = useState({
    projectId: "",
    conversationId: "",
    question: "",
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const copyResetTimeoutRef = useRef(null);
  const lastAssistantMessageIndex = messages
    .map((message) => message.role)
    .lastIndexOf("assist");

  const location = useLocation();

  useEffect(() => {
    if (!assistantActivated) {
      setMessages([]);
      setCurrentConversationId("");
      return;
    }

    let isActive = true;

    const loadConversationMessages = async () => {
      if (!currentConversationId) {
        return;
      }

      try {
        const response = await getAllMessagesForConversation(
          currentConversationId,
        );
        if (isActive) {
          console.log(response.messages);
          setMessages(response.messages);
        }
      } catch (error) {
        if (isActive) {
          setError("Failed to load conversation messages");
        }
      }
    };

    setQuery((prev) => ({
      ...prev,
      conversationId: currentConversationId || "",
    }));

    loadConversationMessages();

    return () => {
      isActive = false;
    };
  }, [
    assistantActivated,
    currentConversationId,
    welcomeMessage,
    setCurrentConversationId,
  ]);

  useEffect(() => {
    if (selectedProject) {
      setQuery((prev) => ({
        ...prev,
        projectId: selectedProject,
      }));
    }
  }, [selectedProject]);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProjects();
      setProjects(data);
      if (assistantActivated && data.length > 0) {
        const existingProjectId = currentProjectWithAssistant?.projectId;
        const initialProject =
          data.find((project) => project.id === existingProjectId) || data[0];

        setSelectedProject(initialProject.id);
        // Keep the assistant aligned with the active project instead of
        // resetting it whenever the page re-renders or the conversation changes.
        setCurrentProjectWithAssistant({
          ...(currentProjectWithAssistant || {}),
          projectId: initialProject.id,
          projectName: initialProject.projectName,
        });
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const getDisplayName = () => {
  //   if (user?.username) return user.username;
  //   if (user?.userId) return user.userId.split("-")[0];
  //   return "User";
  // };

  // const getInitials = () => {
  //   const displayName = getDisplayName();
  //   if (!displayName || displayName === "User") return "U";
  //   const names = displayName.split(" ");
  //   if (names.length >= 2) {
  //     return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  //   }
  //   return displayName.charAt(0).toUpperCase();
  // };

  const handleSendMessage = async () => {
    if (!query.question.trim() || isSending) return;

    const questionText = query.question; // capture BEFORE clearing

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: questionText,
    };

    setMessages((prev) => [...prev, userMessage]);

    const updatedQuery = {
      projectId: selectedProject,
      conversationId: currentConversationId,
      question: questionText,
    };

    setIsSending(true);
    console.log("conversationId at send:", currentConversationId);
    try {
      const aiText = await askProject(updatedQuery);

      const aiResponse = {
        id: Date.now() + 1,
        role: "assist",
        content: aiText.answer,
        finalPrompt: aiText.finalPrompt,
      };

      setMessages((prev) => [...prev, aiResponse]);
      setQuery((prev) => ({
        ...prev,
        question: "",
      }));
    } catch (err) {
      setError("Failed to get AI response");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyMessage = async (message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      window.clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = window.setTimeout(() => {
        setCopiedMessageId(null);
      }, 1200);
    } catch (copyError) {
      setError("Failed to copy message");
    }
  };

  const handleViewFinalPrompt = (message) => {
    setSelectedFinalPrompt(message.finalPrompt || "");
    setOpenPromptDialog(true);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(copyResetTimeoutRef.current);
    };
  }, [assistantActivated]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        maxWidth: "1200px",
        margin: "0 auto",
        px: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "90%" }}
        >
          <Avatar sx={{ background: gradients.primary, width: 40, height: 40 }}>
            <AIIcon />
          </Avatar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                AI Assistant
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Always ready to help
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3, ml: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Current Project</InputLabel>
              <Select
                value={selectedProject}
                label="Current Project"
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  const project = projects.find((p) => p.id == e.target.value);
                  setCurrentProjectWithAssistant({
                    ...(currentProjectWithAssistant || {}),
                    projectId: project?.id ?? "",
                    projectName: project?.projectName ?? "",
                  });
                  setMessages([
                    {
                      id: 1,
                      role: "assist",
                      content:
                        "Hello! I'm your AI assistant. How can I help you with your projects today?",
                    },
                  ]);
                }}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.projectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Messages */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {!assistantActivated && (
            <Box
              sx={{
                py: 6,
                px: 4,
                maxWidth: 640,
                mx: "auto",
                mt: 10,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: "background.paper",
                mb: 4,
                boxShadow: "none",
              }}
            >
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  mb: 1,
                  fontSize: { xs: "2rem", md: "3rem" },
                  lineHeight: 1.15,
                }}
              >
                {welcomeMessage}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.95rem", md: "1rem" } }}
              >
                Search your organization's knowledge base, summarize documents,
                and get accurate answers based on available information.
              </Typography>
            </Box>
          )}
          {/* Scrollable Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              scrollbarGutter: "stable",
              py: 3,
              pr: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {messages.map((message, index) => (
              <Fade in={true} key={message.id} timeout={500}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    flexDirection:
                      message.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      background:
                        message.role === "assist"
                          ? gradients.primary
                          : gradients.purple,
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                    }}
                  >
                    {message.role === "assist" ? <AIIcon /> : ""}
                  </Avatar>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      maxWidth: "70%",
                      background:
                        message.role === "assist"
                          ? (theme) => theme.palette.grey[100]
                          : (theme) => theme.palette.primary.light,
                      color:
                        message.role === "assist"
                          ? "text.primary"
                          : (theme) => theme.palette.primary.dark,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                    >
                      {message.content}
                    </Typography>
                    {message.role === "assist" && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: 0.5,
                          mt: 1,
                        }}
                      >
                        <Tooltip
                          title={
                            copiedMessageId === message.id
                              ? "Copied"
                              : "Copy message"
                          }
                          arrow
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleCopyMessage(message)}
                            sx={{
                              color: "text.secondary",
                              p: 0.5,
                              "&:hover": {
                                color: "primary.main",
                                backgroundColor: "transparent",
                              },
                            }}
                          >
                            <ContentCopyIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                        {index === lastAssistantMessageIndex && (
                          <Tooltip
                            title={
                              message.finalPrompt?.trim()
                                ? "View final prompt"
                                : "No final prompt available"
                            }
                            arrow
                          >
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleViewFinalPrompt(message)}
                                sx={{
                                  color: "text.secondary",
                                  p: 0.5,
                                  "&:hover": {
                                    color: "primary.main",
                                    backgroundColor: "transparent",
                                  },
                                }}
                              >
                                <DescriptionOutlinedIcon fontSize="inherit" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </Box>
                    )}
                  </Paper>
                </Box>
              </Fade>
            ))}

            {isSending && (
              <Fade in={true}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Avatar
                    sx={{
                      background: gradients.primary,
                      width: 36,
                      height: 36,
                    }}
                  >
                    <AIIcon />
                  </Avatar>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      background: (theme) => theme.palette.grey[100],
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {[0, 1, 2].map((i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            animation: `typing 1.4s infinite ${i * 0.2}s`,
                            "@keyframes typing": {
                              "0%,60%,100%": { opacity: 0.3 },
                              "30%": { opacity: 1 },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Box>
              </Fade>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Fixed Input Area at Bottom */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
              <TextField
                ref={inputRef}
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type your message here..."
                value={query.question}
                onChange={(e) => {
                  setQuery((prev) => ({ ...prev, question: e.target.value }));
                  // setMessages((prev)=>[...prev,{id:Date.now(),role:"user",content:e.target.value}])
                }}
                onKeyPress={handleKeyPress}
                disabled={isSending}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: (theme) => theme.palette.background.default,
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={
                  !query.question.trim() || isSending || !currentConversationId
                }
                sx={{
                  background: gradients.primary,
                  color: "white",
                  width: 48,
                  height: 48,
                  "&:hover": { background: gradients.primary, opacity: 0.9 },
                  "&:disabled": {
                    background: (theme) =>
                      theme.palette.action.disabledBackground,
                    color: (theme) => theme.palette.action.disabled,
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>

            {messages.length === 1 && (
              <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                {[
                  "How can you help me?",
                  "Show my projects",
                  "What can you do?",
                ].map((prompt, index) => (
                  <Chip
                    key={index}
                    label={prompt}
                    onClick={() => {
                      setQuery((prev) => ({
                        ...prev,
                        question: prompt,
                      }));
                      inputRef.current?.focus();
                    }}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        background: gradients.primary,
                        color: "white",
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>

          <Dialog
            open={openPromptDialog}
            onClose={() => setOpenPromptDialog(false)}
            fullWidth
            maxWidth="md"
            scroll="paper"
          >
            <DialogTitle>Final Prompt Used</DialogTitle>
            <DialogContent dividers sx={{ maxHeight: 420 }}>
              <Box
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                {selectedFinalPrompt || "No final prompt available."}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPromptDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};
