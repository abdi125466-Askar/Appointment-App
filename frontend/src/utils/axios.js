

// import axios from "axios";

// /**
//  * =====================================================
//  * Central Axios instance
//  * =====================================================
//  */
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /**
//  * =====================================================
//  * 🔐 REQUEST INTERCEPTOR
//  * - Attach JWT token if exists
//  * =====================================================
//  */
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("appointment_app_token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /**
//  * =====================================================
//  * 🚨 RESPONSE INTERCEPTOR
//  * - SAFE auth handling
//  * =====================================================
//  */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     const token = localStorage.getItem("appointment_app_token");

//     if (status === 401 && token) {
//       console.warn("Session expired (401)");
//       localStorage.removeItem("appointment_app_token");
//       if (window.location.pathname !== "/") {
//         window.location.href = "/";
//       }
//     }

//     if (status === 403) {
//       console.warn("Access forbidden (403)");
//       if (window.location.pathname !== "/unauthorized") {
//         window.location.href = "/unauthorized";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
// src/lib/api.ts
import axios from "axios";

/**
 * =====================================================
 * Central Axios Instance
 * =====================================================
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * =====================================================
 * 🔐 REQUEST INTERCEPTOR
 * Attach JWT token if exists
 * =====================================================
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("appointment_app_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * =====================================================
 * 🚨 RESPONSE INTERCEPTOR
 * Safe auth handling
 * =====================================================
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 🔁 Session expired
    if (status === 401) {
      localStorage.removeItem("appointment_app_token");

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // ⛔ Forbidden
    if (status === 403) {
      if (window.location.pathname !== "/unauthorized") {
        window.location.href = "/unauthorized";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

