import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
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
import { gradients } from "../../styles/theme";
import { getAllProjects } from "../../api/projectApi";
import { askProject, getAllMessagesForConversation } from "../../api/chatApi";

const markdownComponents = {
  a: ({ ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /language-/.test(className || "");
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        {...props}
        style={{
          background: "rgba(79, 70, 229, 0.08)",
          color: "#4338ca",
          padding: "1px 5px",
          borderRadius: 4,
          fontSize: "0.85em",
        }}
      >
        {children}
      </code>
    );
  },
};

const markdownSx = {
  "& > *:first-of-type": { mt: 0 },
  "& > *:last-child": { mb: 0 },
  "& p": { m: 0, mb: 1, fontSize: "0.875rem", lineHeight: 1.6 },
  "& ul, & ol": { mt: 0, mb: 1, pl: 2.5 },
  "& li": { fontSize: "0.875rem", lineHeight: 1.6, mb: 0.25 },
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    mt: 1.5,
    mb: 0.75,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  "& h1": { fontSize: "1.25rem" },
  "& h2": { fontSize: "1.15rem" },
  "& h3": { fontSize: "1.05rem" },
  "& h4, & h5, & h6": { fontSize: "0.95rem" },
  "& pre": {
    background: "#1e1b2e",
    color: "#e5e7eb",
    p: 1.5,
    borderRadius: 2,
    overflowX: "auto",
    fontSize: "0.8rem",
    my: 1,
  },
  "& pre code": {
    background: "none",
    color: "inherit",
    padding: 0,
    fontSize: "inherit",
  },
  "& blockquote": {
    borderLeft: "3px solid",
    borderColor: "divider",
    m: 0,
    my: 1,
    pl: 1.5,
    color: "text.secondary",
    fontStyle: "italic",
  },
  "& table": {
    borderCollapse: "collapse",
    width: "100%",
    my: 1,
    fontSize: "0.8125rem",
  },
  "& th, & td": {
    border: "1px solid",
    borderColor: "divider",
    p: 0.75,
    textAlign: "left",
  },
  "& th": { fontWeight: 700, background: "rgba(79, 70, 229, 0.06)" },
  "& a": { color: "primary.main" },
  "& hr": { border: "none", borderTop: "1px solid", borderColor: "divider" },
};

const INITIAL_MESSAGE = {
  id: 1,
  role: "assist",
  content:
    "Hello! I'm your AI assistant. How can I help you with your projects today?",
};

export const AIAssistant = ({
  setCurrentProjectWithAssistant,
  currentProjectWithAssistant,
  currentConversationId,
  setCurrentConversationId,
}) => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
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

  // Keep local query conversationId and messages in sync with currentConversationId
  useEffect(() => {
    if (currentConversationId) {
      setQuery((prev) => ({
        ...prev,
        conversationId: currentConversationId,
      }));
      handleGettingConversationMessages(currentConversationId);
    } else {
      setQuery((prev) => ({
        ...prev,
        conversationId: "",
      }));
      setMessages([INITIAL_MESSAGE]);
    }
  }, [currentConversationId]);

  // Keep local query projectId in sync with selectedProject
  useEffect(() => {
    if (selectedProject) {
      setQuery((prev) => ({
        ...prev,
        projectId: selectedProject,
      }));
    }
  }, [selectedProject]);

  // Keep local selectedProject synced with global Sidebar state
  useEffect(() => {
    if (currentProjectWithAssistant?.projectId) {
      setSelectedProject(currentProjectWithAssistant.projectId);
    }
  }, [currentProjectWithAssistant?.projectId]);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProjects();
      const projectList = data || [];
      setProjects(projectList);

      if (currentProjectWithAssistant?.projectId) {
        setSelectedProject(currentProjectWithAssistant.projectId);
      } else if (projectList.length > 0) {
        setSelectedProject(projectList[0].id);
        if (setCurrentProjectWithAssistant) {
          setCurrentProjectWithAssistant({
            ...(currentProjectWithAssistant || {}),
            projectId: projectList[0].id,
            projectName: projectList[0].projectName,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGettingConversationMessages = async (id) => {
    if (!id) return;
    try {
      const response = await getAllMessagesForConversation(id);
      if (response && response.messages && response.messages.length > 0) {
        setMessages(response.messages);
      } else {
        setMessages([INITIAL_MESSAGE]);
      }
    } catch (err) {
      console.error("Failed to load conversation messages:", err);
      setError("Failed to load conversation messages");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!query.question.trim() || isSending) return;
    if (!currentConversationId) {
      setError("Please select or create a conversation from the sidebar first.");
      return;
    }

    const questionText = query.question.trim();
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: questionText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery((prev) => ({
      ...prev,
      question: "",
    }));

    const updatedQuery = {
      projectId: selectedProject,
      conversationId: currentConversationId,
      question: questionText,
    };

    setIsSending(true);
    try {
      const aiText = await askProject(updatedQuery);

      const aiResponse = {
        id: Date.now() + 1,
        role: "assist",
        content: aiText?.answer || "No response received.",
        finalPrompt: aiText?.finalPrompt,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Failed to get AI response:", err);
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
    } catch {
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
  }, []);

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
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
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
                sx={{ mb: 1, ml: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="ai-project-select-label">Current Project</InputLabel>
              <Select
                labelId="ai-project-select-label"
                value={selectedProject}
                label="Current Project"
                onChange={(e) => {
                  const newProjId = e.target.value;
                  setSelectedProject(newProjId);
                  const project = projects.find((p) => p.id === newProjId);
                  if (setCurrentProjectWithAssistant) {
                    setCurrentProjectWithAssistant({
                      ...(currentProjectWithAssistant || {}),
                      projectId: project?.id ?? "",
                      projectName: project?.projectName ?? "",
                    });
                  }
                  if (setCurrentConversationId) {
                    setCurrentConversationId("");
                  }
                  setMessages([INITIAL_MESSAGE]);
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

      {/* Messages Area */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
              <Fade in={true} key={message.id || index} timeout={500}>
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
                    {message.role === "assist" ? (
                      <Box sx={{ ...markdownSx, wordBreak: "break-word" }}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </Box>
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                      >
                        {message.content}
                      </Typography>
                    )}
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
                placeholder={
                  !currentConversationId
                    ? "Select or create a conversation from the sidebar to chat..."
                    : "Type your message here..."
                }
                value={query.question}
                onChange={(e) => {
                  setQuery((prev) => ({ ...prev, question: e.target.value }));
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

            {messages.length <= 1 && (
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

          {/* Prompt Dialog */}
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
