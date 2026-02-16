const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ NEW: Bio
    bio: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      select: false,
    },

    googleId: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "DISABLED"],
      default: "APPROVED",
    },

    role: {
      type: String,
      enum: ["SUPERADMIN", "ADMIN", "STAFF", "USER"],
      default: "USER",
    },

    // ✅ Avatar (profile picture)
    avatarUrl: {
      type: String,
      default: null,
    },

    avatarPublicId: {
      type: String,
      default: null,
    },

    // Soft delete support (if used)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
