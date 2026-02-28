// const Appointment = require("../../model/Appointment");
// const Customer = require("../../model/Customer");
// const Service = require("../../model/Service");

// /* =========================
//    CREATE APPOINTMENT
//    WITH DAILY LIMIT HANDLING
// ========================= */
// exports.createAppointment = async (req, res) => {
//   try {
//     const {
//       customerId,
//       serviceId,
//       appointmentDate,
//       documentsSubmitted,
//       identityProvided,
//       passportProvided,
//       notes,
//     } = req.body;

//     if (!customerId || !serviceId || !appointmentDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer, service, and appointment date are required",
//       });
//     }

//     const customer = await Customer.findById(customerId);
//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     const service = await Service.findById(serviceId);
//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not found",
//       });
//     }

//     let finalDate = new Date(appointmentDate);
//     finalDate.setHours(0, 0, 0, 0);

//     const maxPerDay = Number(service.maxCustomersPerDay || 0);

//     if (maxPerDay > 0) {
//       let available = false;

//       while (!available) {
//         const start = new Date(finalDate);
//         start.setHours(0, 0, 0, 0);

//         const end = new Date(finalDate);
//         end.setHours(23, 59, 59, 999);

//         const count = await Appointment.countDocuments({
//           serviceId,
//           appointmentDate: { $gte: start, $lte: end },
//         });

//         if (count < maxPerDay) {
//           available = true;
//         } else {
//           finalDate.setDate(finalDate.getDate() + 1);
//         }
//       }
//     }

//     const appointment = await Appointment.create({
//       customerId,
//       serviceId,
//       appointmentDate: finalDate,
//       documentsSubmitted: !!documentsSubmitted,
//       identityProvided: !!identityProvided,
//       passportProvided: !!passportProvided,
//       notes,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Appointment created successfully",
//       adjustedDate: finalDate,
//       data: appointment,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create appointment",
//     });
//   }
// };

// /* =========================
//    GET PENDING APPOINTMENTS
// ========================= */
// // exports.getAppointments = async (req, res) => {
// //   try {
// //     const appointments = await Appointment.find({ status: "PENDING" })
// //       .populate("customerId", "fullName phone")
// //       .populate("serviceId", "name code")
// //       .sort({ appointmentDate: -1 })
// //       .lean(); // 👈 IMPORTANT (allows mutation)

// // const baseUrl =
// //   process.env.BACKEND_URL ||
// //   `${req.protocol}://${req.get("host")}`;

// //     const data = appointments.map((a) => ({
// //       ...a,
// //       documents: (a.documents || []).map((doc) => ({
// //         ...doc,
// //       url: `${baseUrl}/uploads/appointments/${doc.filename}`,
// //       })),
// //     }));

// //     return res.json({
// //       success: true,
// //       data,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message || "Failed to fetch appointments",
// //     });
// //   }
// // };
// exports.getAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ status: "PENDING" })
//       .populate("customerId", "fullName phone")
//       .populate("serviceId", "name code")
//       .sort({ appointmentDate: -1 })
//       .lean(); // 👈 IMPORTANT (allows mutation)

//     // 🔹 Build base URL dynamically
//     const baseUrl =
//       process.env.BACKEND_URL ||
//       `${req.protocol}://${req.get("host")}`;

//     // 🔹 Attach URL to each document
//     const data = appointments.map((appointment) => ({
//       ...appointment,
//       documents: Array.isArray(appointment.documents)
//         ? appointment.documents.map((doc) => ({
//             ...doc,
//             url: `${baseUrl}/uploads/appointments/${doc.filename}`,
//           }))
//         : [],
//     }));

//     return res.status(200).json({
//       success: true,
//       count: data.length,
//       data,
//     });

//   } catch (error) {
//     console.error("GET APPOINTMENTS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch appointments",
//     });
//   }
// };
// // exports.getAppointmentsByStatus = async (req, res) => {
// //   try {
// //     const { status } = req.query;

// //     // ✅ include NO_SHOW
// //     const allowedStatuses = ["PENDING", "APPROVED", "COMPLETED", "REJECTED", "NO_SHOW"];

// //     if (!allowedStatuses.includes(status)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
// //       });
// //     }

// //     const appointments = await Appointment.find({ status })
// //       .populate("customerId", "fullName phone")
// //       .populate("serviceId", "name code")
// //       .populate("assignedUserId", "fullName email role")
// //       .sort({ appointmentDate: -1 });

