
// const mongoose = require("mongoose");

// const appointmentSchema = new mongoose.Schema(
//   {
//     customerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Customer",
//       required: true,
//     },

//     serviceId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Service",
//       required: true,
//     },

//     appointmentDate: {
//       type: Date,
//       required: true,
//     },

//     assignedUserId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     status: {
//       type: String,
//       enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
//       default: "PENDING",
//     },

//     documents: [
//       {
//         filename: { type: String, required: true },
//         originalName: { type: String, required: true },
//         size: Number,
//         mimeType: String,
//         uploadedAt: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Appointment", appointmentSchema);


const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    assignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      // ✅ Added NO_SHOW (5th status)
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "NO_SHOW"],
      default: "PENDING",
    },

    // ✅ Optional: add later if you want reason for rejected
    // rejectionReason: { type: String, default: "" },

    documents: [
      {
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        size: Number,
        mimeType: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);