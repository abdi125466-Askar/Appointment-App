const mongoose = require("mongoose");
const Customer = require("../../model/Customer");
const Appointment = require("../../model/Appointment");
const Service = require("../../model/Service");

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const FRIDAY_DAY_INDEX = 5;

const buildWorkingSlots = () => {
  const slots = [];

  for (let hour = 7; hour <= 11; hour += 1) {
    for (const minute of [0, 15, 30, 45]) {
      slots.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
      );
    }
  }

  return slots;
};

const WORKING_SLOTS = buildWorkingSlots();

const countDigits = (value = "") => String(value).replace(/\D/g, "").length;

const normalizeDateRange = (dateString) => {
  const parsed = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const start = new Date(parsed);
  start.setHours(0, 0, 0, 0);

  const end = new Date(parsed);
  end.setHours(23, 59, 59, 999);

  return { parsed, start, end };
};

const isFriday = (dateObj) => dateObj.getDay() === FRIDAY_DAY_INDEX;

const isSameDay = (a, b) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const getAvailableSlotsForDate = (selectedDate, bookedTimes = []) => {
  const bookedSet = new Set(
    bookedTimes.filter(Boolean).map((t) => String(t).trim())
  );

  const now = new Date();
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedIsToday = isSameDay(selected, today);

  return WORKING_SLOTS.filter((slot) => {
    if (bookedSet.has(slot)) return false;

    if (!selectedIsToday) return true;

    const [hours, minutes] = slot.split(":").map(Number);

    const slotStart = new Date(selected);
    slotStart.setHours(hours, minutes || 0, 0, 0);

    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 15);

    if (now >= slotEnd) {
      return false;
    }

    return true;
  });
};

/**
 * ======================================================
 * GET AVAILABLE PUBLIC SLOTS
 * ======================================================
 */
exports.getAvailablePublicSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({
        success: false,
        message: "serviceId and date are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid serviceId",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service || service.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Service not available",
      });
    }

    const normalized = normalizeDateRange(date);
    if (!normalized) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date",
      });
    }

    const { parsed, start, end } = normalized;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not allowed",
      });
    }

    if (isFriday(parsed)) {
      return res.status(400).json({
        success: false,
        message: "Friday is off. Please choose Saturday to Thursday.",
      });
    }

    const bookedAppointments = await Appointment.find({
      serviceId,
      appointmentDate: { $gte: start, $lte: end },
      status: { $in: ["PENDING", "APPROVED"] },
    }).select("appointmentTime");

    const bookedTimes = bookedAppointments
      .map((item) => item.appointmentTime)
      .filter(Boolean);

    let availableSlots = getAvailableSlotsForDate(parsed, bookedTimes);

    const maxPerDay = Number(service.maxCustomersPerDay || 0);
    if (maxPerDay > 0) {
      const bookedCount = await Appointment.countDocuments({
        serviceId,
        appointmentDate: { $gte: start, $lte: end },
        status: { $in: ["PENDING", "APPROVED"] },
      });

      if (bookedCount >= maxPerDay) {
        availableSlots = [];
      }
    }

    return res.status(200).json({
      success: true,
      message:
        availableSlots.length > 0
          ? "Available time slots loaded successfully"
          : "No active slots available on this date",
      data: {
        date,
        workingDays: "Saturday to Thursday",
        workingHours: "07:00 to 12:00",
        availableSlots,
      },
    });
  } catch (err) {
    console.error("Get available public slots error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to get available time slots",
    });
  }
};

/**
 * ======================================================
 * CREATE PUBLIC APPOINTMENT
 * ======================================================
 */
exports.createPublicAppointment = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      gender,
      serviceId,
      appointmentDate,
      appointmentTime,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !email ||
      !gender ||
      !serviceId ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const cleanName = String(fullName).trim();
    const cleanPhone = String(phone).trim();
    const cleanEmail = String(email).trim();
    const cleanTime = String(appointmentTime).trim();

    if (cleanName.length < 7) {
      return res.status(400).json({
        success: false,
        message: "Full Name must be at least 7 characters",
      });
    }

    if (countDigits(cleanPhone) < 7) {
      return res.status(400).json({
        success: false,
        message: "Phone must contain at least 7 digits",
      });
    }

    if (!GMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email. Please enter a complete Gmail address ending with @gmail.com",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Supporting document is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid serviceId",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service || service.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Service not available",
      });
    }

    const normalized = normalizeDateRange(appointmentDate);
    if (!normalized) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointmentDate",
      });
    }

    const { parsed, start, end } = normalized;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not allowed",
      });
    }

    if (isFriday(parsed)) {
      return res.status(400).json({
        success: false,
        message: "Friday is off. Please choose Saturday to Thursday.",
      });
    }

    if (!WORKING_SLOTS.includes(cleanTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment time",
      });
    }

    if (isSameDay(start, today)) {
      const [hours, minutes] = cleanTime.split(":").map(Number);

      const slotStart = new Date(start);
      slotStart.setHours(hours, minutes || 0, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + 15);

      if (new Date() >= slotEnd) {
        return res.status(400).json({
          success: false,
          message: "This selected time has already passed",
        });
      }
    }

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

    const slotTaken = await Appointment.findOne({
      serviceId,
      appointmentDate: { $gte: start, $lte: end },
      appointmentTime: cleanTime,
      status: { $in: ["PENDING", "APPROVED"] },
    });

    if (slotTaken) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked. Please choose another time.",
      });
    }

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

    const exists = await Appointment.findOne({
      customerId: customer._id,
      serviceId,
      appointmentDate: { $gte: start, $lte: end },
      appointmentTime: cleanTime,
      status: { $in: ["PENDING", "APPROVED"] },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "You already booked this service on this date and time",
      });
    }

    const documents = [
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        uploadedAt: new Date(),
      },
    ];

    const appointment = await Appointment.create({
      customerId: customer._id,
      serviceId,
      appointmentDate: start,
      appointmentTime: cleanTime,
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
          email: customer.email,
        },
        service: {
          id: service._id,
          name: service.name,
        },
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status: appointment.status,
        hasDocument: true,
        documents,
      },
    });
  } catch (err) {
    console.error("Create appointment error:", err);

    const isProd = process.env.NODE_ENV === "production";

    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to create appointment",
      ...(isProd ? {} : { error: err?.errors || err }),
    });
  }
};

/**
 * ======================================================
 * GET APPOINTMENT STATUS
 * ======================================================
 */
exports.getMyAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("serviceId", "name")
      .populate("customerId", "fullName phone");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

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
        appointmentTime: appointment.appointmentTime || "",
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