// //     return res.json({
// //       success: true,
// //       count: appointments.length,
// //       data: appointments,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message || "Failed to fetch appointments",
// //     });
// //   }
// // };
// exports.getAppointmentsByStatus = async (req, res) => {
//   try {
//     const { status } = req.query;

//     const allowedStatuses = [
//       "PENDING",
//       "APPROVED",
//       "COMPLETED",
//       "REJECTED",
//       "NO_SHOW",
//     ];

//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
//       });
//     }

//     // 👇 VERY IMPORTANT: use .lean()
//     const appointments = await Appointment.find({ status })
//       .populate("customerId", "fullName phone")
//       .populate("serviceId", "name code")
//       .populate("assignedUserId", "fullName email role")
//       .sort({ appointmentDate: -1 })
//       .lean();

//     // 👇 Build base URL dynamically
//     const baseUrl =
//       process.env.BACKEND_URL ||
//       `${req.protocol}://${req.get("host")}`;

//     // 👇 Attach PDF URL
//     const data = appointments.map((appointment) => ({
//       ...appointment,
//       documents: Array.isArray(appointment.documents)
//         ? appointment.documents.map((doc) => ({
//             ...doc,
//             url: `${baseUrl}/uploads/appointments/${doc.filename}`,
//           }))
//         : [],
//     }));

//     return res.status(200).json({
//       success: true,
//       count: data.length,
//       data,
//     });

//   } catch (error) {
//     console.error("GET APPOINTMENTS BY STATUS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch appointments",
//     });
//   }
// };
// /* =========================
//    GET APPOINTMENT BY ID
// ========================= */
// exports.getAppointmentById = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id)
//       .populate("customerId", "fullName phone")
//       .populate("serviceId", "name code");

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     return res.json({ success: true, data: appointment });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch appointment",
//     });
//   }
// };

// /* =====================================================
//    ✅ UPDATE ONLY ASSIGNED USER
// ===================================================== */
// exports.updateAssignedUser = async (req, res) => {
//   try {
//     const { assignedUserId, notes } = req.body;

//     if (!assignedUserId) {
//       return res.status(400).json({
//         success: false,
//         message: "assignedUserId is required",
//       });
//     }

//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       {
//         assignedUserId,
//         ...(notes !== undefined && { notes }),
//       },
//       { new: true, runValidators: true }
//     )
//       .populate("customerId", "fullName phone")
//       .populate("serviceId", "name code")
//       .populate("assignedUserId", "fullName role email");

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "User assigned successfully",
//       data: appointment,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to assign user",
//     });
//   }
// };

// /* =========================
//    UPDATE GENERAL FIELDS
// ========================= */
// // exports.updateAppointment = async (req, res) => {
// //   try {
// //     const {
// //       appointmentDate,
// //       documentsSubmitted,
// //       identityProvided,
// //       passportProvided,
// //       status,
// //       notes,
// //     } = req.body;

// //     // ✅ include NO_SHOW
// //     const allowedStatuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "NO_SHOW"];
// //     if (status && !allowedStatuses.includes(status)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
// //       });
// //     }

// //     const appointment = await Appointment.findByIdAndUpdate(
// //       req.params.id,
// //       {
// //         ...(appointmentDate !== undefined && { appointmentDate }),
// //         ...(documentsSubmitted !== undefined && { documentsSubmitted }),
// //         ...(identityProvided !== undefined && { identityProvided }),
// //         ...(passportProvided !== undefined && { passportProvided }),
// //         ...(status !== undefined && { status }),
// //         ...(notes !== undefined && { notes }),
// //       },
// //       { new: true, runValidators: true }
// //     );

// //     if (!appointment) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Appointment not found",
// //       });
// //     }

// //     return res.json({
// //       success: true,
// //       message: "Appointment updated successfully",
// //       data: appointment,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message || "Failed to update appointment",
// //     });
// //   }
// // };
// const { sendAppointmentStatusEmail } = require("../../utils/sendAppointmentStatusEmail");
// exports.updateAppointment = async (req, res) => {
//   try {
//     const {
//       appointmentDate,
//       documentsSubmitted,
//       identityProvided,
//       passportProvided,
//       status,
//       notes,
//     } = req.body;

//     const allowedStatuses = [
//       "PENDING",
//       "APPROVED",
//       "REJECTED",
//       "COMPLETED",
//       "NO_SHOW",
//     ];

//     if (status && !allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
//       });
//     }

//     // 🔹 Get old appointment first (to compare status)
//     const oldAppointment = await Appointment.findById(req.params.id)
//       .populate("customerId", "fullName email")
//       .populate("serviceId", "name");

