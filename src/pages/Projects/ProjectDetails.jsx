import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Backdrop,
} from "@mui/material";
import {
  Info as InfoIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import EditProjectDialog from "./components/EditProjectDialog";
import ProjectDetailsHeader from "./components/ProjectDetailsHeader";
import ProjectInfoCard from "./components/ProjectInfoCard";
import ProjectStatsCards from "./components/ProjectStatsCards";
import ProjectTeamSection from "./components/ProjectTeamSection";
import ProjectArtifactsSection from "./components/ProjectArtifactsSection";
import InviteUserDialog from "./components/InviteUserDialog";
import PendingInvitations from "./components/PendingInvitations";
import { getProjectById, removeUserFromProject } from "../../api/projectApi";
import { invitationApi } from "../../api/invitationApi";
import { useAuth } from "../../context/AuthContext";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAdmin, userAttributes } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [inviteUserDialogOpen, setInviteUserDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "VIEWER",
  });
  const [refreshInvitations, setRefreshInvitations] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjectById(projectId);
        setProject(data);
        console.log("Fetched project data:", data);
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details. Please try again later.");
        // Optionally redirect back to projects list after a delay
        setTimeout(() => {
          navigate("/projects");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, navigate]);

  // Check if user is APP_ADMIN or MANAGER of this project
  const canInviteMembers = () => {
    // Global admin can always invite
    if (isAdmin()) return true;

    // Check if user is a MANAGER of this specific project
    if (project?.assignedUsers && userAttributes?.email) {
      const userRole = project.assignedUsers.find(
        (user) => user.email === userAttributes.email
      );
      return userRole?.role === "MANAGER";
    }

    return false;
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/projects");
  };

  // Handle edit project
  const handleEditOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSave = async (updatedProject) => {
    console.log("handleEditSave called with:", updatedProject);

    // Refresh from server to get the updated project with all relationships
    try {
      const data = await getProjectById(projectId);
      console.log("Refreshed project data:", data);
      setProject(data);
    } catch (err) {
      console.error("Error refreshing project:", err);
      setError("Failed to refresh project details.");
    }
  };

  // Handle invite user
  const handleInviteOpen = () => {
    setInviteUserDialogOpen(true);
  };

  const handleInviteClose = () => {
    setInviteUserDialogOpen(false);
    setInviteData({ email: "", role: "VIEWER" });
  };

  const handleSendInvite = async () => {
    try {
      // Show loading state
      setSendingInvite(true);

      // Close dialog immediately for better UX
      handleInviteClose();

      // Send invitation in background
      await invitationApi.sendInvitation(projectId, {
        email: inviteData.email,
        role: inviteData.role,
      });
      console.log("Invitation sent:", inviteData);

      // Refresh project data to get updated team list (in background)
      const data = await getProjectById(projectId);
      setProject(data);

      // Trigger refresh of pending invitations
      setRefreshInvitations((prev) => prev + 1);

      // Hide loading state
      setSendingInvite(false);

      // Show success dialog
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error("Error sending invitation to project:", err);
      setSendingInvite(false);
      setError("Failed to send invitation. Please try again.");
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  // Handle remove user
  const handleRemoveUser = async (userId) => {
    try {
      await removeUserFromProject(projectId, userId);
      // Refresh project data to get updated team list
      const data = await getProjectById(projectId);
      setProject(data);
    } catch (err) {
      console.error("Error removing user from project:", err);
      setError("Failed to remove user from project. Please try again.");
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "MANAGER":
        return "error";
      case "CONTRIBUTOR":
        return "primary";
      case "VIEWER":
        return "default";
      default:
        return "default";
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary" align="center">
          Redirecting to projects list...
        </Typography>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Project not found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Component */}
      <ProjectDetailsHeader onBack={handleBack} onEdit={handleEditOpen} />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards Row - Always visible */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <ProjectStatsCards project={project} />
          </Grid>
        </Grid>
      </Box>

      {/* Tabbed Navigation */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.default",
            "& .MuiTab-root": {
              minHeight: 64,
              fontSize: "0.9rem",
              fontWeight: 600,
              textTransform: "none",
              transition: "all 0.3s",
              "&:hover": {
                bgcolor: "action.hover",
              },
            },
            "& .Mui-selected": {
              color: "primary.main",
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab
            icon={<InfoIcon />}
            iconPosition="start"
            label="Project Details"
            sx={{
              gap: 1,
            }}
          />
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label="Team Members"
            sx={{
              gap: 1,
            }}
          />
          <Tab
            icon={<DescriptionIcon />}
            iconPosition="start"
            label="Artifacts"
            sx={{
              gap: 1,
            }}
          />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Tab 0: Project Details */}
          {currentTab === 0 && (
            <Box>
              <ProjectInfoCard project={project} />
            </Box>
          )}

          {/* Tab 1: Team Members */}
          {currentTab === 1 && (
            <Box>
              <ProjectTeamSection
                project={project}
                onInviteOpen={handleInviteOpen}
                onRemoveUser={handleRemoveUser}
                getRoleColor={getRoleColor}
                getInitials={getInitials}
              />

              {/* Pending Invitations Section - Only visible to APP_ADMIN and MANAGER */}
              {canInviteMembers() && (
                <PendingInvitations
                  projectId={projectId}
                  refreshTrigger={refreshInvitations}
                />
              )}
            </Box>
          )}

          {/* Tab 2: Artifacts */}
          {currentTab === 2 && (
            <Box>
              <ProjectArtifactsSection project={project} />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Edit Project Dialog */}
      <EditProjectDialog
        open={editDialogOpen}
        onClose={handleEditClose}
        project={project}
        onUpdate={handleEditSave}
      />

      {/* Invite User Dialog */}
      <InviteUserDialog
        open={inviteUserDialogOpen}
        onClose={handleInviteClose}
        inviteData={inviteData}
        onInviteDataChange={setInviteData}
        onSendInvite={handleSendInvite}
      />

      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        open={sendingInvite}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" color="inherit">
            Sending Invitation...
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
            Please wait while we send the invitation
          </Typography>
        </Box>
      </Backdrop>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={handleSuccessDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            color: "success.main",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 32 }} />
          Invitation Sent Successfully!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            The invitation has been sent successfully. The user will receive an
            email with instructions to join the project.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="contained"
            onClick={handleSuccessDialogClose}
            fullWidth
            color="success"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
