import api from "./axiosConfig";


/**
 * ask something about a project
 * @param {Object} question 
 * @returns {Promise} API response
 */
export const askProject = async (projectId,question) => {
  try {
    const response = await api.post(`/projects/ask/${projectId}`, question);
    return response.data;
  } catch (error) {
    console.error("Error with quering project:", error);
    throw error;
  }
};