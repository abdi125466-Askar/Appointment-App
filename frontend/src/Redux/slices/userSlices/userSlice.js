import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/axios";

// ================= FETCH USERS (supports search) =================
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (payload, { rejectWithValue }) => {
    try {
      const search = payload?.search ? String(payload.search).trim() : "";
      const url = search
        ? `/users?search=${encodeURIComponent(search)}`
        : "/users";

      const res = await api.get(url);

      // backend response: { success:true, data:[...] }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// ================= REGISTER USER =================
export const registerUser = createAsyncThunk(
  "users/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/users", data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to register user"
      );
    }
  }
);

// ================= UPDATE USER =================
export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/users/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);

// ================= UPDATE STATUS =================
export const updateUserStatus = createAsyncThunk(
  "users/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/users/${id}`, { status });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// ================= PERMANENT DELETE =================
export const deleteUserPermanent = createAsyncThunk(
  "users/deletePermanent",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/permanent/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user permanently"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    error: null,
    updatingId: null,
    deletingId: null,
    registering: false,
  },
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.registering = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registering = false;
        state.list.unshift(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registering = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      // UPDATE STATUS
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      // DELETE
      .addCase(deleteUserPermanent.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u._id !== action.payload);
      });
  },
});

export const { clearUsersError } = userSlice.actions;
export default userSlice.reducer;
