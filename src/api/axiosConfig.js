import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  async (config) => {
    try {
      // Fetch the current auth session from AWS Amplify
      const session = await fetchAuthSession();

      // Get the ID token (contains user identity - use this for your backend)
      const idToken = session.tokens?.idToken?.toString();

      
      

      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken}`;
      }
    } catch (error) {
      console.error("Error fetching auth session:", error);
      // If token fetch fails, continue without token
      // Your backend will handle unauthorized requests
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

// import axios from "axios";
// import { fetchAuthSession } from "aws-amplify/auth";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
// });

// api.interceptors.request.use(
//   async (config) => {
//     try {
//       // Fetch the current auth session from AWS Amplify
//       const session = await fetchAuthSession();

//       // ✅ Get the ACCESS token (for backend authorization)
//       const accessToken = session.tokens?.accessToken?.toString();

//       if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//       }
//     } catch (error) {
//       console.error("Error fetching auth session:", error);
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
