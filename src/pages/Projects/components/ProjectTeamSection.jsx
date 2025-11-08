// import React from "react";
// import {
//   Paper,
//   Box,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Tooltip,
//   Avatar,
// } from "@mui/material";
// import {
//   People as PeopleIcon,
//   PersonAdd as PersonAddIcon,
//   Delete as DeleteIcon,
// } from "@mui/icons-material";
// import { gradients } from "../../../styles/theme";
// import { ShowForAdmin } from "../../../components/RoleBasedComponents";

// export default function ProjectTeamSection({
//   project,
//   onInviteOpen,
//   onRemoveUser,
//   getRoleColor,
//   getInitials,
// }) {
//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         borderRadius: 3,
//         overflow: "hidden",
//         border: "1px solid",
//         borderColor: "divider",
//       }}
//     >
//       {/* Section Header - More professional */}
//       <Box
//         sx={{
//           background: gradients.primary,
//           color: "white",
//           p: 2.5,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           flexWrap: "wrap",
//           gap: 2,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Box
//             sx={{
//               bgcolor: "rgba(255, 255, 255, 0.2)",
//               borderRadius: 2,
//               p: 1.5,
//               display: "flex",
//               backdropFilter: "blur(10px)",
//             }}
//           >
//             <PeopleIcon sx={{ fontSize: 28 }} />
//           </Box>
//           <Box>
//             <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>
//               Project Team
//             </Typography>
//             <Typography variant="caption" sx={{ opacity: 0.9 }}>
//               {project.users?.length || 0} member
//               {project.users?.length !== 1 ? "s" : ""} • Manage access & roles
//             </Typography>
//           </Box>
//         </Box>
//         {/* Invite Member Button - Admin Only */}
//         <ShowForAdmin>
//           <Button
//             variant="contained"
//             startIcon={<PersonAddIcon />}
//             onClick={onInviteOpen}
//             sx={{
//               bgcolor: "white",
//               color: "primary.main",
//               fontWeight: 600,
//               boxShadow: 2,
//               "&:hover": {
//                 bgcolor: "grey.50",
//                 boxShadow: 4,
//               },
//             }}
//           >
//             Invite Member
//           </Button>
//         </ShowForAdmin>
//       </Box>

