import api from "./axiosConfig";

/**
 * Create a new project
 * @param {Object} projectData - Project data matching backend schema
 * @returns {Promise} API response
 */
export const createProject = async (projectData) => {
  try {
    const response = await api.post("/projects", projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

/**
 * Get all projects
 * @returns {Promise} List of projects
 */
export const getAllProjects = async () => {
  try {
    const response = await api.get("/projects");
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

/**
 * Get project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise} Project details
 */
export const getProjectById = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

/**
 * Update project
 * @param {string} projectId - Project ID
 * @param {Object} projectData - Updated project data
 * @returns {Promise} API response
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

/**
 * Delete project
 * @param {string} projectId - Project ID
 * @returns {Promise} API response
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

/**
 * Assign user to project
 * @param {string} projectId - Project ID
 * @param {Object} userRole - User role data
 * @returns {Promise} API response
 */
export const assignUserToProject = async (projectId, userRole) => {
  try {
    const response = await api.post(`/projects/${projectId}/users`, userRole);
    return response.data;
  } catch (error) {
    console.error("Error assigning user:", error);
    throw error;
  }
};

/**
 * Remove user from project
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @returns {Promise} API response
 */
export const removeUserFromProject = async (projectId, userId) => {
  try {
    const response = await api.delete(`/projects/${projectId}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
};

/**
 * Send project invitation
 * @param {number} projectId - Project ID
 * @param {string} email - Invitee email address
 * @param {string} role - User role (MANAGER, CONTRIBUTOR, VIEWER)
 * @returns {Promise} API response
 */
export const sendProjectInvitation = async (projectId, email, role) => {
  try {
    const response = await api.post("/invitations", {
      projectId,
      email,
      role,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending invitation:", error);
    throw error;
  }
};

/**
 * Accept project invitation
 * @param {string} token - Invitation token from email
 * @returns {Promise} API response
 */
export const acceptProjectInvitation = async (token) => {
  try {
    const response = await api.post(`/invitations/accept?token=${token}`);
    return response.data;
  } catch (error) {
    console.error("Error accepting invitation:", error);
    throw error;
  }
};
