



const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      required: true,
    },

    // ✅ FIX: soft delete field (si refresh-ka uusan u soo celin)
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
