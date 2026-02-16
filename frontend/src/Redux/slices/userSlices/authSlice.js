import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/axios";

const TOKEN_KEY = "appointment_app_token";

/* ================================
   LOGIN
================================ */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/users/login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

/* ================================
   FETCH CURRENT USER (/users/me)
================================ */
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/me");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Session expired");
    }
  }
);

/* ================================
   UPDATE MY PROFILE (/users/profile)
   Body: { fullName, bio }
================================ */
export const updateMyProfile = createAsyncThunk(
  "auth/updateMyProfile",
  async ({ fullName, bio }, { rejectWithValue }) => {
    try {
      const res = await api.put("/users/profile", { fullName, bio });
      return res.data; // { success, message, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

/* ================================
   ✅ UPDATE MY PASSWORD (/users/password)
================================ */
export const updateMyPassword = createAsyncThunk(
  "auth/updateMyPassword",
  async ({ currentPassword, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await api.put("/users/password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return res.data; // { success, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update password"
      );
    }
  }
);

/* ================================
   ✅ UPLOAD MY AVATAR (/users/profile/avatar)
================================ */
export const uploadMyAvatar = createAsyncThunk(
  "auth/uploadMyAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.put("/users/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; // { success, message, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    loading: true,
    error: null,

    // profile
    profileSaving: false,
    profileError: null,
    profileSuccess: null,

    // avatar
    avatarUploading: false,
    avatarError: null,

    // password
    passwordSaving: false,
    passwordError: null,
    passwordSuccess: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      state.profileSaving = false;
      state.profileError = null;
      state.profileSuccess = null;

      state.avatarUploading = false;
      state.avatarError = null;

      state.passwordSaving = false;
      state.passwordError = null;
      state.passwordSuccess = null;

      localStorage.removeItem(TOKEN_KEY);
    },

    stopLoading: (state) => {
      state.loading = false;
    },

    clearProfileMessage: (state) => {
      state.profileError = null;
      state.profileSuccess = null;
      state.avatarError = null;
      state.passwordError = null;
      state.passwordSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===== LOGIN ===== */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const token =
          action.payload?.token ||
          action.payload?.data?.token ||
          action.payload?.accessToken ||
          action.payload?.data?.accessToken ||
          null;

        const user =
          action.payload?.user ||
          action.payload?.data?.user ||
          action.payload?.data ||
          null;

        state.token = token;
        state.user = user;

        if (token) localStorage.setItem(TOKEN_KEY, token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== FETCH ME ===== */
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload?.data || action.payload?.user || action.payload;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = action.payload || "Session expired";
        localStorage.removeItem(TOKEN_KEY);
      })

      /* ===== UPDATE PROFILE ===== */
      .addCase(updateMyProfile.pending, (state) => {
        state.profileSaving = true;
        state.profileError = null;
        state.profileSuccess = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.profileSaving = false;

        const updatedUser = action.payload?.user || action.payload?.data || null;

        if (updatedUser) {
          state.user = {
            ...(state.user || {}),
            ...updatedUser,
            avatarUrl: updatedUser?.avatarUrl ?? state.user?.avatarUrl ?? "",
            bio: updatedUser?.bio ?? state.user?.bio ?? "",
            fullName: updatedUser?.fullName ?? state.user?.fullName ?? "",
          };
        }

        state.profileSuccess = action.payload?.message || "Profile updated ✅";
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.profileSaving = false;
        state.profileError = action.payload || "Update failed";
      })

      /* ===== UPDATE PASSWORD ===== */
      .addCase(updateMyPassword.pending, (state) => {
        state.passwordSaving = true;
        state.passwordError = null;
        state.passwordSuccess = null;
      })
      .addCase(updateMyPassword.fulfilled, (state, action) => {
        state.passwordSaving = false;
        state.passwordSuccess =
          action.payload?.message || "Password updated successfully ✅";
      })
      .addCase(updateMyPassword.rejected, (state, action) => {
        state.passwordSaving = false;
        state.passwordError = action.payload || "Failed to update password";
      })

      /* ===== UPLOAD AVATAR ===== */
      .addCase(uploadMyAvatar.pending, (state) => {
        state.avatarUploading = true;
        state.avatarError = null;
        state.profileSuccess = null;
      })
      .addCase(uploadMyAvatar.fulfilled, (state, action) => {
        state.avatarUploading = false;

        const updatedUser = action.payload?.user || action.payload?.data || null;
        if (updatedUser) {
          state.user = { ...(state.user || {}), ...updatedUser };
        }

        state.profileSuccess = action.payload?.message || "Photo updated ✅";
      })
      .addCase(uploadMyAvatar.rejected, (state, action) => {
        state.avatarUploading = false;
        state.avatarError = action.payload || "Upload failed";
      });
  },
});

export const { logout, stopLoading, clearProfileMessage } = authSlice.actions;
export default authSlice.reducer;
