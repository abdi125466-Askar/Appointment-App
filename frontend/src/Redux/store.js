import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices/userSlice";
import authReducer from "./slices/userSlices/authSlice";
import customerReducer from "./slices/cusomerSlice/customerSlice";
import serviceReducer from "./slices/cusomerSlice/serviceSlice";
import appointmentReducer from "./slices/cusomerSlice/appointmentSlice";
import appointmentDashboardReducer from "./slices/cusomerSlice/appointmentDashboardSlice";
import appointmentEmployeeReducer from "./slices/cusomerSlice/appointmentEmployeeSlice";
import publicAppointmentReducer from "./slices/PublicSlice/publicAppointmentSlice";
import usersProgressReducer from "../pages/user/usersProgressSlice";

export const store = configureStore({
  reducer: {
     usersProgress: usersProgressReducer,
    users: userReducer,
    auth: authReducer,
    customers: customerReducer,
    services: serviceReducer,
    appointments: appointmentReducer,
    appointmentDashboard: appointmentDashboardReducer,
    appointmentEmployee: appointmentEmployeeReducer,
    publicAppointment: publicAppointmentReducer,
  },
});

export default store;
