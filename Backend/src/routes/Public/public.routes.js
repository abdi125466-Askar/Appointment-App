const express = require("express");
const router = express.Router();

const {
  getActiveServices,
  getServiceAvailability,
} = require("../../controller/public/publicService.controller");

const {
  createPublicAppointment,
  getMyAppointmentStatus,
  getAvailablePublicSlots,
} = require("../../controller/public/publicAppointment.controller");

const uploadPdf = require("../../middlewares/uploadPdf");

// Services
router.get("/services", getActiveServices);
router.get("/services/:serviceId/availability", getServiceAvailability);

// Appointment create + status + slots
router.get("/appointments/available-slots", getAvailablePublicSlots);
router.post("/appointments", uploadPdf.single("file"), createPublicAppointment);
router.get("/appointments/:appointmentId/status", getMyAppointmentStatus);

module.exports = router;