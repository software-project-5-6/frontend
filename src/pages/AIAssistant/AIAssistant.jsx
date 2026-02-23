import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import {
  Send as SendIcon,
  AutoAwesome as AIIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { gradients } from "../../styles/theme";
import { useAuth } from "../../context/AuthContext";
import { getAllProjects } from "../../api/projectApi";
import { askProject } from "../../api/chatApi";

export const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "Hello! I'm your AI assistant. How can I help you with your projects today?",
      timestamp: new Date(),
    },
  ]);

  const [isSending, setIsSending] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({ question: "" });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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
      if (data.length > 0) setSelectedProject(data[0].name); // default selection
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

  const getDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.userId) return user.userId.split("-")[0];
    return "User";
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    if (!displayName || displayName === "User") return "U";
    const names = displayName.split(" ");
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return displayName.charAt(0).toUpperCase();
  };

  const handleSendMessage = async () => {
    if (!query.question.trim() || isSending) return;

    const questionText = query.question; // capture BEFORE clearing

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: questionText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery({ question: "" });
    setIsSending(true);

    try {
      const aiText = await askProject(selectedProject, {
        question: questionText,
      });

      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        text: aiText.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setError("Failed to get AI response");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        type: "ai",
        text: "Hello! I'm your AI assistant. How can I help you with your projects today?",
        timestamp: new Date(),
      },
    ]);
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
                onChange={(e) => setSelectedProject(e.target.value)}
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
        <IconButton
          onClick={handleNewChat}
          sx={{
            background: gradients.primary,
            color: "white",
            "&:hover": { background: gradients.primary, opacity: 0.9 },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Scrollable Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              py: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {messages.map((message) => (
              <Fade in={true} key={message.id} timeout={500}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    flexDirection:
                      message.type === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      background:
                        message.type === "ai"
                          ? gradients.primary
                          : gradients.purple,
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                    }}
                  >
                    {message.type === "ai" ? <AIIcon /> : getInitials()}
                  </Avatar>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      maxWidth: "70%",
                      background:
                        message.type === "ai"
                          ? (theme) => theme.palette.grey[100]
                          : gradients.primary,
                      color: message.type === "ai" ? "text.primary" : "white",
                      borderRadius: 2,
                      borderTopLeftRadius: message.type === "ai" ? 0 : 2,
                      borderTopRightRadius: message.type === "user" ? 0 : 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                    >
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 1, opacity: 0.7 }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
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
                      borderRadius: 2,
                      borderTopLeftRadius: 0,
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
                onChange={(e) => setQuery({ question: e.target.value })}
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
                disabled={!query.question.trim() || isSending}
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
                      setQuery({ question: prompt });
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
        </>
      )}
    </Box>
  );
};
