

// module.exports = mongoose.model("Appointment", appointmentSchema);
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    /* =========================
       CUSTOMER
    ========================= */
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    /* =========================
       SERVICE
    ========================= */
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    /* =========================
       APPOINTMENT DATE
    ========================= */
    appointmentDate: {
      type: Date,
      required: true,
    },

    /* =========================
       ASSIGNED STAFF / ADMIN
       (✅ FIX FOR populate ERROR)
    ========================= */
    assignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // not assigned initially
    },

    /* =========================
       STATUS
    ========================= */
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },

    /* =========================
       DOCUMENTS (UPLOADS)
    ========================= */
    documents: [
      {
        filename: {
          type: String,
          required: true,
        },
        originalName: {
          type: String,
          required: true,
        },
        size: Number,
        mimeType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
