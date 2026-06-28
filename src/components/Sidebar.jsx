import React, { Fragment, useEffect, useState, useRef } from "react";
import { Collapse } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  TextField,
  Box,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Add,
  Folder as ProjectIcon,
  People as UsersIcon,
  AutoAwesome as AIIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { gradients } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import { ShowForAdmin } from "./RoleBasedComponents";
import {
  createConversation,
  getAllConversationsForProject,
  deleteAllMessagesForConversation,
} from "../api/chatApi";

const drawerWidth = 240;

export default function Sidebar({
  mobileOpen,
  onMobileClose,
  currentProjectWithAssistant,
  currentConversationId,
  setCurrentConversationId,
  assistantActivated,
  setAssistantActivated,
  onActivateAssistant,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, isAdmin } = useAuth();

  const [expanded, setExpanded] = useState(false);
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const cancelBtnRef = useRef(null);
  const createBtnRef = useRef(null);

  const handleDialogKeyDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        createBtnRef.current?.focus();
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      cancelBtnRef.current?.focus();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      createBtnRef.current?.focus();
    }
  };

  useEffect(() => {
    handleGettingProjectConversations();
  }, [currentProjectWithAssistant?.projectId]);

  useEffect(() => {
    if (assistantActivated) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [assistantActivated]);

  const handleGettingProjectConversations = async () => {
    if (!currentProjectWithAssistant?.projectId) {
      setConversations([]);
      setCurrentConversationId("");
      return;
    }
    const response = await getAllConversationsForProject(
      currentProjectWithAssistant.projectId,
    );
    const projectConversations = response.conversations || [];
    setConversations(projectConversations);

    const hasCurrentConversation = projectConversations.some(
      (conversation) => conversation.conversationId === currentConversationId,
    );

    if (!hasCurrentConversation) {
      setCurrentConversationId(projectConversations[0]?.conversationId || "");
    }
    console.log(response);
  };

  const handleOpenNewChat = () => {
    setOpenNewChatDialog(true);
  };

  const handleCloseNewChat = () => {
    setOpenNewChatDialog(false);
    setError("");
    setChatTitle("");
  };

  const handleCreateChat = async () => {
    if (!chatTitle.trim()) {
      setError("Please enter a chat title");
      return;
    }
    if (!currentProjectWithAssistant?.projectId) {
      setError("Please select a project first");
      return;
    }
    setError("");
    const newConversationObject = {
      projectId: currentProjectWithAssistant.projectId,
      title: chatTitle,
    };
    console.log(newConversationObject);
    setIsCreating(true);
    const response = await createConversation(newConversationObject);
    setConversations((prev) => [
      ...prev,
      {
        conversationId: response,
        title: chatTitle,
      },
    ]);
    setCurrentConversationId(response);

    setIsCreating(false);
    setOpenNewChatDialog(false);
    setChatTitle("");
    setError("");
    console.log("response:", response);
  };

  const handleDeleteConversation = async () => {
    const conversationToDelete = selectedConversation?.conversationId;
    if (!conversationToDelete) {
      setOpenDeleteDialog(false);
      return;
    }

    const response =
      await deleteAllMessagesForConversation(conversationToDelete);
    console.log("number of messages deleted:", response);

    const remainingConversations = conversations.filter(
      (conversation) => conversation.conversationId !== conversationToDelete,
    );

    setConversations(remainingConversations);
    setOpenDeleteDialog(false);

    if (currentConversationId === conversationToDelete) {
      setCurrentConversationId(remainingConversations[0]?.conversationId || "");
    }
  };

  // Menu items visible to all authenticated users
  const commonMenuItems = [
    {
      text: "AI Assistant",
      icon: <AIIcon />,
      path: "/",
    },
    {
      text: "Projects",
      icon: <ProjectIcon />,
      path: "/projects",
    },
  ];

  // Menu items visible only to admins
  const adminMenuItems = [
    {
      text: "Users",
      icon: <UsersIcon />,
      path: "/users",
      adminOnly: true,
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      adminOnly: true,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Format role display text
  const getRoleDisplayText = () => {
    if (!userRole) return "Loading...";
    return userRole.replace("APP_", "");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar /> {/* Spacer for AppBar */}
      {/* User Role Badge - at top */}
      <Box sx={{ px: 2, pt: 1, pb: 2 }}>
        <Chip
          label={getRoleDisplayText()}
          size="small"
          color={isAdmin() ? "error" : "primary"}
          sx={{
            fontWeight: 600,
            fontSize: "0.65rem",
            height: "20px",
            textTransform: "uppercase",
            letterSpacing: 0.3,
          }}
        />
      </Box>
      {/* Main Navigation */}
      <List sx={{ px: 1, pt: 0, flex: 1 }}>
        {/* Common menu items - visible to all */}
        {commonMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isAIAssistant = item.text === "AI Assistant";

          return (
            <Fragment key={item.text}>
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    if (isAIAssistant) {
                      if (!assistantActivated) {
                        onActivateAssistant?.();
                      }
                      setExpanded(!expanded);
                      handleNavigation(item.path);
                    } else {
                      handleNavigation(item.path);
                      setCurrentConversationId("");
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    backgroundColor: isActive ? "primary.light" : "transparent",
                    color: isActive ? "primary.main" : "text.primary",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "primary.light"
                        : "action.hover",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "primary.main" : "text.secondary",
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.9rem",
                    }}
                  />
                  {isAIAssistant && (
                    <ListItemIcon sx={{ minWidth: 0 }}>
                      {expanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </ListItem>
              {isAIAssistant && (
                <Collapse
                  in={expanded}
                  timeout="auto"
                  unmountOnExit
                  sx={{ mb: 2 }}
                >
                  <List component="div" disablePadding>
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={handleOpenNewChat}
                        sx={{
                          pl: 4,
                          borderRadius: 2,
                          py: 1,
                          backgroundColor: "transparent",
                          color: "text.primary",
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                      >
                        <ListItemIcon>
                          <Add />
                        </ListItemIcon>
                        <ListItemText
                          primary="New Chat"
                          primaryTypographyProps={{ fontSize: "0.85rem" }}
                        />
                      </ListItemButton>
                      <Dialog
                        open={openNewChatDialog}
                        onClose={handleCloseNewChat}
                        onKeyDown={handleDialogKeyDown}
                      >
                        <Box
                          component="form"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateChat();
                          }}
                        >
                          <DialogTitle>Start New Chat</DialogTitle>
                          <DialogContent>
                            <p>Create a new conversation</p>
                            {error && (
                              <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                              </Alert>
                            )}
                            <TextField
                              autoFocus
                              margin="dense"
                              label="Chat Title"
                              fullWidth
                              variant="outlined"
                              value={chatTitle}
                              onChange={(e) => setChatTitle(e.target.value)}
                              sx={{ mb: 2 }}
                            />
                            <TextField
                              margin="dense"
                              label="Selected Project"
                              fullWidth
                              variant="outlined"
                              value={
                                currentProjectWithAssistant?.projectName ||
                                "No project selected"
                              }
                              InputProps={{
                                readOnly: true,
                              }}
                              sx={{ mb: 2 }}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button
                              ref={cancelBtnRef}
                              type="button"
                              onClick={handleCloseNewChat}
                            >
                              Cancel
                            </Button>
                            {isCreating ? (
                              <CircularProgress size={24} sx={{ mx: 2 }} />
                            ) : (
                              <Button
                                ref={createBtnRef}
                                type="submit"
                                variant="contained"
                                color="primary"
                              >
                                Create
                              </Button>
                            )}
                          </DialogActions>
                        </Box>
                      </Dialog>
                    </ListItem>
                    <Typography variant="caption" sx={{ mb: 1, mt: 4, ml: 2 }}>
                      Recent
                    </Typography>
                    {conversations?.map((c) => (
                      <ListItem
                        disablePadding
                        sx={{
                          mb: 0.5,
                          "&:hover .delete-btn": {
                            opacity: 1,
                          },
                        }}
                      >
                        <ListItemButton
                          onClick={() => {
                            setCurrentConversationId(c.conversationId);
                            navigate("/");
                          }}
                          sx={{
                            pl: 4,
                            borderRadius: 2,
                            py: 1,
                            backgroundColor:
                              currentConversationId === c.conversationId
                                ? "primary.light"
                                : "transparent",
                            color:
                              currentConversationId === c.conversationId
                                ? "primary.main"
                                : "text.secondary",
                            "&:hover": {
                              backgroundColor:
                                currentConversationId === c.conversationId
                                  ? "primary.light"
                                  : "action.hover",
                            },
                          }}
                        >
                          <ListItemText
                            primary={c.title}
                            primaryTypographyProps={{ fontSize: "0.85rem" }}
                          />
                          <IconButton
                            className="delete-btn"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedConversation(c);
                              setOpenDeleteDialog(true);
                            }}
                            sx={{
                              opacity: 0, // hidden by default
                              transition: "0.2s",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemButton>
                      </ListItem>
                    ))}
                    <Dialog
                      open={openDeleteDialog}
                      onClose={() => setOpenDeleteDialog(false)}
                    >
                      <DialogTitle>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                          Delete Conversation
                        </Box>
                      </DialogTitle>
                      <DialogContent>
                        <Typography>
                          Are you sure you want to delete{" "}
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 400,
                              color: "error.main",
                            }}
                          >
                            "{selectedConversation?.title}"
                          </Typography>
                          ?
                        </Typography>
                      </DialogContent>

                      <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>
                          Cancel
                        </Button>

                        <Button
                          color="error"
                          variant="contained"
                          onClick={handleDeleteConversation}
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </List>
                </Collapse>
              )}
            </Fragment>
          );
        })}

        {/* Admin-only menu items */}
        <ShowForAdmin>
          <Divider sx={{ mx: 2, my: 2 }} />
          <ListItem sx={{ px: 2, mb: 1 }}>
            <ListItemText
              primary="Admin Tools"
              primaryTypographyProps={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            />
          </ListItem>

          {adminMenuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    backgroundColor: isActive ? "error.light" : "transparent",
                    color: isActive ? "error.main" : "text.primary",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "error.light"
                        : "action.hover",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "error.main" : "text.secondary",
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.9rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </ShowForAdmin>
      </List>
      {/* Bottom Section */}
      <Box sx={{ px: 2, pb: 2 }}>
        {/* Help Section */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: gradients.primary,
            color: "white",
            textAlign: "center",
            cursor: "pointer",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <Box sx={{ fontSize: "0.75rem", opacity: 0.9, mb: 0.5 }}>
            Need Help?
          </Box>
          <Box sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
            Contact Support
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid",
            borderColor: "divider",
            transition:
              "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
          },
        }}
        transitionDuration={{
          enter: 300,
          exit: 250,
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid",
            borderColor: "divider",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
