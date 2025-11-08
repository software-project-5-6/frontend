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
