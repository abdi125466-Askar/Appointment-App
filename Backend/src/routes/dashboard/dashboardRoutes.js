// const express = require("express");
// const router = express.Router();

// const {
//   getCounts,
//   getLatestUpdates,
// } = require("../../controller/Dashboard/appointmentDashboard.controller");

// // ✅ Counts for badges (pending/approved/completed + optional customers/services)
// router.get("/counts", getCounts);

// // ✅ Latest updates list for bell dropdown
// router.get("/updates", getLatestUpdates);

// module.exports = router;


const express = require("express");
const router = express.Router();

// ✅ Correct path from: src/routes/dashboard/dashboardRoutes.js
// to: src/controller/Dashboard/appointmentDashboard.controller.js
const {
  getCounts,
  getLatestUpdates,
} = require("../../controller/Dashboard/appointmentDashboard.controller");

// Counts for sidebar badges
router.get("/counts", getCounts);

// Latest updates list (bell dropdown)
router.get("/updates", getLatestUpdates);

module.exports = router;