//     if (!oldAppointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     const previousStatus = oldAppointment.status;

//     // 🔹 Update appointment
//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...(appointmentDate !== undefined && { appointmentDate }),
//         ...(documentsSubmitted !== undefined && { documentsSubmitted }),
//         ...(identityProvided !== undefined && { identityProvided }),
//         ...(passportProvided !== undefined && { passportProvided }),
//         ...(status !== undefined && { status }),
//         ...(notes !== undefined && { notes }),
//       },
//       { new: true, runValidators: true }
//     )
//       .populate("customerId", "fullName email")
//       .populate("serviceId", "name");

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     // ✅ Send email ONLY if status changed
//     if (
//       status &&
//       previousStatus !== status &&
//       appointment.customerId?.email
//     ) {
//       await sendAppointmentStatusEmail({
//         email: appointment.customerId.email,
//         fullName: appointment.customerId.fullName,
//         status: appointment.status,
//         serviceName: appointment.serviceId?.name || "Service",
//         appointmentDate: appointment.appointmentDate,
//         appointmentId: appointment._id,
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Appointment updated successfully",
//       appointmentId: appointment._id, // ✅ Added here
//       data: appointment,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update appointment",
//     });
//   }
// };
// // exports.updateAppointment = async (req, res) => {
// //   try {
// //     const {
// //       appointmentDate,
// //       documentsSubmitted,
// //       identityProvided,
// //       passportProvided,
// //       status,
// //       notes,
// //     } = req.body;

// //     const allowedStatuses = [
// //       "PENDING",
// //       "APPROVED",
// //       "REJECTED",
// //       "COMPLETED",
// //       "NO_SHOW",
// //     ];

// //     if (status && !allowedStatuses.includes(status)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
// //       });
// //     }

// //     // 🔹 Get old appointment first (to compare status)
// //     const oldAppointment = await Appointment.findById(req.params.id)
// //       .populate("customerId", "fullName email")
// //       .populate("serviceId", "name");

// //     if (!oldAppointment) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Appointment not found",
// //       });
// //     }

// //     const previousStatus = oldAppointment.status;

// //     // 🔹 Update appointment
// //     const appointment = await Appointment.findByIdAndUpdate(
// //       req.params.id,
// //       {
// //         ...(appointmentDate !== undefined && { appointmentDate }),
// //         ...(documentsSubmitted !== undefined && { documentsSubmitted }),
// //         ...(identityProvided !== undefined && { identityProvided }),
// //         ...(passportProvided !== undefined && { passportProvided }),
// //         ...(status !== undefined && { status }),
// //         ...(notes !== undefined && { notes }),
// //       },
// //       { new: true, runValidators: true }
// //     )
// //       .populate("customerId", "fullName email")
// //       .populate("serviceId", "name");

// //     if (!appointment) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Appointment not found",
// //       });
// //     }

// //     // ✅ Send email ONLY if status changed
// //     if (
// //       status &&
// //       previousStatus !== status &&
// //       appointment.customerId?.email
// //     ) {
// //       await sendAppointmentStatusEmail({
// //         email: appointment.customerId.email,
// //         fullName: appointment.customerId.fullName,
// //         status: appointment.status,
// //         serviceName: appointment.serviceId?.name || "Service",
// //         appointmentDate: appointment.appointmentDate,
// //       });
// //     }

// //     return res.json({
// //       success: true,
// //       message: "Appointment updated successfully",
// //       data: appointment,
// //     });

// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message || "Failed to update appointment",
// //     });
// //   }
// // };
// /* =========================
//    SOFT DELETE (CANCEL)
// ========================= */
// exports.deleteAppointment = async (req, res) => {
//   try {
//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { status: "REJECTED" },
//       { new: true }
//     );

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Appointment cancelled successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to cancel appointment",
//     });
//   }
// };

// /* =========================
//    PERMANENT DELETE
// ========================= */
// exports.deleteAppointmentPermanent = async (req, res) => {
//   try {
//     const appointment = await Appointment.findByIdAndDelete(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Appointment permanently deleted",
//       data: appointment,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to delete appointment permanently",
//     });
//   }
// };

