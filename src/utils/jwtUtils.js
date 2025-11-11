import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Decode JWT token and extract user information
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Get user role from JWT token
 */
export const getUserRole = async () => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;

    // Try different possible locations for role in token
    const role =
      idToken?.payload["custom:role"] ||
      idToken?.payload["cognito:groups"]?.[0] ||
      "APP_USER"; // Default role

    return role;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

/**
 * Get user email from JWT token
 */
export const getUserEmail = async () => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    return idToken?.payload.email || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
};

/**
 * Get all user claims from JWT token
 */
export const getUserClaims = async () => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    return idToken?.payload || null;
  } catch (error) {
    console.error("Error getting user claims:", error);
    return null;
  }
};
