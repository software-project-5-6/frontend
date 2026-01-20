import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
  "http://localhost:8080";

// Create a separate axios instance for artifacts with correct base URL
const artifactApi = axios.create({
  baseURL: BASE_URL,
});

// Add auth interceptor
artifactApi.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken}`;
      }
    } catch (error) {
      console.error("Error fetching auth session:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Fetch all artifacts for a project
 * @param {string} projectId
 * @returns {Promise<Array>} list of artifacts
 */
export const fetchArtifacts = async (projectId) => {
  try {
    const response = await artifactApi.get(
      `/api/projects/${projectId}/artifacts`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching artifacts:", error);
    throw error;
  }
};

/**
 * Upload a new artifact
 * @param {string} projectId
 * @param {File} file
 * @param {string} type - Artifact type (DOCUMENT, IMAGE, AUDIO, VIDEO)
 * @param {string} uploadedBy - Username who uploaded
 * @param {string} tags - Comma-separated tags
 * @param {function} onUploadProgress - upload progress callback
 * @returns {Promise<Object>} uploaded artifact
 */
export const uploadArtifact = async (
  projectId,
  file,
  type,
  uploadedBy,
  tags,
  onUploadProgress,
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("uploadedBy", uploadedBy);
    formData.append("tags", tags);

    const response = await artifactApi.post(
      `/api/projects/${projectId}/artifacts/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading artifact:", error);
    throw error;
  }
};

/**
 * Download artifact
 * @param {string} projectId
 * @param {number} artifactId
 * @param {string} filename - Original filename for download
 */
export const downloadArtifact = async (projectId, artifactId, filename) => {
  try {
    const response = await artifactApi.get(
      `/api/projects/${projectId}/artifacts/${artifactId}/download`,
      {
        responseType: "blob",
      },
    );

    // Extract filename from headers if available
    const contentDisposition = response.headers["content-disposition"];
    let downloadFilename = filename || "artifact";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match?.[1]) downloadFilename = match[1];
    }

    // Download as file
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFilename;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading artifact:", error);
    throw error;
  }
};

/**
 * Delete artifact
 * @param {string} projectId
 * @param {number} artifactId
 */
export const deleteArtifact = async (projectId, artifactId) => {
  try {
    const response = await artifactApi.delete(
      `/api/projects/${projectId}/artifacts/${artifactId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting artifact:", error);
    throw error;
  }
};
