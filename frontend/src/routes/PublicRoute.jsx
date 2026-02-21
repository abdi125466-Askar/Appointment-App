// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const PublicRoute = () => {
//   const { token, user, loading } = useSelector((state) => state.auth);

//   if (loading) {
//     return <div className="h-screen flex items-center justify-center">Loading...</div>;
//   }

//   if (token && user) {
//     if (["ADMIN", "SUPERADMIN", "STAFF"].includes(user.role)) {
//       return <Navigate to="/dashboard" replace />;
//     }
//     return <Navigate to="/dashboard/employee" replace />;
//   }

//   return <Outlet />;
// };

// export default PublicRoute;



const express = require("express");
const router = express.Router();

const {
  getActiveServices,
  getServiceAvailability,
} = require("../../controller/public/publicService.controller");

const {
  createPublicAppointment,
  getMyAppointmentStatus,
  getMyAppointmentStatusByTrackingCode,
} = require("../../controller/public/publicAppointment.controller");

// middleware
const uploadPdf = require("../../middlewares/uploadPdf");

// Services
router.get("/services", getActiveServices);
router.get("/services/:serviceId/availability", getServiceAvailability);

// Appointment create
router.post("/appointments", uploadPdf.single("file"), createPublicAppointment);

// ✅ Track by trackingCode (BEST)
router.get("/appointments/track/:trackingCode", getMyAppointmentStatusByTrackingCode);

// (Optional) old track by ObjectId
router.get("/appointments/:appointmentId/status", getMyAppointmentStatus);

module.exports = router;