import api from "./axiosConfig";

/**
 * Invitation Service API
 * Handles all invitation-related API calls
 */
export const invitationApi = {
  /**
   * Send invitation to user
   * @param {string} projectId - Project ID (4-character format: PA12, PB34, etc.)
   * @param {Object} inviteRequest - { email, role }
   * @returns {Promise} API response
   */
  sendInvitation: async (projectId, inviteRequest) => {
    try {
      const response = await api.post("/invitations", {
        projectId,
        ...inviteRequest,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending invitation:", error);
      throw error;
    }
  },

  /**
   * Get pending invitations for a project
   * @param {string} projectId - Project ID (4-character format: PA12, PB34, etc.)
   * @returns {Promise} List of pending invitations
   */
  getPendingInvitations: async (projectId) => {
    try {
      const response = await api.get(`/invitations/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pending invitations:", error);
      throw error;
    }
  },

  /**
   * Accept project invitation
   * @param {string} token - Invitation token from email
   * @returns {Promise} API response
   */
  acceptInvitation: async (token) => {
    try {
      const response = await api.post(`/invitations/accept?token=${token}`);
      return response.data;
    } catch (error) {
      console.error("Error accepting invitation:", error);
      throw error;
    }
  },

  /**
   * Revoke/cancel invitation
   * @param {number} invitationId - Invitation ID
   * @returns {Promise} API response
   */
  revokeInvitation: async (invitationId) => {
    try {
      const response = await api.delete(`/invitations/${invitationId}`);
      return response.data;
    } catch (error) {
      console.error("Error revoking invitation:", error);
      throw error;
    }
  },

  /**
   * Resend invitation email
   * @param {number} invitationId - Invitation ID
   * @returns {Promise} API response
   */
  resendInvitation: async (invitationId) => {
    try {
      const response = await api.post(`/invitations/${invitationId}/resend`);
      return response.data;
    } catch (error) {
      console.error("Error resending invitation:", error);
      throw error;
    }
  },
};

// Export default for backward compatibility
export default invitationApi;
