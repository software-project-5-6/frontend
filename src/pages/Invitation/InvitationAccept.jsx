// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Box,
//   Typography,
//   CircularProgress,
//   Alert,
//   Button,
// } from "@mui/material";
// import {
//   CheckCircle as CheckCircleIcon,
//   Error as ErrorIcon,
//   HourglassEmpty as ExpiredIcon,
// } from "@mui/icons-material";
// import { invitationApi } from "../../api/invitationApi";
// import { gradients } from "../../styles/theme";

// export default function InvitationAccept() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const token = searchParams.get("token");

//   // Single state object to avoid race conditions
//   const [inviteState, setInviteState] = useState({
//     status: "loading", // 'loading' | 'success' | 'already-member' | 'expired' | 'error'
//     message: "",
//   });

//   useEffect(() => {
//     const processInvitation = async () => {
//       // Validate token exists
//       if (!token) {
//         setInviteState({
//           status: "error",
//           message: "Invalid invitation link. Token is missing.",
//         });
//         return;
//       }

//       try {
//         const response = await invitationApi.acceptInvitation(token);

//         // Success case - user was added to project
//         setInviteState({
//           status: "success",
//           message: response || "Invitation accepted successfully!",
//         });
//       } catch (err) {
//         console.error("Error accepting invitation:", err);

//         // Extract error message
//         const errorMsg =
//           err.response?.data?.message ||
//           err.response?.data ||
//           "Failed to accept invitation. Please try again.";

//         // Categorize the error
//         if (
//           errorMsg.includes("already been accepted") ||
//           errorMsg.includes("already a member") ||
//           errorMsg.includes("Duplicate entry")
//         ) {
//           setInviteState({
//             status: "already-member",
//             message: "You are already a member of this project.",
//           });
//         } else if (errorMsg.includes("expired")) {
//           setInviteState({
//             status: "expired",
//             message: errorMsg,
//           });
//         } else {
//           setInviteState({
//             status: "error",
//             message: errorMsg,
//           });
//         }
//       }
//     };

//     processInvitation();
//   }, [token, navigate]);

//   // Render based on status
//   const renderContent = () => {
//     switch (inviteState.status) {
//       case "loading":
//         return (
//           <Box>
//             <CircularProgress size={60} sx={{ mb: 3 }} />
//             <Typography variant="h5" fontWeight={600} gutterBottom>
//               Processing Invitation
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Please wait while we verify your invitation...
//             </Typography>
//           </Box>
//         );

//       case "success":
//         return (
//           <Box>
//             <CheckCircleIcon
//               sx={{ fontSize: 80, color: "success.main", mb: 2 }}
//             />
//             <Typography variant="h5" fontWeight={600} gutterBottom>
//               Welcome Aboard! 🎉
//             </Typography>
//             <Alert severity="success" sx={{ mb: 3 }}>
//               You have been successfully added to the project!
//             </Alert>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               Click the button below to view your projects.
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => navigate("/projects")}
//               size="large"
//             >
//               Go to Projects
//             </Button>
//           </Box>
//         );

//       case "already-member":
//         return (
//           <Box>
//             <CheckCircleIcon sx={{ fontSize: 80, color: "info.main", mb: 2 }} />
//             <Typography variant="h5" fontWeight={600} gutterBottom>
//               Already Accepted
//             </Typography>
//             <Alert severity="info" sx={{ mb: 3 }}>
//               {inviteState.message}
//             </Alert>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               You can view this project in your projects list.
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => navigate("/projects")}
//             >
//               Go to Projects
//             </Button>
//           </Box>
//         );

//       case "expired":
//         return (
//           <Box>
//             <ExpiredIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
//             <Typography variant="h5" fontWeight={600} gutterBottom>
//               Invitation Expired
//             </Typography>
//             <Alert severity="warning" sx={{ mb: 3 }}>
//               {inviteState.message}
//             </Alert>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               Please contact the project administrator to request a new
//               invitation link.
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => navigate("/projects")}
//             >
//               Go to Projects
//             </Button>
//           </Box>
//         );

