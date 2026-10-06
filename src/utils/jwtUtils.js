import { supabase } from "../supabaseClient";

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

export const getUserRole = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    const payload = decodeToken(session.access_token);
    return payload?.role || "APP_USER";
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

export const getUserEmail = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
};

export const getUserClaims = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    return decodeToken(session.access_token);
  } catch (error) {
    console.error("Error getting user claims:", error);
    return null;
  }
};
