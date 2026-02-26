

// const Appointment = require("../../model/Appointment");

// /* =========================================================
//    DASHBOARD SUMMARY
//    GET /api/appointments/dashboard
// ========================================================= */
// exports.getAppointmentDashboard = async (req, res) => {
//   try {
//     const [
//       total,
//       pending,
//       approved,
//       completed,
//       rejected,
//       cancelled,
//       noShow,
//     ] = await Promise.all([
//       Appointment.countDocuments(),
//       Appointment.countDocuments({ status: "PENDING" }),
//       Appointment.countDocuments({ status: "APPROVED" }),
//       Appointment.countDocuments({ status: "COMPLETED" }),
//       Appointment.countDocuments({ status: "REJECTED" }),
//       Appointment.countDocuments({ status: "CANCELLED" }),
//       Appointment.countDocuments({ status: "NO_SHOW" }),
//     ]);

//     const startOfToday = new Date();
//     startOfToday.setHours(0, 0, 0, 0);

//     const endOfToday = new Date();
//     endOfToday.setHours(23, 59, 59, 999);

//     const todayRequests = await Appointment.countDocuments({
//       createdAt: { $gte: startOfToday, $lte: endOfToday },
//     });

//     const lastActivities = await Appointment.find()
//       .sort({ updatedAt: -1 })
//       .limit(50)
//       .populate("customerId", "fullName phone email gender")
//       .populate("serviceId", "name code")
//       .populate("assignedUserId", "fullName role email")
//       .select(
//         "customerId serviceId assignedUserId appointmentDate status createdAt updatedAt"
//       );

//     return res.json({
//       success: true,
//       data: {
//         totals: { total, todayRequests },
//         byStatus: {
//           pending,
//           approved,
//           completed,
//           rejected,
//           cancelled,
//           noShow,
//         },
//         lastActivities,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to load dashboard data",
//     });
//   }
// };

// /* =========================================================
//    COUNTS (Sidebar Badges)
//    GET /api/dashboard/counts
// ========================================================= */
// exports.getCounts = async (req, res) => {
//   try {
//     const [pending, approved, completed] = await Promise.all([
//       Appointment.countDocuments({ status: "PENDING" }),
//       Appointment.countDocuments({ status: "APPROVED" }),
//       Appointment.countDocuments({ status: "COMPLETED" }),
//     ]);

//     return res.json({
//       success: true,
//       data: { PENDING: pending, APPROVED: approved, COMPLETED: completed },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to load counts",
//     });
//   }
// };

// /* =========================================================
//    PROFESSIONAL LATEST UPDATES
//    GET /api/dashboard/updates
// ========================================================= */
// exports.getLatestUpdates = async (req, res) => {
//   try {
//     const latest = await Appointment.find()
//       .sort({ updatedAt: -1 })
//       .limit(10)
//       .select("status updatedAt createdAt customerId serviceId")
//       .populate("customerId", "fullName")
//       .populate("serviceId", "name");

//     const mapped = latest.map((a) => {
//       const customer = a.customerId?.fullName || "A customer";
//       const service = a.serviceId?.name || "the requested service";

//       let title = "Appointment Update";
//       let desc = "The appointment status has been updated.";
//       let to = "/dashboard";

//       switch ((a.status || "").toUpperCase()) {
//         case "PENDING":
//           title = "New Appointment Submitted";
//           desc = `A new request from ${customer} for ${service} is awaiting review.`;
//           to = "/dashboard/pending-appointments";
//           break;

//         case "APPROVED":
//           title = "Appointment Approved";
//           desc = `The appointment for ${customer} has been approved and scheduled.`;
//           to = "/dashboard/approved-appointments";
//           break;

//         case "COMPLETED":
//           title = "Service Completed";
//           desc = `The appointment for ${customer} has been completed successfully.`;
//           to = "/dashboard/completed-appointments";
//           break;

//         case "REJECTED":
//           title = "Request Declined";
//           desc = `The appointment request submitted by ${customer} was declined.`;
//           to = "/dashboard/pending-appointments";
//           break;

//         case "NO_SHOW":
//           title = "Customer Did Not Attend";
//           desc = `${customer} did not attend the scheduled appointment.`;
//           to = "/dashboard/approved-appointments";
//           break;

//         case "CANCELLED":
//           title = "Appointment Cancelled";
//           desc = `The appointment for ${customer} was cancelled.`;
//           to = "/dashboard";
//           break;