//       case "error":
//         return (
//           <Box>
//             <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
//             <Typography variant="h5" fontWeight={600} gutterBottom>
//               Invitation Failed
//             </Typography>
//             <Alert severity="error" sx={{ mb: 3 }}>
//               {inviteState.message}
//             </Alert>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               If the problem persists, please contact the project administrator.
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => navigate("/projects")}
//             >
//               Go to Projects
//             </Button>
//           </Box>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: gradients.primary,
//         p: 2,
//       }}
//     >
//       <Container maxWidth="sm">
//         <Paper
//           elevation={8}
//           sx={{
//             p: 4,
//             borderRadius: 3,
//             textAlign: "center",
//           }}
//         >
//           {renderContent()}
//         </Paper>
//       </Container>
//     </Box>
//   );
// }



import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as ExpiredIcon,
} from "@mui/icons-material";
import { invitationApi } from "../../api/invitationApi";
import { gradients } from "../../styles/theme";

export default function InvitationAccept() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Ref to prevent duplicate API calls
  const hasProcessed = useRef(false);

  // Single state object to avoid race conditions
  const [inviteState, setInviteState] = useState({
    status: "loading", // 'loading' | 'success' | 'already-member' | 'expired' | 'error'
    message: "",
  });

  useEffect(() => {
    const processInvitation = async () => {
      // Prevent duplicate processing
      if (hasProcessed.current) {
        return;
      }

      // Validate token exists
      if (!token) {
        setInviteState({
          status: "error",
          message: "Invalid invitation link. Token is missing.",
        });
        return;
      }

      // Mark as processing to prevent duplicate calls
      hasProcessed.current = true;

      try {
        const response = await invitationApi.acceptInvitation(token);

        // Check if user was already a member (backend should return this flag)
        if (response.alreadyMember) {
          setInviteState({
            status: "already-member",
            message: response.message || "You are already a member of this project.",
          });
        } else {
          // Success case - user was added to project
          setInviteState({
            status: "success",
            message: response.message || "Invitation accepted successfully!",
          });
        }
      } catch (err) {
        console.error("Error accepting invitation:", err);

        // Extract error message
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data ||
          "Failed to accept invitation. Please try again.";

        // Categorize the error
        if (
          errorMsg.includes("already been accepted") ||
          errorMsg.includes("already a member") ||
          errorMsg.includes("Duplicate entry")
        ) {
          setInviteState({
            status: "already-member",
            message: "You are already a member of this project.",
          });
        } else if (errorMsg.includes("expired")) {
          setInviteState({
            status: "expired",
            message: errorMsg,
          });
        } else {
          setInviteState({
            status: "error",
            message: errorMsg,
          });
        }
      }
    };

    processInvitation();
  }, [token]); // Only depend on token, not navigate

  // Render based on status
  const renderContent = () => {
    switch (inviteState.status) {
      case "loading":
        return (
          <Box>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Processing Invitation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify your invitation...
            </Typography>
          </Box>
        );

      case "success":
        return (
          <Box>
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "success.main", mb: 2 }}
            />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Welcome Aboard! 🎉
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              You have been successfully added to the project!
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Click the button below to view your projects.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/projects")}
              size="large"
            >
              Go to Projects
            </Button>
          </Box>
        );

      case "already-member":
        return (
          <Box>
            <CheckCircleIcon sx={{ fontSize: 80, color: "info.main", mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Already Accepted
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              {inviteState.message}
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You can view this project in your projects list.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/projects")}
            >
              Go to Projects
            </Button>
          </Box>
        );

      case "expired":
        return (
          <Box>
            <ExpiredIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Invitation Expired
            </Typography>
            <Alert severity="warning" sx={{ mb: 3 }}>
              {inviteState.message}
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please contact the project administrator to request a new
              invitation link.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/projects")}
            >
              Go to Projects
            </Button>
          </Box>
        );

      case "error":
        return (
          <Box>
            <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Invitation Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {inviteState.message}
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              If the problem persists, please contact the project administrator.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/projects")}
            >
              Go to Projects
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: gradients.primary,
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          {renderContent()}
        </Paper>
      </Container>
    </Box>
  );
}