
import axios from "axios";
import { supabase } from "../supabaseClient";

// ==========================================
// HOSTED SPRING BOOT BACKEND
// ==========================================

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://psms-backend-bw95.onrender.com/api/v1"
).replace(/\/+$/, "");

// ==========================================
// CREATE AXIOS INSTANCE
// ==========================================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
});

// ==========================================
// REQUEST INTERCEPTOR
// SUPABASE JWT AUTHENTICATION
// ==========================================

api.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      const accessToken = session?.access_token;

      if (accessToken) {
        config.headers = config.headers ?? {};

        config.headers.Authorization =
          `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error(
        "Unable to retrieve Supabase session:",
        error.message
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// RESPONSE INTERCEPTOR
// HANDLE AUTHENTICATION ERRORS
// ==========================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn(
        "API returned 401 Unauthorized."
      );

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        // Redirect only if Supabase session
        // is actually missing.
        if (!sessionError && !session) {
          if (window.location.pathname !== "/login") {
            window.location.assign("/login");
          }
        } else {
          // User is logged in, but backend rejected
          // the token or request.
          // Do not automatically log out.
          console.warn(
            "Backend authentication failed while " +
            "a Supabase session may still exist."
          );
        }
      } catch (sessionCheckError) {
        console.error(
          "Unable to check authentication session:",
          sessionCheckError.message
        );
      }
    }

    if (status === 403) {
      console.warn(
        "Access denied: insufficient permissions."
      );
    }

    if (!error.response && error.request) {
      console.error(
        "Network error: unable to contact backend."
      );
    }

    return Promise.reject(error);
  }
);

export default api;
