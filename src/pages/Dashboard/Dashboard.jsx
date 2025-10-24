import React, { useState, useEffect } from "react";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { fetchAuthSession } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Skeleton,
  Button,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { gradients } from "../../styles/theme";

export const Dashboard = () => {
  const [userAttributes, setUserAttributes] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const session = await fetchAuthSession();
      const attributes = await fetchUserAttributes();
      setUserAttributes(attributes);
      const id = session.tokens?.idToken?.toString();
      console.log(id);
      console.log("User attributes:", attributes);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getDisplayName = () => {
    if (userAttributes?.name) {
      return userAttributes.name;
    }
    if (userAttributes?.email) {
      return userAttributes.email.split("@")[0];
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={200} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Welcome Card */}
      <Card
        sx={{
          mb: 4,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          boxShadow: 3,
          borderRadius: 3,
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: gradients.primary,
                fontSize: "2rem",
                fontWeight: "bold",
                boxShadow: (theme) =>
                  `0 4px 20px ${theme.palette.primary.main}40`,
              }}
            >
              {getInitials()}
            </Avatar>

            {/* Welcome Text */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: gradients.primary,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Welcome back, {getDisplayName()}! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {userAttributes?.email ||
                  "Here's what's happening with your projects today"}
              </Typography>
            </Box>

            {/* Dashboard Icon */}
            <DashboardIcon
              sx={{
                fontSize: 60,
                color: "primary.main",
                opacity: 0.3,
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: gradients.purple,
              color: "white",
              boxShadow: (theme) =>
                `0 4px 20px ${theme.palette.primary.main}40`,
              borderRadius: 3,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Projects
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: gradients.pink,
              color: "white",
              boxShadow: "0 4px 20px rgba(240, 147, 251, 0.4)",
              borderRadius: 3,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Tasks
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                8
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: gradients.blue,
              color: "white",
              boxShadow: (theme) => `0 4px 20px ${theme.palette.info.main}40`,
              borderRadius: 3,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                24
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: gradients.green,
              color: "white",
              boxShadow: (theme) =>
                `0 4px 20px ${theme.palette.success.main}40`,
              borderRadius: 3,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Team Members
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                6
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
