// const express = require("express");
// const router = express.Router();

// const {
//   createAppointment,
//   getAppointments,
//   getAppointmentById,
//   updateAppointment,
//   deleteAppointment,
//   deleteAppointmentPermanent,
//   getAppointmentsByStatus,
//   updateAssignedUser,
//   getMyApprovedAppointments,
//   getEmployeeDashboardAnalytics,
// } = require("../controller/Customer/appointment.controller");
// const { getAppointmentDashboard } = require("../controller/Dashboard/appointmentDashboard.controller");
// const { authMiddleware } = require("../middlewares/auth.middleware");

// /* ================================
//    APPOINTMENT ROUTES
// ================================ */

// // CREATE
// router.post("/", createAppointment);

// router.get("/dashboard", getAppointmentDashboard) 
// // READ ALL
// router.get("/", getAppointments);
// router.get("/appointments", getAppointmentsByStatus);


// // READ ONE
// router.get("/:id", getAppointmentById); 

// router.put("/:id/assign-user", updateAssignedUser);
// // UPDATE
// router.put("/:id", updateAppointment);
// router.get(
//   "/my/appointments",
//   authMiddleware,
//   getMyApprovedAppointments
// );

// router.get(
//   "/my/dashboard/analytics",
//   authMiddleware,
//   getEmployeeDashboardAnalytics
// );




// // SOFT DELETE (CANCEL)
// router.delete("/:id", deleteAppointment);

// // PERMANENT DELETE (OPTIONAL / ADMIN)
// router.delete("/permanent/:id", deleteAppointmentPermanent);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  deleteAppointmentPermanent,
  getAppointmentsByStatus,
  updateAssignedUser,
  getMyApprovedAppointments,
  getEmployeeDashboardAnalytics,
} = require("../controller/Customer/appointment.controller");

const {
  getAppointmentDashboard,
} = require("../controller/Dashboard/appointmentDashboard.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

/* ================================
   APPOINTMENT ROUTES
================================ */

// ✅ DASHBOARD (Mon–Sun, appointmentDate)
router.get("/dashboard", getAppointmentDashboard);

// ✅ MY ROUTES (MUST be before "/:id")
router.get("/my/appointments", authMiddleware, getMyApprovedAppointments);

router.get("/my/dashboard/analytics", authMiddleware, getEmployeeDashboardAnalytics);

// CREATE
router.post("/", createAppointment);

// READ ALL
router.get("/", getAppointments);

// READ BY STATUS
router.get("/appointments", getAppointmentsByStatus);

// READ ONE
router.get("/:id", getAppointmentById);

// ASSIGN USER
router.put("/:id/assign-user", updateAssignedUser);

// UPDATE
router.put("/:id", updateAppointment);

// SOFT DELETE
router.delete("/:id", deleteAppointment);

// PERMANENT DELETE
router.delete("/permanent/:id", deleteAppointmentPermanent);

module.exports = router;