//       {/* Users Table - Enhanced styling */}
//       <TableContainer sx={{ maxHeight: 600 }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell
//                 sx={{
//                   fontWeight: 700,
//                   bgcolor: "background.default",
//                   borderBottom: 2,
//                   borderColor: "divider",
//                   fontSize: "0.75rem",
//                   textTransform: "uppercase",
//                   letterSpacing: 0.5,
//                 }}
//               >
//                 Team Member
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: 700,
//                   bgcolor: "background.default",
//                   borderBottom: 2,
//                   borderColor: "divider",
//                   fontSize: "0.75rem",
//                   textTransform: "uppercase",
//                   letterSpacing: 0.5,
//                 }}
//               >
//                 Email Address
//               </TableCell>
//               <TableCell
//                 align="center"
//                 sx={{
//                   fontWeight: 700,
//                   bgcolor: "background.default",
//                   borderBottom: 2,
//                   borderColor: "divider",
//                   fontSize: "0.75rem",
//                   textTransform: "uppercase",
//                   letterSpacing: 0.5,
//                 }}
//               >
//                 Role
//               </TableCell>
//               <TableCell
//                 align="center"
//                 sx={{
//                   fontWeight: 700,
//                   bgcolor: "background.default",
//                   borderBottom: 2,
//                   borderColor: "divider",
//                   fontSize: "0.75rem",
//                   textTransform: "uppercase",
//                   letterSpacing: 0.5,
//                 }}
//               >
//                 Actions
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {project.users && project.users.length > 0 ? (
//               project.users.map((user, index) => (
//                 <TableRow
//                   key={user.id}
//                   sx={{
//                     "&:hover": {
//                       bgcolor: "action.hover",
//                       "& .delete-btn": {
//                         opacity: 1,
//                       },
//                     },
//                     transition: "background-color 0.2s",
//                   }}
//                 >
//                   {/* User Name with Avatar */}
//                   <TableCell sx={{ py: 2 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                       <Avatar
//                         sx={{
//                           bgcolor: "primary.main",
//                           width: 40,
//                           height: 40,
//                           fontWeight: 700,
//                           fontSize: "0.9rem",
//                           boxShadow: 2,
//                         }}
//                       >
//                         {getInitials(user.name)}
//                       </Avatar>
//                       <Box>
//                         <Typography variant="body2" fontWeight={700}>
//                           {user.name}
//                         </Typography>
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                           sx={{ display: "block", mt: 0.25 }}
//                         >
//                           Member ID: {user.id}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </TableCell>

//                   {/* Email */}
//                   <TableCell>
//                     <Typography variant="body2" color="text.secondary">
//                       {user.email}
//                     </Typography>
//                   </TableCell>

//                   {/* Role */}
//                   <TableCell align="center">
//                     <Chip
//                       label={user.role}
//                       size="small"
//                       color={getRoleColor(user.role)}
//                       sx={{
//                         fontWeight: 700,
//                         fontSize: "0.7rem",
//                         height: 26,
//                         minWidth: 90,
//                       }}
//                     />
//                   </TableCell>

//                   {/* Actions */}
//                   <TableCell align="center">
//                     <Tooltip title="Remove from project" arrow placement="top">
//                       <IconButton
//                         className="delete-btn"
//                         size="small"
//                         onClick={() => onRemoveUser(user.id)}
//                         sx={{
//                           opacity: 0.6,
//                           transition: "all 0.2s",
//                           "&:hover": {
//                             bgcolor: "error.main",
//                             color: "white",
//                             opacity: 1,
//                           },
//                         }}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
//                   <Box>
//                     <PeopleIcon
//                       sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
//                     />
//                     <Typography
//                       variant="h6"
//                       color="text.secondary"
//                       gutterBottom
//                     >
//                       No Team Members Yet
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Click "Invite Member" to invite people to this project
//                     </Typography>
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// }

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Tooltip,
  Avatar,
  Chip,
  Divider,
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
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
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

  // Check if user is APP_ADMIN or MANAGER of this project
  const canInviteMembers = () => {
    // Global admin can always invite
    if (isAdmin()) return true;

    // Check if user is a MANAGER of this specific project
    if (project?.assignedUsers && userAttributes?.email) {
      const currentUserRole = project.assignedUsers.find(
        (user) => user.email === userAttributes.email
      );
      return currentUserRole?.role === "MANAGER";
    }

    return false;
  };

  // Open confirmation dialog
  const handleRemoveClick = (member) => {
    setSelectedMember(member);
    setConfirmDialogOpen(true);
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedMember(null);
  };

  // Confirm removal
  const handleConfirmRemove = () => {
    if (selectedMember) {
      onRemoveUser(selectedMember.userId);
    }
    handleCloseDialog();
  };

  return (
    <Box>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Typography variant="h6" fontWeight={600}>
          Team Members
        </Typography>

        {/* ✉️ Invite Button - Only for APP_ADMIN or MANAGER */}
        {canInviteMembers() && (
          <Tooltip title="Invite Member">
            <Button
              variant="contained"
              onClick={onInviteOpen}
              sx={{
                borderRadius: "50%",
                minWidth: 0,
                width: 48,
                height: 48,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <PersonAddAlt1Icon />
            </Button>
          </Tooltip>
        )}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* 👥 Members Table */}
      {project?.assignedUsers?.length ? (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>Member</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                {/* Only show Actions column for APP_ADMIN or MANAGER */}
                {canInviteMembers() && (
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {project.assignedUsers.map((member) => {
                // Check if this member is the current logged-in user
                const isCurrentUser = member.email === userAttributes?.email;

                return (
                  <TableRow
                    key={member.userId}
                    sx={{
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {/* Member Name with Avatar */}
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.light",
                            width: 36,
                            height: 36,
                          }}
                        >
                          {getInitials(member.fullName || member.email)}
                        </Avatar>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2" fontWeight={600}>
                              {member.fullName || "No Name"}
                            </Typography>
                            {isCurrentUser && (
                              <Chip
                                label="You"
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  bgcolor: "primary.light",
                                  color: "primary.dark",
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {member.email}
                      </Typography>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <Chip
                        label={member.role}
                        color={getRoleColor(member.role)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    {/* Actions - Only show for APP_ADMIN or MANAGER */}
                    {canInviteMembers() && (
                      <TableCell align="center">
                        {!isCurrentUser && (
                          <Tooltip title="Remove from project" arrow>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveClick(member)}
                              sx={{
                                "&:hover": {
                                  bgcolor: "error.light",
                                  color: "error.dark",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No team members added yet. Click <b>Invite Member</b> to get
            started.
          </Typography>
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon color="warning" />
          Confirm Removal
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove{" "}
            <strong>{selectedMember?.fullName || selectedMember?.email}</strong>{" "}
            from this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectTeamSection;
