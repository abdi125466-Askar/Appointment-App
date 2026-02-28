import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

/* ===================================
   FETCH USERS PROGRESS (ADMIN)
=================================== */
export const fetchUsersProgress = createAsyncThunk(
  "usersProgress/fetch",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { month, year } = filters;

      let url = "/appointments/admin/appointments/users-progress";

      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }

      // 🔥 Explicitly add token header (optional)
      const token = localStorage.getItem("appointment_app_token");

      const res = await api.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load users progress"
      );
    }
  }
);

const usersProgressSlice = createSlice({
  name: "usersProgress",

  initialState: {
    data: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(fetchUsersProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load users progress";
      });
  },
});

export default usersProgressSlice.reducer;