


// const mongoose = require("mongoose");

// const ServiceSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },

//     // ✅ ALWAYS CAPS in DB
//     code: { type: String, required: true, unique: true, trim: true, uppercase: true },

//     description: String,

//     requiresDocuments: { type: Boolean, default: true },
//     requiresIdentity: { type: Boolean, default: false },
//     requiresPassport: { type: Boolean, default: false },
//     approvalRequired: { type: Boolean, default: true },

//     maxCustomersPerDay: { type: Number, default: 0 },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Service", ServiceSchema);

const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // ✅ ALWAYS CAPS in DB
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },

    description: String,

    requiresDocuments: { type: Boolean, default: true },
    requiresIdentity: { type: Boolean, default: false },
    requiresPassport: { type: Boolean, default: false },
    approvalRequired: { type: Boolean, default: true },

    maxCustomersPerDay: { type: Number, default: 0 },

    // ✅ This is what controls visibility in public list
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);