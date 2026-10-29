import api from "./axiosConfig";

/**
 * Submit a customer support request to the Majstro PSMS backend.
 *
 * @param {Object} supportData
 * @param {string} supportData.category - Technical Issue, Account & Login, Projects, AI Assistant, Feature Request, Other
 * @param {string} supportData.subject - Brief summary of the issue
 * @param {string} supportData.message - Detailed explanation of the problem or request
 * @param {string} [supportData.name] - User full name
 * @param {string} [supportData.email] - Contact/reply email address
 * @returns {Promise<Object>} API response with ticketId and confirmation message
 */
export const submitSupportRequest = async (supportData) => {
  try {
    const response = await api.post("/support/requests", supportData);
    if (!response.data || response.data.success === false) {
      throw new Error(
        response.data?.message || "Support request submission failed."
      );
    }
    return response.data;
  } catch (error) {
    console.error("[supportApi] Error submitting support request:", error);

    let message = "Failed to submit support request. Please try again later.";

    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === "object") {
        if (data.message && typeof data.message === "string") {
          message = data.message;
        } else if (data.error && typeof data.error === "string") {
          message = data.error;
        }
      } else if (
        typeof data === "string" &&
        !data.includes("<html") &&
        data.trim().length > 0
      ) {
        message = data.trim();
      }
    } else if (error.message && typeof error.message === "string") {
      message = error.message;
    }

    // If server returned 500 without a detailed message
    if (
      error.response?.status === 500 &&
      (!message || message.toLowerCase().includes("internal server error"))
    ) {
      message =
        "The support service encountered a server error. Please ensure the backend is deployed and email delivery is configured.";
    }

    throw new Error(message);
  }
};
