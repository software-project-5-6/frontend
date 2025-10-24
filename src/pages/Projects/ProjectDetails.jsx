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
} from "@mui/material";
import {
  Info as InfoIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import EditProjectDialog from "./EditProjectDialog";
import ProjectDetailsHeader from "./components/ProjectDetailsHeader";
import ProjectInfoCard from "./components/ProjectInfoCard";
import ProjectStatsCards from "./components/ProjectStatsCards";
import ProjectTeamSection from "./components/ProjectTeamSection";
import ProjectArtifactsSection from "./components/ProjectArtifactsSection";
import AddUserDialog from "./components/AddUserDialog";

// Dummy projects data (same as ProjectList)
const dummyProjects = [
  {
    id: 1,
    name: "E-Commerce Platform",
    artifactCount: 45,
    clientEmail: "john.doe@ecommerce.com",
    clientPhone: "+1 234-567-8900",
    usersCount: 8,
    createdDate: "2024-01-15",
    status: "Active",
    price: "$45,000",
    description: "Full-stack e-commerce platform with payment integration",
    users: [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        role: "MANAGER",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        role: "CONTRIBUTOR",
      },
      {
        id: 3,
        name: "Mike Wilson",
        email: "mike.w@example.com",
        role: "CONTRIBUTOR",
      },
      {
        id: 4,
        name: "Emily Brown",
        email: "emily.b@example.com",
        role: "VIEWER",
      },
      {
        id: 5,
        name: "David Lee",
        email: "david.l@example.com",
        role: "CONTRIBUTOR",
      },
      {
        id: 6,
        name: "Lisa Garcia",
        email: "lisa.g@example.com",
        role: "VIEWER",
      },
      {
        id: 7,
        name: "Tom Anderson",
        email: "tom.a@example.com",
        role: "MANAGER",
      },
      {
        id: 8,
        name: "Anna Martinez",
        email: "anna.m@example.com",
        role: "CONTRIBUTOR",
      },
    ],
  },
  {
    id: 2,
    name: "Mobile Banking App",
    artifactCount: 32,
    clientEmail: "sarah.smith@bank.com",
    clientPhone: "+1 234-567-8901",
    usersCount: 5,
    createdDate: "2024-02-20",
    status: "Active",
    price: "$32,500",
    description: "Secure mobile banking application for iOS and Android",
    users: [
      {
        id: 1,
        name: "Robert Taylor",
        email: "robert.t@example.com",
        role: "MANAGER",
      },
      {
        id: 2,
        name: "Jennifer White",
        email: "jennifer.w@example.com",
        role: "CONTRIBUTOR",
      },
      {
        id: 3,
        name: "Daniel Brown",
        email: "daniel.b@example.com",
        role: "CONTRIBUTOR",
      },
      {
        id: 4,
        name: "Michelle Davis",
        email: "michelle.d@example.com",
        role: "VIEWER",
      },
      {
        id: 5,
        name: "Kevin Moore",
        email: "kevin.m@example.com",
        role: "CONTRIBUTOR",
      },
    ],
  },
  // Add more dummy data as needed
];

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "VIEWER",
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Fetch project details
  useEffect(() => {
    // TODO: Replace with actual API call
    const foundProject = dummyProjects.find(
      (p) => p.id === parseInt(projectId)
    );
    if (foundProject) {
      setProject(foundProject);
    } else {
      // If project not found, redirect back
      navigate("/projects");
    }
  }, [projectId, navigate]);

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

  const handleEditSave = (updatedProject) => {
    // TODO: Implement API call to update project
    console.log("Update project:", updatedProject);
    setProject({ ...project, ...updatedProject });
  };

  // Handle add user
  const handleAddUserOpen = () => {
    setAddUserDialogOpen(true);
  };

  const handleAddUserClose = () => {
    setAddUserDialogOpen(false);
    setNewUser({ name: "", email: "", role: "VIEWER" });
  };

  const handleAddUser = () => {
    // TODO: Implement API call to add user to project
    const newUserWithId = {
      ...newUser,
      id: project.users.length + 1,
    };
    console.log("Add user to project:", newUserWithId);

    setProject({
      ...project,
      users: [...project.users, newUserWithId],
      usersCount: project.users.length + 1,
    });

    handleAddUserClose();
  };

  // Handle remove user
  const handleRemoveUser = (userId) => {
    // TODO: Implement API call to remove user from project
    console.log("Remove user:", userId);

    setProject({
      ...project,
      users: project.users.filter((u) => u.id !== userId),
      usersCount: project.users.length - 1,
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Pending":
        return "warning";
      case "Completed":
        return "info";
      default:
        return "default";
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

  if (!project) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Loading project details...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Component */}
      <ProjectDetailsHeader onBack={handleBack} onEdit={handleEditOpen} />

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
              <ProjectInfoCard
                project={project}
                getStatusColor={getStatusColor}
              />
            </Box>
          )}

          {/* Tab 1: Team Members */}
          {currentTab === 1 && (
            <Box>
              <ProjectTeamSection
                project={project}
                onAddUserOpen={handleAddUserOpen}
                onRemoveUser={handleRemoveUser}
                getRoleColor={getRoleColor}
                getInitials={getInitials}
              />
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
        onSave={handleEditSave}
      />

      {/* Add User Dialog */}
      <AddUserDialog
        open={addUserDialogOpen}
        onClose={handleAddUserClose}
        newUser={newUser}
        onUserChange={setNewUser}
        onAddUser={handleAddUser}
      />
    </Container>
  );
}
