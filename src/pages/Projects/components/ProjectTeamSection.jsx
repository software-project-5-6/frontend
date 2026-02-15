import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Tooltip,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  PersonAddAlt1 as InviteIcon, // Renamed for clarity
  Delete as DeleteIcon,
  WarningAmber as WarningIcon,
  Search as SearchIcon, 
  Group as GroupIcon, // Imported for empty state
} from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";

const ProjectTeamSection = ({
  project,
  onInviteOpen,
  onRemoveUser,
  getRoleColor,
  getInitials,
}) => {
  const { isAdmin, userAttributes } = useAuth();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  // --- NEW: Search State ---
  const [searchQuery, setSearchQuery] = useState("");

  // Permission Logic
  const canInviteMembers = () => {
    if (isAdmin()) return true;
    if (project?.assignedUsers && userAttributes?.email) {
      const currentUserRole = project.assignedUsers.find(
        (user) => user.email === userAttributes.email
      );
      return currentUserRole?.role === "MANAGER";
    }
    return false;
  };

  // --- NEW: Filter Logic ---
  const filteredMembers = project?.assignedUsers?.filter((member) => {
    const query = searchQuery.toLowerCase();
    return (
      (member.fullName && member.fullName.toLowerCase().includes(query)) ||
      (member.email && member.email.toLowerCase().includes(query)) ||
      (member.role && member.role.toLowerCase().includes(query))
    );
  }) || [];

  // Dialog Handlers
  const handleRemoveClick = (member) => { setSelectedMember(member); setConfirmDialogOpen(true); };
  const handleCloseDialog = () => { setConfirmDialogOpen(false); setSelectedMember(null); };
  const handleConfirmRemove = () => {
    if (selectedMember) onRemoveUser(selectedMember.userId);
    handleCloseDialog();
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 0, 
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3
      }}
    >
      {/* --- IMPROVED HEADER --- */}
      <Box sx={{ p: 2.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" gap={2}>
          
          {/* Title and Count */}
          <Box>
            <Typography variant="h6" fontWeight={700}>Team Members</Typography>
            <Typography variant="body2" color="text.secondary">
              {project?.assignedUsers?.length || 0} active members
            </Typography>
          </Box>

          {/* Search and Invite Actions */}
          <Stack direction="row" gap={1.5} alignItems="center" width={{ xs: '100%', sm: 'auto' }}>
            
            {/* SEARCH BAR */}
            <TextField
              placeholder="Search members..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ bgcolor: 'white' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* INVITE BUTTON */}
            {canInviteMembers() && (
              <Button
                variant="contained"
                startIcon={<InviteIcon />}
                onClick={onInviteOpen}
                sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}
              >
                Invite
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* --- TABLE --- */}
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Member</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Role</TableCell>
              {canInviteMembers() && (
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                const isCurrentUser = member.email === userAttributes?.email;
                return (
                  <TableRow key={member.userId} hover>
                    {/* Member Info */}
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main", fontWeight: 600, width: 36, height: 36 }}>
                          {getInitials(member.fullName || member.email)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {member.fullName || "No Name"}
                          </Typography>
                          {isCurrentUser && (
                            <Chip label="You" size="small" color="primary" sx={{ height: 20, fontSize: "0.65rem", mt: 0.5 }} />
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{member.email}</Typography>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <Chip
                        label={member.role}
                        color={getRoleColor(member.role)}
                        size="small"
                        variant={member.role === 'VIEWER' ? 'outlined' : 'filled'}
                        sx={{ fontWeight: 600, minWidth: 80 }}
                      />
                    </TableCell>

                    {/* Actions */}
                    {canInviteMembers() && (
                      <TableCell align="center">
                        {!isCurrentUser && (
                          <Tooltip title="Remove User">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleRemoveClick(member)}
                              sx={{ opacity: 0.7, '&:hover': { opacity: 1, bgcolor: 'error.light', color: 'error.main' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              // --- EMPTY STATE ---
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
                    <GroupIcon sx={{ fontSize: 48, mb: 1, color: 'text.disabled' }} />
                    <Typography variant="body1" color="text.secondary">
                      {searchQuery ? "No members match your search." : "No team members yet."}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog (Unchanged Logic, just styling tweaks) */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "warning.main" }}>
          <WarningIcon /> Confirm Removal
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <b>{selectedMember?.fullName}</b>?
            <br />
            They will lose access to all project artifacts.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmRemove} variant="contained" color="error">Remove Member</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProjectTeamSection;