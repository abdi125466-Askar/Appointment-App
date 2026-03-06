

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/axios";

/* =====================================================
   1) FETCH ACTIVE SERVICES (PUBLIC)
===================================================== */
export const fetchActiveServices = createAsyncThunk(
  "publicAppointment/fetchActiveServices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/public/services");
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to load services"
      );
    }
  }
);

/* =====================================================
   2) CHECK SERVICE AVAILABILITY (PUBLIC)
===================================================== */
export const checkServiceAvailability = createAsyncThunk(
  "publicAppointment/checkAvailability",
  async ({ serviceId, date }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/public/services/${serviceId}/availability`, {
        params: { date },
      });
      return res.data?.data || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to check availability"
      );
    }
  }
);

/* =====================================================
   3) CREATE PUBLIC APPOINTMENT (PUBLIC)
===================================================== */
export const createPublicAppointment = createAsyncThunk(
  "publicAppointment/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/public/appointments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ controller-kaaga wuxuu soo celiyaa: { success, message, data: {...} }
      return res.data?.data || null;
    } catch (err) {
      console.error("CREATE_APPOINTMENT_ERR:", err?.response?.data || err);
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to create appointment"
      );
    }
  }
);

/* =====================================================
   4) GET APPOINTMENT STATUS (PUBLIC)
===================================================== */
export const fetchAppointmentStatus = createAsyncThunk(
  "publicAppointment/status",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/public/appointments/${appointmentId}/status`);
      return res.data?.data || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to fetch appointment status"
      );
    }
  }
);

const publicAppointmentSlice = createSlice({
  name: "publicAppointment",
  initialState: {
    services: [],
    servicesLoading: false,

    availability: null,
    availabilityLoading: false,

    creating: false,
    bookingSuccess: null,

    statusLoading: false,
    appointmentStatus: null,

    error: null,
  },

  reducers: {
    clearAvailability: (state) => {
      state.availability = null;
    },
    clearBookingSuccess: (state) => {
      state.bookingSuccess = null;
    },
    clearAppointmentStatus: (state) => {
      state.appointmentStatus = null;
    },
    clearPublicError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // services
      .addCase(fetchActiveServices.pending, (state) => {
        state.servicesLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveServices.fulfilled, (state, action) => {
        state.servicesLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchActiveServices.rejected, (state, action) => {
        state.servicesLoading = false;
        state.error = action.payload;
      })

      // availability
      .addCase(checkServiceAvailability.pending, (state) => {
        state.availabilityLoading = true;
        state.error = null;
      })
      .addCase(checkServiceAvailability.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        state.availability = action.payload;
      })
      .addCase(checkServiceAvailability.rejected, (state, action) => {
        state.availabilityLoading = false;
        state.error = action.payload;
      })

      // create appointment
      .addCase(createPublicAppointment.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.bookingSuccess = null;
      })
      .addCase(createPublicAppointment.fulfilled, (state, action) => {
        state.creating = false;
        state.bookingSuccess = action.payload;
      })
      .addCase(createPublicAppointment.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // status
      .addCase(fetchAppointmentStatus.pending, (state) => {
        state.statusLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentStatus.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.appointmentStatus = action.payload;
      })
      .addCase(fetchAppointmentStatus.rejected, (state, action) => {
        state.statusLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAvailability,
  clearBookingSuccess,
  clearAppointmentStatus,
  clearPublicError,
} = publicAppointmentSlice.actions;

export default publicAppointmentSlice.reducer;