// /* =====================================================
//    ✅ A) GET MY ASSIGNED APPOINTMENTS (APPROVED + COMPLETED + NO_SHOW + REJECTED)
//    GET /api/appointments/my/appointments
// ===================================================== */
// exports.getMyApprovedAppointments = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const appointments = await Appointment.find({
//       assignedUserId: userId,
//       status: { $in: ["APPROVED", "COMPLETED", "NO_SHOW", "REJECTED"] },
//     })
//       .populate("customerId", "fullName phone email gender")
//       .populate("serviceId", "name code")
//       .populate("assignedUserId", "fullName email role")
//       .sort({ appointmentDate: 1 });

//     return res.json({
//       success: true,
//       count: appointments.length,
//       data: appointments,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch assigned appointments",
//     });
//   }
// };

// /* =====================================================
//    ✅ B) EMPLOYEE DASHBOARD ANALYTICS (BY appointmentDate month/year)
//    GET /api/appointments/my/dashboard/analytics?month=2&year=2026
// ===================================================== */
// exports.getEmployeeDashboardAnalytics = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { month, year } = req.query;

//     if (!month || !year) {
//       return res.status(400).json({
//         success: false,
//         message: "month and year are required",
//       });
//     }

//     const m = Number(month);
//     const y = Number(year);

//     if (!Number.isFinite(m) || !Number.isFinite(y) || m < 1 || m > 12) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid month/year",
//       });
//     }

//     const startOfMonth = new Date(y, m - 1, 1, 0, 0, 0, 0);
//     const endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);

//     const appointments = await Appointment.find({
//       assignedUserId: userId,
//       appointmentDate: { $gte: startOfMonth, $lte: endOfMonth },
//       status: { $in: ["APPROVED", "COMPLETED", "NO_SHOW", "REJECTED"] },
//     })
//       .populate("customerId", "gender")
//       .populate("serviceId", "name");

//     let totalAssigned = appointments.length;
//     let completed = 0;
//     let approvedPending = 0;
//     let noShow = 0;
//     let rejected = 0;

//     const byGender = { MALE: 0, FEMALE: 0 };
//     const byService = {};

//     appointments.forEach((a) => {
//       if (a.status === "COMPLETED") completed++;
//       if (a.status === "APPROVED") approvedPending++;
//       if (a.status === "NO_SHOW") noShow++;
//       if (a.status === "REJECTED") rejected++;

//       const gender = a.customerId?.gender;
//       if (gender) byGender[gender] = (byGender[gender] || 0) + 1;

//       const serviceName = a.serviceId?.name;
//       if (serviceName) byService[serviceName] = (byService[serviceName] || 0) + 1;
//     });

//     return res.json({
//       success: true,
//       filters: { month: m, year: y },
//       data: {
//         summary: {
//           totalAssigned,
//           completed,
//           approvedPending,
//           noShow,
//           rejected,
//         },
//         byGender,
//         byService,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to load dashboard analytics",
//     });
//   }
// };

const Appointment = require("../../model/Appointment");
const Customer = require("../../model/Customer");
const Service = require("../../model/Service");
const mongoose = require("mongoose");
const { sendAppointmentStatusEmail } = require("../../utils/sendAppointmentStatusEmail");

/* =========================
   CREATE APPOINTMENT
========================= */
exports.createAppointment = async (req, res) => {
  try {
    const {
      customerId,
      serviceId,
      appointmentDate,
      documentsSubmitted,
      identityProvided,
      passportProvided,
      notes,
    } = req.body;

    if (!customerId || !serviceId || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Customer, service, and appointment date are required",
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    let finalDate = new Date(appointmentDate);
    finalDate.setHours(0, 0, 0, 0);

    const maxPerDay = Number(service.maxCustomersPerDay || 0);

    if (maxPerDay > 0) {
      let available = false;

      while (!available) {
        const start = new Date(finalDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(finalDate);
        end.setHours(23, 59, 59, 999);

        const count = await Appointment.countDocuments({
          serviceId,
          appointmentDate: { $gte: start, $lte: end },
          status: { $in: ["PENDING", "APPROVED"] }, // ✅ active only
        });

        if (count < maxPerDay) available = true;
        else finalDate.setDate(finalDate.getDate() + 1);
      }
    }

    const appointment = await Appointment.create({
      customerId,
      serviceId,
      appointmentDate: finalDate,
      documentsSubmitted: !!documentsSubmitted,
      identityProvided: !!identityProvided,
      passportProvided: !!passportProvided,
      notes,
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      adjustedDate: finalDate,
      data: appointment,
    });
  } catch (error) {
    console.error("CREATE APPOINTMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create appointment",
    });
  }
};

/* =========================
   ✅ GET APPOINTMENTS (DEFAULT PENDING OR BY STATUS)
   GET /api/appointments
   GET /api/appointments?status=COMPLETED
========================= */
exports.getAppointments = async (req, res) => {
  try {
    const { status } = req.query;

    const allowedStatuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "NO_SHOW"];
    const finalStatus = status ? String(status).toUpperCase() : "PENDING";

    if (!allowedStatuses.includes(finalStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    const appointments = await Appointment.find({ status: finalStatus })
      .populate("customerId", "fullName phone")
      .populate("serviceId", "name code")
      .populate("assignedUserId", "fullName email role")
      .sort({ appointmentDate: -1 })
      .lean();

    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

    const data = appointments.map((appointment) => ({
      ...appointment,
      documents: Array.isArray(appointment.documents)
        ? appointment.documents.map((doc) => ({
            ...doc,
            url: `${baseUrl}/uploads/appointments/${doc.filename}`,
          }))
        : [],
    }));

    return res.status(200).json({
      success: true,
      status: finalStatus,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("GET APPOINTMENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch appointments",
    });
  }
};

/* =========================
   GET APPOINTMENT BY ID
========================= */
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ prevent CastError (approved/completed/appointments etc)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment id",
      });
    }

    const appointment = await Appointment.findById(id)
      .populate("customerId", "fullName phone")
      .populate("serviceId", "name code");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.json({ success: true, data: appointment });
  } catch (error) {
    console.error("GET APPOINTMENT BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch appointment",
    });
  }
};

