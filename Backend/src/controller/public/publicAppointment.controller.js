const mongoose = require("mongoose");
const Customer = require("../../model/Customer");
const Appointment = require("../../model/Appointment");
const Service = require("../../model/Service");

/**
 * ======================================================
 * CREATE PUBLIC APPOINTMENT + OPTIONAL PDF
 * ======================================================
 */
// const { sendAppointmentRegistrationEmail } = require("../../utils/sendAppointmentStatusEmail");

// exports.createPublicAppointment = async (req, res) => {
//   try {
//     const { fullName, phone, email, gender, serviceId, appointmentDate } = req.body;

//     // 1️⃣ BASIC VALIDATION
//     if (!fullName || !phone || !gender || !serviceId || !appointmentDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     // 2️⃣ VALIDATE serviceId
//     if (!mongoose.Types.ObjectId.isValid(serviceId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid serviceId",
//       });
//     }

//     // 3️⃣ VALIDATE SERVICE
//     const service = await Service.findById(serviceId);
//     if (!service || service.isActive === false) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not available",
//       });
//     }

//     // 4️⃣ VALIDATE DATE
//     const parsed = new Date(appointmentDate);
//     if (Number.isNaN(parsed.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid appointmentDate",
//       });
//     }

//     const start = new Date(parsed);
//     start.setHours(0, 0, 0, 0);

