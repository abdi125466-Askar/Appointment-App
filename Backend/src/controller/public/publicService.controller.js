// const mongoose = require("mongoose");
// const Service = require("../../model/Service");
// const Appointment = require("../../model/Appointment");

// exports.getActiveServices = async (req, res) => {
//   try {
//     const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
//     return res.json({ success: true, data: services });
//   } catch (err) {
//     console.error("getActiveServices error:", err);
//     return res.status(500).json({ success: false, message: "Failed to fetch services" });
//   }
// };

// exports.getServiceAvailability = async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     const { date } = req.query; // ?date=YYYY-MM-DD

//     if (!mongoose.Types.ObjectId.isValid(serviceId)) {
//       return res.status(400).json({ success: false, message: "Invalid serviceId" });
//     }

//     if (!date) {
//       return res.status(400).json({ success: false, message: "Missing date" });
//     }

//     const service = await Service.findById(serviceId);
//     if (!service || !service.isActive) {
//       return res.status(404).json({ success: false, message: "Service not available" });
//     }

//     const start = new Date(date);
//     start.setHours(0, 0, 0, 0);
//     const end = new Date(date);
//     end.setHours(23, 59, 59, 999);

//     const limit = Number(service.maxCustomersPerDay || 0);
//     if (limit <= 0) {
//       return res.json({
//         success: true,
//         data: { available: true, remaining: null, message: "Available ✅" },
//       });
//     }

//     const booked = await Appointment.countDocuments({
//       serviceId,
//       appointmentDate: { $gte: start, $lte: end },
//       status: { $in: ["PENDING", "APPROVED"] },
//     });

//     const remaining = Math.max(limit - booked, 0);
//     const available = booked < limit;

//     return res.json({
//       success: true,
//       data: {
//         available,
//         remaining,
//         booked,
//         limit,
//         message: available ? `Available ✅ (Remaining: ${remaining})` : "Fully booked ❌",
//       },
//     });
//   } catch (err) {
//     console.error("getServiceAvailability error:", err);
//     return res.status(500).json({ success: false, message: "Failed to check availability" });
//   }
// };


const mongoose = require("mongoose");
const Service = require("../../model/Service");
const Appointment = require("../../model/Appointment");

/**
 * ======================================================
 * GET ACTIVE SERVICES (PUBLIC)
 * GET /api/public/services
 * ======================================================
 */
exports.getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: services,
    });
  } catch (err) {
    console.error("getActiveServices error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

/**
 * ======================================================
 * GET SERVICE AVAILABILITY (PUBLIC)
 * GET /api/public/services/:serviceId/availability?date=YYYY-MM-DD
 * ======================================================
 */
exports.getServiceAvailability = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query;

    // 1) Validate serviceId
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: "Invalid serviceId" });
    }

    // 2) Validate date
    if (!date) {
      return res.status(400).json({ success: false, message: "Missing date" });
    }

    // 3) Validate service exists and active
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ success: false, message: "Service not available" });
    }

    // 4) Normalize date range
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // 5) If limit is 0 or less, always available
    const limit = Number(service.maxCustomersPerDay || 0);
    if (limit <= 0) {
      return res.json({
        success: true,
        data: {
          available: true,
          remaining: null,
          booked: null,
          limit,
          message: "Available ✅",
        },
      });
    }

    // 6) Count booked appointments (pending+approved)
    const booked = await Appointment.countDocuments({
      serviceId,
      appointmentDate: { $gte: start, $lte: end },
      status: { $in: ["PENDING", "APPROVED"] },
    });

    const remaining = Math.max(limit - booked, 0);
    const available = booked < limit;

    return res.json({
      success: true,
      data: {
        available,
        remaining,
        booked,
        limit,
        message: available ? `Available ✅ (Remaining: ${remaining})` : "Fully booked ❌",
      },
    });
  } catch (err) {
    console.error("getServiceAvailability error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to check availability",
    });
  }
};