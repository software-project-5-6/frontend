import React, { Fragment, useEffect, useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { getAllProjects } from "../api/projectApi"; // Ensure this is imported

const drawerWidth = 240;

export default function Sidebar({
  mobileOpen,
  onMobileClose,
  currentProjectWithAssistant,
  setCurrentProjectWithAssistant,
  currentConversationId,
  setCurrentConversationId,
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
  
  // State for all projects
  const [projects, setProjects] = useState([]);
  
  // State specifically for the "New Chat" dialog dropdown
  const [dialogSelectedProjectId, setDialogSelectedProjectId] = useState("");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // 1. Fetch all projects when Sidebar mounts so the dropdown has data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects for sidebar:", err);
      }
    };
    fetchProjects();
  }, []);

  // 2. Fetch chats ONLY for the currently active project
  useEffect(() => {
    if (currentProjectWithAssistant?.projectId) {
      setConversations([]); // Instantly clear old chats for snappy UX
      handleGettingProjectConversations(currentProjectWithAssistant.projectId);
    } else {
      setConversations([]);
    }
  }, [currentProjectWithAssistant?.projectId]);

  const handleGettingProjectConversations = async (projectId) => {
    try {
      const response = await getAllConversationsForProject(projectId);
      const fetchedChats = response.conversations || [];
      
      setConversations((prevChats) => {
        // Smart merge to prevent newly created chats from disappearing
        const locallyCreatedChats = prevChats.filter(
          (local) => !fetchedChats.some((fetched) => fetched.conversationId === local.conversationId)
        );
        return [...fetchedChats, ...locallyCreatedChats];
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Handle when the user switches projects via the Sidebar Dropdown
 // 3. Handle when the user switches projects via the Sidebar Dropdown
  const handleSidebarProjectSwitch = (e) => {
    const projId = e.target.value;
    const proj = projects.find(p => p.id == projId);
    
    // Add a warning so you know if the parent is missing the prop!
    if (!setCurrentProjectWithAssistant) {
      alert("Developer Error: You forgot to pass 'setCurrentProjectWithAssistant' to the <Sidebar /> in your Layout file!");
      return;
    }

    if (proj) {
      // Merge the state exactly like the AIAssistant does
      setCurrentProjectWithAssistant({
        ...(currentProjectWithAssistant || {}),
        projectId: proj.id,
        projectName: proj.projectName
      });
      setCurrentConversationId(""); // Clear active chat visually
      
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  };

  const handleOpenNewChat = () => {
    setOpenNewChatDialog(true);
    // Pre-fill the dialog dropdown with the currently active project
    if (currentProjectWithAssistant?.projectId) {
      setDialogSelectedProjectId(currentProjectWithAssistant.projectId);
    } else if (projects.length > 0) {
      setDialogSelectedProjectId(projects[0].id);
    }
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
    if (!dialogSelectedProjectId) {
      setError("Please select a project");
      return;
    }
    setError("");
    
    const newConversationObject = {
      projectId: dialogSelectedProjectId,
      title: chatTitle,
    };
    
    setIsCreating(true);
    try {
      const response = await createConversation(newConversationObject);
      
      const newChat = {
        conversationId: response,
        title: chatTitle,
      };

      const isDifferentProject = currentProjectWithAssistant?.projectId != dialogSelectedProjectId;

      if (isDifferentProject) {
        setConversations([newChat]); // Show only the new chat immediately
        
        if (setCurrentProjectWithAssistant) {
          const proj = projects.find(p => p.id == dialogSelectedProjectId);
          if (proj) {
            setCurrentProjectWithAssistant({
              projectId: proj.id,
              projectName: proj.projectName
            });
          }
        }
        
        // Fetch the rest of the history for the newly switched project
        handleGettingProjectConversations(dialogSelectedProjectId);
      } else {
        // Same project: Append directly to list
        setConversations((prev) => {
          if (prev.find(c => c.conversationId === response)) return prev;
          return [...prev, newChat];
        });
      }

      setCurrentConversationId(response);
      setOpenNewChatDialog(false);
      setChatTitle("");
      
      if (location.pathname !== "/") {
        navigate("/");
      }
      
    } catch (err) {
      console.error(err);
      setError("Failed to create conversation");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConversation = async () => {
    const response = await deleteAllMessagesForConversation(
      selectedConversation.conversationId,
    );
    console.log("number of messages deleted:", response);

    setConversations((prev) =>
      prev.filter(
        (c) => c.conversationId !== selectedConversation.conversationId,
      ),
    );
    setOpenDeleteDialog(false);
    
    if (conversations.length > 1) {
       setCurrentConversationId(
         conversations[conversations.length - 2].conversationId,
       );
    } else {
       setCurrentConversationId("");
    }
  };

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

  const getRoleDisplayText = () => {
    if (!userRole) return "Loading...";
    return userRole.replace("APP_", "");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar />
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
      <List sx={{ px: 1, pt: 0, flex: 1 }}>
        {commonMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isAIAssistant = item.text === "AI Assistant";

          return (
            <Fragment key={item.text}>
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                   if (isAIAssistant) {
                      setExpanded(!expanded);
                      handleNavigation(item.path);
                    } else {
                      // FIX: Add this line so clicking "Projects" closes the dropdown!
                      setExpanded(false); 
                      
                      handleNavigation(item.path);
                      setCurrentConversationId("");
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    backgroundColor: isActive ? "primary.light" : "grey.200",
                    color: isActive ? "#000" : "text.primary",
                    "&:hover": {
                      backgroundColor: isActive ? "primary.light" : "grey.300",
                      opacity: isActive ? 0.9 : 1,
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#000" : "text.secondary",
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
                    
                     {/* NEW CHAT BUTTON */}
                    <ListItem disablePadding sx={{ mb: 0.5, px: 2, pt: 1 }}>
                      <ListItemButton
                        onClick={handleOpenNewChat}
                        sx={{
                          borderRadius: 2,
                          py: 1,
                          backgroundColor: "grey.100",
                          "&:hover": { backgroundColor: "grey.200" },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Add />
                        </ListItemIcon>
                        <ListItemText
                          primary="New Chat"
                          primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 600 }}
                        />
                      </ListItemButton>
                      
                      {/* NEW CHAT DIALOG */}
                      <Dialog
                        open={openNewChatDialog}
                        onClose={handleCloseNewChat}
                        maxWidth="sm"
                        fullWidth
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
                            sx={{ mb: 3 }}
                          />
                          
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="project-select-label">Assign to Project</InputLabel>
                            <Select
                              labelId="project-select-label"
                              value={dialogSelectedProjectId}
                              label="Assign to Project"
                              onChange={(e) => setDialogSelectedProjectId(e.target.value)}
                            >
                              {projects.map((project) => (
                                <MenuItem key={project.id} value={project.id}>
                                  {project.projectName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseNewChat}>Cancel</Button>
                          {isCreating ? (
                            <CircularProgress size={24} sx={{ mx: 2 }} />
                          ) : (
                            <Button
                              onClick={handleCreateChat}
                              variant="contained"
                              color="primary"
                            >
                              Create
                            </Button>
                          )}
                        </DialogActions>
                      </Dialog>
                    </ListItem>

                    {/* DYNAMIC CHAT LIST HEADER */}
                    <Box sx={{ mt: 2, mb: 1, px: 2 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 700, 
                          color: 'text.secondary', 
                          textTransform: 'uppercase',
                          letterSpacing: 0.5 
                        }}
                      >
                        {currentProjectWithAssistant?.projectName 
                          ? `Chats for ${currentProjectWithAssistant.projectName}` 
                          : "Chats"}
                      </Typography>
                    </Box>
                    {/* ========================================================= */}
                    {/* CATEGORY DROPDOWN: Select Project to view its chats       */}
                    {/* ========================================================= */}
                    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="sidebar-project-filter">Project Category</InputLabel>
                        <Select
                          labelId="sidebar-project-filter"
                          value={currentProjectWithAssistant?.projectId || ""}
                          label="Project Category"
                          onChange={handleSidebarProjectSwitch}
                          sx={{
                            backgroundColor: 'background.paper',
                            borderRadius: 1,
                            fontWeight: 600,
                          }}
                        >
                          {projects.length === 0 && (
                             <MenuItem value="" disabled>Loading projects...</MenuItem>
                          )}
                          {projects.map((project) => (
                            <MenuItem key={project.id} value={project.id}>
                              {project.projectName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                   

                    {/* CHAT LIST */}
                    {conversations?.map((c) => (
                      <ListItem
                        key={c.conversationId}
                        disablePadding
                        sx={{
                          mb: 0.5,
                          px: 2,
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
                            borderRadius: 2,
                            py: 1,
                            backgroundColor:
                              currentConversationId === c.conversationId
                                ? "rgba(25, 118, 210, 0.15)" 
                                : "transparent",

                            "&:hover": {
                              backgroundColor:
                                currentConversationId === c.conversationId
                                  ? "rgba(25, 118, 210, 0.25)"
                                  : "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <ListItemText
                            primary={c.title}
                            primaryTypographyProps={{ 
                              fontSize: "0.85rem",
                              fontWeight: currentConversationId === c.conversationId ? 600 : 400
                            }}
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
                              opacity: 0, 
                              transition: "0.2s",
                            }}
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </IconButton>
                        </ListItemButton>
                      </ListItem>
                    ))}
                    
                    {/* EMPTY STATE */}
                    {conversations.length === 0 && currentProjectWithAssistant?.projectId && (
                      <Typography variant="body2" color="text.secondary" sx={{ px: 3, py: 1, fontStyle: 'italic' }}>
                        No chats for this project yet.
                      </Typography>
                    )}

                    {/* DELETE DIALOG */}
                    <Dialog
                      open={openDeleteDialog}
                      onClose={() => setOpenDeleteDialog(false)}
                    >
                      <DialogTitle>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                          Delete Conversation
                        </Box>
                      </DialogTitle>
                      <DialogContent>
                        <Typography>
                          Are you sure you want to delete{" "}
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 600,
                              color: "error.main",
                            }}
                          >
                            "{selectedConversation?.title}"
                          </Typography>
                          ? This cannot be undone.
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
                    py: 1.5,
                    backgroundColor: isActive ? "error.light" : "grey.200",
                    color: isActive ? "#000" : "text.primary",
                    "&:hover": {
                      backgroundColor: isActive ? "error.light" : "grey.300",
                      opacity: isActive ? 0.9 : 1,
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#000" : "text.secondary",
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
      <Box sx={{ px: 2, pb: 2 }}>
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
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
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

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
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