/* =========================
   UPDATE ONLY ASSIGNED USER
========================= */
exports.updateAssignedUser = async (req, res) => {
  try {
    const { assignedUserId, notes } = req.body;

    if (!assignedUserId) {
      return res.status(400).json({ success: false, message: "assignedUserId is required" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { assignedUserId, ...(notes !== undefined && { notes }) },
      { new: true, runValidators: true }
    )
      .populate("customerId", "fullName phone")
      .populate("serviceId", "name code")
      .populate("assignedUserId", "fullName role email");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.json({
      success: true,
      message: "User assigned successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("UPDATE ASSIGNED USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to assign user",
    });
  }
};

/* =========================
   UPDATE GENERAL FIELDS
========================= */
exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentDate, documentsSubmitted, identityProvided, passportProvided, status, notes } =
      req.body;

    const allowedStatuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "NO_SHOW"];
    const nextStatus = status ? String(status).toUpperCase() : undefined;

    if (nextStatus && !allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    const oldAppointment = await Appointment.findById(req.params.id)
      .populate("customerId", "fullName email")
      .populate("serviceId", "name");

    if (!oldAppointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const previousStatus = oldAppointment.status;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        ...(appointmentDate !== undefined && { appointmentDate }),
        ...(documentsSubmitted !== undefined && { documentsSubmitted }),
        ...(identityProvided !== undefined && { identityProvided }),
        ...(passportProvided !== undefined && { passportProvided }),
        ...(nextStatus !== undefined && { status: nextStatus }),
        ...(notes !== undefined && { notes }),
      },
      { new: true, runValidators: true }
    )
      .populate("customerId", "fullName email")
      .populate("serviceId", "name");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (nextStatus && previousStatus !== nextStatus && appointment.customerId?.email) {
      await sendAppointmentStatusEmail({
        email: appointment.customerId.email,
        fullName: appointment.customerId.fullName,
        status: appointment.status,
        serviceName: appointment.serviceId?.name || "Service",
        appointmentDate: appointment.appointmentDate,
        appointmentId: appointment._id,
      });
    }

    return res.json({
      success: true,
      message: "Appointment updated successfully",
      appointmentId: appointment._id,
      data: appointment,
    });
  } catch (error) {
    console.error("UPDATE APPOINTMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update appointment",
    });
  }
};

/* =========================
   SOFT DELETE (CANCEL)
========================= */
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "REJECTED" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("DELETE APPOINTMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel appointment",
    });
  }
};

/* =========================
   PERMANENT DELETE
========================= */
exports.deleteAppointmentPermanent = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.json({
      success: true,
      message: "Appointment permanently deleted",
      data: appointment,
    });
  } catch (error) {
    console.error("DELETE PERMANENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete appointment permanently",
    });
  }
};

/* =========================
   MY APPOINTMENTS
========================= */
exports.getMyApprovedAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({
      assignedUserId: userId,
      status: { $in: ["APPROVED", "COMPLETED", "NO_SHOW", "REJECTED"] },
    })
      .populate("customerId", "fullName phone email gender")
      .populate("serviceId", "name code")
      .populate("assignedUserId", "fullName email role")
      .sort({ appointmentDate: 1 });

    return res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.error("GET MY APPOINTMENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch assigned appointments",
    });
  }
};