//     const end = new Date(parsed);
//     end.setHours(23, 59, 59, 999);

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (start < today) {
//       return res.status(400).json({
//         success: false,
//         message: "Past dates are not allowed",
//       });
//     }

//     // 5️⃣ CAPACITY CHECK
//     const maxPerDay = Number(service.maxCustomersPerDay || 0);

//     if (maxPerDay > 0) {
//       const booked = await Appointment.countDocuments({
//         serviceId,
//         appointmentDate: { $gte: start, $lte: end },
//         status: { $in: ["PENDING", "APPROVED"] },
//       });

//       if (booked >= maxPerDay) {
//         return res.status(400).json({
//           success: false,
//           message: "This date is fully booked",
//         });
//       }
//     }

//     // 6️⃣ FIND OR CREATE CUSTOMER
//     const cleanPhone = String(phone).trim();
//     const cleanName = String(fullName).trim();
//     const cleanEmail = email ? String(email).trim() : "";

//     const customer = await Customer.findOneAndUpdate(
//       { phone: cleanPhone },
//       {
//         $set: {
//           fullName: cleanName,
//           email: cleanEmail,
//           gender,
//         },
//         $setOnInsert: { phone: cleanPhone },
//       },
//       { new: true, upsert: true }
//     );

//     // 7️⃣ PREVENT DUPLICATE BOOKING
//     const exists = await Appointment.findOne({
//       customerId: customer._id,
//       serviceId,
//       appointmentDate: { $gte: start, $lte: end },
//       status: { $in: ["PENDING", "APPROVED"] },
//     });

//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: "You already booked this service on this date",
//       });
//     }

//     // 8️⃣ OPTIONAL DOCUMENT
//     const documents = [];
//     if (req.file) {
//       documents.push({
//         filename: req.file.filename,
//         originalName: req.file.originalname,
//         size: req.file.size,
//         mimeType: req.file.mimetype,
//         uploadedAt: new Date(),
//       });
//     }

//     // 9️⃣ CREATE APPOINTMENT
//     const appointment = await Appointment.create({
//       customerId: customer._id,
//       serviceId,
//       appointmentDate: start,
//       status: "PENDING",
//       documents,
//     });

//     // 🔟 SEND REGISTRATION EMAIL (if email exists)
//     if (customer.email) {
//       try {
//         await sendAppointmentRegistrationEmail({
//           email: customer.email,
//           fullName: customer.fullName,
//           serviceName: service.name,
//           appointmentDate: appointment.appointmentDate,
//           appointmentId: appointment._id,
//         });
//       } catch (emailError) {
//         console.error("Email sending failed:", emailError.message);
//         // Do NOT stop appointment creation if email fails
//       }
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Appointment created successfully. Your process will begin shortly.",
//       appointmentId: appointment._id, // ✅ Added directly
//       data: {
//         customer: {
//           fullName: customer.fullName,
//           phone: customer.phone,
//         },
//         service: {
//           id: service._id,
//           name: service.name,
//         },
//         appointmentDate: appointment.appointmentDate,
//         status: appointment.status,
//         hasDocument: documents.length > 0,
//         documents,
//       },
//     });

//   } catch (err) {
//     console.error("Create appointment error:", err);

//     const isProd = process.env.NODE_ENV === "production";

//     return res.status(500).json({
//       success: false,
//       message: err?.message || "Failed to create appointment",
//       ...(isProd ? {} : { error: err?.errors || err }),
//     });
//   }
// };

exports.createPublicAppointment = async (req, res) => {
  try {
    const { fullName, phone, email, gender, serviceId, appointmentDate } = req.body;

    // 1) BASIC VALIDATION
    if (!fullName || !phone || !gender || !serviceId || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 2) VALIDATE serviceId format
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid serviceId",
      });
    }

    // 3) VALIDATE SERVICE
    const service = await Service.findById(serviceId);
    if (!service || service.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Service not available",
      });
    }

    // 4) VALIDATE DATE (invalid date / past date)
    const parsed = new Date(appointmentDate);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointmentDate",
      });
    }

    // normalize request day range
    const start = new Date(parsed);
    start.setHours(0, 0, 0, 0);

    const end = new Date(parsed);
    end.setHours(23, 59, 59, 999);

    // ✅ PAST DATE BLOCK (Backend)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not allowed",
      });
    }

    // 5) CAPACITY CHECK
    const maxPerDay = Number(service.maxCustomersPerDay || 0);
    if (maxPerDay > 0) {
      const booked = await Appointment.countDocuments({
        serviceId,
        appointmentDate: { $gte: start, $lte: end },
        status: { $in: ["PENDING", "APPROVED"] },
      });

      if (booked >= maxPerDay) {
        return res.status(400).json({
          success: false,
          message: "This date is fully booked",
        });
      }
    }

    // 6) FIND OR CREATE CUSTOMER (UPSERT)
    const cleanPhone = String(phone).trim();
    const cleanName = String(fullName).trim();
    const cleanEmail = email ? String(email).trim() : "";

    const customer = await Customer.findOneAndUpdate(
      { phone: cleanPhone },
      {
        $set: {
          fullName: cleanName,
          email: cleanEmail,
          gender,
        },
        $setOnInsert: {
          phone: cleanPhone,
        },
      },
      { new: true, upsert: true }
    );

    // 7) PREVENT DUPLICATE BOOKING
    const exists = await Appointment.findOne({
      customerId: customer._id,
      serviceId,
      appointmentDate: { $gte: start, $lte: end },
      status: { $in: ["PENDING", "APPROVED"] },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "You already booked this service on this date",
      });
    }

    // 8) OPTIONAL DOCUMENT
    const documents = [];
    if (req.file) {
      documents.push({
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        uploadedAt: new Date(),
      });
    }

    // 9) CREATE APPOINTMENT
    const appointment = await Appointment.create({
      customerId: customer._id,
      serviceId,
      appointmentDate: start,
      status: "PENDING",
      documents,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: {
        appointmentId: appointment._id,
        customer: {
          fullName: customer.fullName,
          phone: customer.phone,
        },
        service: {
          id: service._id,
          name: service.name,
        },
        appointmentDate: appointment.appointmentDate,
        status: appointment.status,
        hasDocument: documents.length > 0,
        documents,
      },
    });
  } catch (err) {
    console.error("Create appointment error:", err);

    const isProd = process.env.NODE_ENV === "production";

    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to create appointment",
      ...(isProd
        ? {}
        : {
            // ✅ DEV ONLY
            error: err?.errors || err,
          }),
    });
  }
};

/**
 * ======================================================
 * GET APPOINTMENT STATUS (PUBLIC – BY APPOINTMENT ID)
 * ======================================================
 */
exports.getMyAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // 1) VALIDATE ID FORMAT
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    // 2) FIND APPOINTMENT
    const appointment = await Appointment.findById(appointmentId)
      .populate("serviceId", "name")
      .populate("customerId", "fullName phone");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // 3) RESPONSE
    return res.status(200).json({
      success: true,
      data: {
        appointmentId: appointment._id,
        customer: {
          fullName: appointment.customerId?.fullName,
          phone: appointment.customerId?.phone,
        },
        service: {
          id: appointment.serviceId?._id,
          name: appointment.serviceId?.name,
        },
        appointmentDate: appointment.appointmentDate,
        status: appointment.status,
        hasDocument: (appointment.documents?.length || 0) > 0,
        documentsCount: appointment.documents?.length || 0,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get appointment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment status",
    });
  }
};