// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../../utils/axios";

// /* ================================
//    FETCH APPOINTMENT DASHBOARD
// ================================ */
// export const fetchAppointmentDashboard = createAsyncThunk(
//   "appointmentDashboard/fetch",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/appointments/dashboard");
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to load dashboard"
//       );
//     }
//   }
// );

// const appointmentDashboardSlice = createSlice({
//   name: "appointmentDashboard",

//   initialState: {
//     loading: false,
//     error: null,

//     totals: {
//       total: 0,
//       todayRequests: 0,
//     },

//     byStatus: {
//       pending: 0,
//       approved: 0,
//       completed: 0,
//       rejected: 0,
//       cancelled: 0,
//       noShow: 0,
//     },

//     // OPTIONAL (backend may not send yet)
//     byGender: {
//       MALE: 0,
//       FEMALE: 0,
//       OTHER: 0,
//       UNKNOWN: 0,
//     },

//     usersProgress: [],

//     lastActivities: [],
//   },

//   reducers: {},

//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAppointmentDashboard.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(fetchAppointmentDashboard.fulfilled, (state, action) => {
//         state.loading = false;

//         state.totals = action.payload?.totals || state.totals;
//         state.byStatus = action.payload?.byStatus || state.byStatus;
//         state.lastActivities = action.payload?.lastActivities || [];

//         // SAFE FALLBACKS (IMPORTANT)
//         state.byGender =
//           action.payload?.byGender || state.byGender;

//         state.usersProgress =
//           action.payload?.usersProgress || [];
//       })

//       .addCase(fetchAppointmentDashboard.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default appointmentDashboardSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/axios";

/* ================================
   FETCH APPOINTMENT DASHBOARD
   ✅ supports range=THIS_WEEK|LAST_WEEK
================================ */
export const fetchAppointmentDashboard = createAsyncThunk(
  "appointmentDashboard/fetch",
  async ({ range = "THIS_WEEK" } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(`/appointments/dashboard?range=${range}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard"
      );
    }
  }
);

const appointmentDashboardSlice = createSlice({
  name: "appointmentDashboard",

  initialState: {
    loading: false,
    error: null,

    // backend returns: totals, byStatus, lastActivities, previousTotals, previousByStatus
    totals: { total: 0, todayRequests: 0 },
    byStatus: {
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0,
      noShow: 0,
    },

    previousTotals: { total: 0 },
    previousByStatus: {
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0,
      noShow: 0,
    },

    // optional metadata
    range: "THIS_WEEK",
    period: null,
    comparePeriod: null,

    lastActivities: [],
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAppointmentDashboard.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload || {};

        state.range = payload.range || state.range;
        state.period = payload.period || state.period;
        state.comparePeriod = payload.comparePeriod || state.comparePeriod;

        state.totals = payload.totals || state.totals;
        state.byStatus = payload.byStatus || state.byStatus;

        state.previousTotals = payload.previousTotals || state.previousTotals;
        state.previousByStatus = payload.previousByStatus || state.previousByStatus;

        state.lastActivities = Array.isArray(payload.lastActivities)
          ? payload.lastActivities
          : [];
      })

      .addCase(fetchAppointmentDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load dashboard";
      });
  },
});

export default appointmentDashboardSlice.reducer;