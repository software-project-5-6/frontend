import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Chip,
  Button,
  TextField,
  Alert,
  Stack,
  CircularProgress,
  IconButton,
  InputAdornment,
  Container,
  Paper,
} from "@mui/material";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Palette as PaletteIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";
import { supabase } from "../../supabaseClient";
import api from "../../api/axiosConfig";

export default function Settings() {
  const navigate = useNavigate();
  const { user, dbUser, userRole, isAdmin, loading: authLoading } = useAuth();
  const { mode, setThemeMode } = useThemeMode();

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ type: "", message: "" });

  // Admin Health check state
  const [backendStatus, setBackendStatus] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Handle password update via Supabase
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordFeedback({ type: "", message: "" });

    if (!newPassword) {
      setPasswordFeedback({ type: "error", message: "Please enter a new password." });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFeedback({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: "error",
        message: "Passwords do not match. Please re-enter.",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setPasswordFeedback({
        type: "success",
        message: "Your password has been updated successfully in Supabase.",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Supabase password update failed:", err);
      setPasswordFeedback({
        type: "error",
        message: err.message || "Failed to update password. Please check your session.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle real sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // Handle real admin health ping
  const handleCheckHealth = async () => {
    setIsCheckingHealth(true);
    const start = performance.now();
    try {
      const res = await api.get("/health");
      const elapsed = Math.round(performance.now() - start);
      setBackendStatus({
        ok: res.status === 200,
        status: res.status,
        latency: elapsed,
        checkedAt: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setBackendStatus({
        ok: false,
        status: err?.response?.status || "Offline",
        latency: elapsed,
        checkedAt: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const displayName = dbUser?.fullName || user?.user_metadata?.full_name || "Workspace User";
  const displayEmail = user?.email || dbUser?.email || "No email available";
  const isUserAdmin = isAdmin();

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Settings
          </Typography>
          {isUserAdmin ? (
            <Chip
              icon={<AdminPanelSettingsIcon sx={{ fontSize: "15px !important" }} />}
              label="Administrator"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            />
          ) : (
            <Chip
              label="Personal Settings"
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: 1.5 }}
            />
          )}
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your appearance preferences, account details, and security credentials.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* 1. APPEARANCE (WORKING THEME SWITCHER) */}
        <Card elevation={1}>
          <CardHeader
            avatar={
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.light",
                  color: "primary.dark",
                }}
              >
                <PaletteIcon />
              </Box>
            }
            title={
              <Typography variant="h6" fontWeight={700}>
                Appearance
              </Typography>
            }
            subheader="Select a theme mode to customize the entire workspace appearance"
            action={
              <Chip
                label={mode === "dark" ? "Dark Mode Active" : "Light Mode Active"}
                size="small"
                color={mode === "dark" ? "secondary" : "primary"}
                sx={{ mt: 1, fontWeight: 700 }}
              />
            }
          />
          <Divider />
          <CardContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              {/* Light Mode Card Option */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  onClick={() => setThemeMode("light")}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    cursor: "pointer",
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor: mode === "light" ? "primary.main" : "divider",
                    bgcolor: mode === "light" ? "primary.light" : "background.paper",
                    transition: "all 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        bgcolor: "#fef3c7",
                        color: "#d97706",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LightModeIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Light Mode
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Clean white workspace with royal purple accents
                      </Typography>
                    </Box>
                  </Box>
                  {mode === "light" && (
                    <CheckCircleIcon color="primary" sx={{ fontSize: 24 }} />
                  )}
                </Paper>
              </Grid>

              {/* Dark Mode Card Option */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  onClick={() => setThemeMode("dark")}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    cursor: "pointer",
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor: mode === "dark" ? "primary.main" : "divider",
                    bgcolor: mode === "dark" ? "rgba(99, 102, 241, 0.15)" : "background.paper",
                    transition: "all 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        bgcolor: "#312e81",
                        color: "#a5b4fc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <DarkModeIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Dark Mode
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sleek dark slate palette for low-light comfort
                      </Typography>
                    </Box>
                  </Box>
                  {mode === "dark" && (
                    <CheckCircleIcon color="primary" sx={{ fontSize: 24 }} />
                  )}
                </Paper>
              </Grid>
            </Grid>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2 }}
            >
              Changes take effect immediately across all application pages, navigation, and dialogs, and persist in your browser.
            </Typography>
          </CardContent>
        </Card>

        {/* 2. MY ACCOUNT */}
        <Card elevation={1}>
          <CardHeader
            avatar={
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.light",
                  color: "primary.dark",
                }}
              >
                <PersonIcon />
              </Box>
            }
            title={
              <Typography variant="h6" fontWeight={700}>
                My Account
              </Typography>
            }
            subheader="Authenticated profile details retrieved from Supabase and Render backend"
            action={
              <Button
                variant="outlined"
                size="small"
                startIcon={<AccountCircleIcon />}
                onClick={() => navigate("/profile")}
                sx={{ mt: 1 }}
              >
                View Profile
              </Button>
            }
          />
          <Divider />
          <CardContent sx={{ pt: 3 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  FULL NAME
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                  {displayName}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  EMAIL ADDRESS
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5, wordBreak: "break-all" }}>
                  {displayEmail}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  GLOBAL ROLE
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={userRole || "APP_USER"}
                    color={isUserAdmin ? "error" : "primary"}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 3. CHANGE PASSWORD */}
        <Card elevation={1}>
          <CardHeader
            avatar={
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#fee2e2",
                  color: "#991b1b",
                }}
              >
                <LockIcon />
              </Box>
            }
            title={
              <Typography variant="h6" fontWeight={700}>
                Change Password
              </Typography>
            }
            subheader="Update your authenticated password securely via Supabase Auth"
          />
          <Divider />
          <CardContent sx={{ pt: 3 }}>
            {passwordFeedback.message && (
              <Alert
                severity={passwordFeedback.type === "success" ? "success" : "error"}
                onClose={() => setPasswordFeedback({ type: "", message: "" })}
                sx={{ mb: 3 }}
              >
                {passwordFeedback.message}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordChange}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isUpdatingPassword}
                    required
                    helperText="Minimum 6 characters"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isUpdatingPassword}
                    required
                    helperText="Must match new password"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isUpdatingPassword}
                    startIcon={
                      isUpdatingPassword ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <LockIcon />
                      )
                    }
                  >
                    {isUpdatingPassword ? "Updating Password..." : "Update Password"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* 4. SESSION & LOGOUT */}
        <Card elevation={1}>
          <CardHeader
            avatar={
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.light",
                  color: "primary.dark",
                }}
              >
                <SecurityIcon />
              </Box>
            }
            title={
              <Typography variant="h6" fontWeight={700}>
                Session & Sign Out
              </Typography>
            }
            subheader="Terminate your active session on this device"
          />
          <Divider />
          <CardContent sx={{ pt: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Active Session ({displayEmail})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Secured via Supabase Authentication with HTTPS Bearer Tokens.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* 5. ADMINISTRATOR TOOLS (AUTHORIZED & FUNCTIONAL — APP_ADMIN ONLY) */}
        {isUserAdmin && (
          <Card elevation={1}>
            <CardHeader
              avatar={
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.light",
                    color: "primary.dark",
                  }}
                >
                  <AdminPanelSettingsIcon />
                </Box>
              }
              title={
                <Typography variant="h6" fontWeight={700}>
                  Administrator Tools
                </Typography>
              }
              subheader="Backend-authorized administrator management and diagnostics"
              action={
                <Chip
                  label="APP_ADMIN Authorized"
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ mt: 1, fontWeight: 700 }}
                />
              }
            />
            <Divider />
            <CardContent sx={{ pt: 3 }}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      User Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Review all registered workspace users, inspect global roles, and manage invitations.
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PeopleIcon />}
                      onClick={() => navigate("/users")}
                    >
                      Open User Management
                    </Button>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700}>
                        Backend Health Diagnostic
                      </Typography>
                      {backendStatus && (
                        <Chip
                          label={backendStatus.ok ? `${backendStatus.latency}ms` : "Issue"}
                          color={backendStatus.ok ? "success" : "error"}
                          size="small"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Perform a real-time connectivity ping to the Render Spring Boot <code>/health</code> API.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleCheckHealth}
                      disabled={isCheckingHealth}
                      startIcon={
                        isCheckingHealth ? (
                          <CircularProgress size={14} />
                        ) : (
                          <RefreshIcon />
                        )
                      }
                    >
                      {isCheckingHealth ? "Pinging..." : "Run Health Check"}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