/* =========================
   EMPLOYEE DASHBOARD ANALYTICS
========================= */
exports.getEmployeeDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: "month and year are required" });
    }

    const m = Number(month);
    const y = Number(year);

    if (!Number.isFinite(m) || !Number.isFinite(y) || m < 1 || m > 12) {
      return res.status(400).json({ success: false, message: "Invalid month/year" });
    }

    const startOfMonth = new Date(y, m - 1, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);

    const appointments = await Appointment.find({
      assignedUserId: userId,
      appointmentDate: { $gte: startOfMonth, $lte: endOfMonth },
      status: { $in: ["APPROVED", "COMPLETED", "NO_SHOW", "REJECTED"] },
    })
      .populate("customerId", "gender")
      .populate("serviceId", "name");

    let completed = 0,
      approvedPending = 0,
      noShow = 0,
      rejected = 0;

    const byGender = { MALE: 0, FEMALE: 0 };
    const byService = {};

    appointments.forEach((a) => {
      if (a.status === "COMPLETED") completed++;
      if (a.status === "APPROVED") approvedPending++;
      if (a.status === "NO_SHOW") noShow++;
      if (a.status === "REJECTED") rejected++;

      const gender = a.customerId?.gender;
      if (gender) byGender[gender] = (byGender[gender] || 0) + 1;

      const serviceName = a.serviceId?.name;
      if (serviceName) byService[serviceName] = (byService[serviceName] || 0) + 1;
    });

    return res.json({
      success: true,
      filters: { month: m, year: y },
      data: {
        summary: {
          totalAssigned: appointments.length,
          completed,
          approvedPending,
          noShow,
          rejected,
        },
        byGender,
        byService,
      },
    });
  } catch (error) {
    console.error("EMPLOYEE DASHBOARD ANALYTICS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load dashboard analytics",
    });
  }
};exports.getAllUsersAppointmentProgress = async (req, res) => {
  try {
    // Optional: filter by month & year
    const { month, year } = req.query;

    let dateFilter = {};

    if (month && year) {
      const m = Number(month);
      const y = Number(year);

      if (!Number.isFinite(m) || !Number.isFinite(y) || m < 1 || m > 12) {
        return res.status(400).json({
          success: false,
          message: "Invalid month/year",
        });
      }

      const startOfMonth = new Date(y, m - 1, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);

      dateFilter = {
        appointmentDate: { $gte: startOfMonth, $lte: endOfMonth },
      };
    }

    // Get all appointments that are assigned to users
    const appointments = await Appointment.find({
      assignedUserId: { $ne: null },
      ...dateFilter,
    })
      .populate("assignedUserId", "fullName email role")
      .lean();

    // Group by user
    const userMap = {};

    appointments.forEach((appt) => {
      const user = appt.assignedUserId;
      if (!user) return;

      const userId = user._id.toString();

      if (!userMap[userId]) {
        userMap[userId] = {
          userId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          totalAssigned: 0,
          completed: 0,
          approved: 0,
          rejected: 0,
          noShow: 0,
        };
      }

      userMap[userId].totalAssigned++;

      if (appt.status === "COMPLETED") userMap[userId].completed++;
      if (appt.status === "APPROVED") userMap[userId].approved++;
      if (appt.status === "REJECTED") userMap[userId].rejected++;
      if (appt.status === "NO_SHOW") userMap[userId].noShow++;
    });

    // Calculate percentages
    const result = Object.values(userMap).map((user) => {
      const completionPercentage =
        user.totalAssigned > 0
          ? Math.round((user.completed / user.totalAssigned) * 100)
          : 0;

      // Optional weighted performance score
      const performanceScore =
        user.totalAssigned > 0
          ? Math.round(
              ((user.completed * 1 +
                user.approved * 0.5 -
                user.noShow * 0.3 -
                user.rejected * 0.5) /
                user.totalAssigned) *
                100
            )
          : 0;

      return {
        ...user,
        completionPercentage,
        performanceScore,
      };
    });

    return res.json({
      success: true,
      count: result.length,
      filters: { month: month || null, year: year || null },
      data: result.sort((a, b) => b.completionPercentage - a.completionPercentage),
    });
  } catch (error) {
    console.error("ADMIN USERS PROGRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users progress",
    });
  }
};