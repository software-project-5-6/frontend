import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Skeleton,
  Fade,
  Chip,
} from "@mui/material";
import {
  Send as SendIcon,
  AutoAwesome as AIIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { gradients } from "../../styles/theme";
import { useAuth } from "../../context/AuthContext";

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
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getDisplayName = () => {
    if (user?.username) {
      return user.username;
    }
    if (user?.userId) {
      return user.userId.split("-")[0];
    }
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
    if (!inputMessage.trim() || isSending) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        text: getAIResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsSending(false);
    }, 1000);
  };

  const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes("project") || input.includes("projects")) {
      return "I can help you manage your projects! You can create new projects, view existing ones, or analyze project data. What would you like to do?";
    } else if (input.includes("help") || input.includes("what can you do")) {
      return "I can assist you with:\n• Managing projects and tasks\n• Analyzing artifacts\n• Team collaboration\n• Generating reports\n• Answering questions about your work\n\nWhat would you like help with?";
    } else if (input.includes("hello") || input.includes("hi")) {
      return `Hello ${getDisplayName()}! How can I assist you today?`;
    } else {
      return "I understand you're asking about that. I'm here to help with your project management needs. Could you provide more details about what you'd like to know?";
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              background: gradients.primary,
              width: 40,
              height: 40,
            }}
          >
            <AIIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              AI Assistant
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Always ready to help
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleNewChat}
          sx={{
            background: gradients.primary,
            color: "white",
            "&:hover": {
              background: gradients.primary,
              opacity: 0.9,
            },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Messages Area */}
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
        {messages.map((message, index) => (
          <Fade in={true} key={message.id} timeout={500}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
                flexDirection: message.type === "user" ? "row-reverse" : "row",
              }}
            >
              {/* Avatar */}
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

              {/* Message Content */}
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
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    opacity: 0.7,
                  }}
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

        {/* Typing Indicator */}
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
                  <Box
                    className="typing-dot"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      animation: "typing 1.4s infinite",
                      "@keyframes typing": {
                        "0%, 60%, 100%": { opacity: 0.3 },
                        "30%": { opacity: 1 },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      animation: "typing 1.4s infinite 0.2s",
                      "@keyframes typing": {
                        "0%, 60%, 100%": { opacity: 0.3 },
                        "30%": { opacity: 1 },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      animation: "typing 1.4s infinite 0.4s",
                      "@keyframes typing": {
                        "0%, 60%, 100%": { opacity: 0.3 },
                        "30%": { opacity: 1 },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Box>
          </Fade>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 3,
          background: (theme) => theme.palette.background.paper,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
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
            disabled={!inputMessage.trim() || isSending}
            sx={{
              background: gradients.primary,
              color: "white",
              width: 48,
              height: 48,
              "&:hover": {
                background: gradients.primary,
                opacity: 0.9,
              },
              "&:disabled": {
                background: (theme) => theme.palette.action.disabledBackground,
                color: (theme) => theme.palette.action.disabled,
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            {[
              "How can you help me?",
              "Show my projects",
              "What can you do?",
            ].map((prompt, index) => (
              <Chip
                key={index}
                label={prompt}
                onClick={() => {
                  setInputMessage(prompt);
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
    </Box>
  );
};