//         default:
//           break;
//       }

//       return {
//         id: a._id,
//         status: (a.status || "").toUpperCase(),
//         title,
//         desc,
//         time: a.updatedAt || a.createdAt,
//         to,
//       };
//     });

//     return res.json({ success: true, data: mapped });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to load updates",
//     });
//   }
// };


const Appointment = require("../../model/Appointment");

/* =========================================================
   DASHBOARD SUMMARY
   GET /api/appointments/dashboard
========================================================= */
const getAppointmentDashboard = async (req, res) => {
  try {
    const [
      total,
      pending,
      approved,
      completed,
      rejected,
      cancelled,
      noShow,
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "PENDING" }),
      Appointment.countDocuments({ status: "APPROVED" }),
      Appointment.countDocuments({ status: "COMPLETED" }),
      Appointment.countDocuments({ status: "REJECTED" }),
      Appointment.countDocuments({ status: "CANCELLED" }),
      Appointment.countDocuments({ status: "NO_SHOW" }),
    ]);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayRequests = await Appointment.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const lastActivities = await Appointment.find()
      .sort({ updatedAt: -1 })
      .limit(50)
      .populate("customerId", "fullName phone email gender")
      .populate("serviceId", "name code")
      .populate("assignedUserId", "fullName role email")
      .select(
        "customerId serviceId assignedUserId appointmentDate status createdAt updatedAt"
      );

    return res.json({
      success: true,
      data: {
        totals: { total, todayRequests },
        byStatus: { pending, approved, completed, rejected, cancelled, noShow },
        lastActivities,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load dashboard data",
    });
  }
};

/* =========================================================
   COUNTS (Sidebar Badges)
   GET /api/dashboard/counts
========================================================= */
const getCounts = async (req, res) => {
  try {
    const [pending, approved, completed] = await Promise.all([
      Appointment.countDocuments({ status: "PENDING" }),
      Appointment.countDocuments({ status: "APPROVED" }),
      Appointment.countDocuments({ status: "COMPLETED" }),
    ]);

    return res.json({
      success: true,
      data: { PENDING: pending, APPROVED: approved, COMPLETED: completed },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load counts",
    });
  }
};

/* =========================================================
   LATEST UPDATES
   GET /api/dashboard/updates
========================================================= */
const getLatestUpdates = async (req, res) => {
  try {
    const latest = await Appointment.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .select("status updatedAt createdAt customerId serviceId")
      .populate("customerId", "fullName")
      .populate("serviceId", "name");

    const mapped = latest.map((a) => {
      const customer = a.customerId?.fullName || "A customer";
      const service = a.serviceId?.name || "the requested service";

      let title = "Appointment Update";
      let desc = "The appointment status has been updated.";
      let to = "/dashboard";

      switch ((a.status || "").toUpperCase()) {
        case "PENDING":
          title = "New Appointment Submitted";
          desc = `A new request from ${customer} for ${service} is awaiting review.`;
          to = "/dashboard/pending-appointments";
          break;

        case "APPROVED":
          title = "Appointment Approved";
          desc = `The appointment for ${customer} has been approved and scheduled.`;
          to = "/dashboard/approved-appointments";
          break;

        case "COMPLETED":
          title = "Service Completed";
          desc = `The appointment for ${customer} has been completed successfully.`;
          to = "/dashboard/completed-appointments";
          break;

        case "REJECTED":
          title = "Request Declined";
          desc = `The appointment request submitted by ${customer} was declined.`;
          to = "/dashboard/pending-appointments";
          break;

        case "NO_SHOW":
          title = "Customer Did Not Attend";
          desc = `${customer} did not attend the scheduled appointment.`;
          to = "/dashboard/approved-appointments";
          break;

        case "CANCELLED":
          title = "Appointment Cancelled";
          desc = `The appointment for ${customer} was cancelled.`;
          to = "/dashboard";
          break;

        default:
          break;
      }

      return {
        id: a._id,
        status: (a.status || "").toUpperCase(),
        title,
        desc,
        time: a.updatedAt || a.createdAt,
        to,
      };
    });

    return res.json({ success: true, data: mapped });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load updates",
    });
  }
};

// ✅ IMPORTANT: hal style oo exports ah (kan ayaa kaa badbaadinaya undefined)
module.exports = {
  getAppointmentDashboard,
  getCounts,
  getLatestUpdates,
};