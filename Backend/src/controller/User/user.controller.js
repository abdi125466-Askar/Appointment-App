const User = require("../../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

/* =========================
   LOGIN USER
========================= */
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // ================= VALIDATION =================
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     // ================= FIND USER =================
//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // 🔐 Block Google-only accounts
//     if (user.provider === "google") {
//       return res.status(400).json({
//         success: false,
//         message: "Use Google login for this account",
//       });
//     }

//     if (!user.password) {
//       return res.status(400).json({
//         success: false,
//         message: "No local password found",
//       });
//     }

//     // ================= PASSWORD CHECK =================
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // ================= JWT =================
//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//         email: user.email,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // ================= RESPONSE =================
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role,
//         provider: user.provider,
//         avatarUrl: user.avatarUrl || null,
//         bio: user.bio || "",
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

/**
 * =====================================================
 * LOGIN USER
 * =====================================================
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ================= VALIDATION ================= */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /* ================= FIND USER ================= */
    const user = await User.findOne({ email })
      .select("+password")
      .lean(false);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* ================= PROVIDER CHECK ================= */
    if (user.provider === "google") {
      return res.status(400).json({
        success: false,
        message: "Use Google login for this account",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "No local password found for this account",
      });
    }

    /* ================= STATUS & ACCESS CHECK ================= */
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Contact administrator.",
      });
    }

    if (user.status === "PENDING") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval.",
      });
    }

    if (user.status === "REJECTED") {
      return res.status(403).json({
        success: false,
        message: "Your account has been rejected.",
      });
    }

    if (user.status === "DISABLED") {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    /* ================= PASSWORD CHECK ================= */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* ================= JWT ================= */
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        provider: user.provider,
        avatarUrl: user.avatarUrl || null,
        bio: user.bio || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* =========================
   GET CURRENT USER (/users/me)
========================= */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id fullName email role provider avatarUrl bio"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ✅ UPDATE MY PROFILE (PUT /api/users/profile)
   body: { fullName, bio }
========================= */
exports.updateMyProfile = async (req, res) => {
  try {
    const { fullName, bio } = req.body;

    // fullName optional? (but your UI expects it always) - keep strong validation:
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name is required (min 2 chars)",
      });
    }

    // bio optional
    let nextBio = typeof bio === "string" ? bio.trim() : "";
    if (nextBio.length > 250) nextBio = nextBio.slice(0, 250);

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { fullName: fullName.trim(), bio: nextBio },
      { new: true, runValidators: true }
    ).select("_id fullName email role provider avatarUrl bio");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ✅ UPDATE MY PASSWORD (PUT /api/users/password)
   body: { currentPassword, newPassword, confirmPassword }
========================= */
exports.updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "currentPassword, newPassword and confirmPassword are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findById(req.user.id).select("+password provider");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // block google-only accounts
    if (user.provider === "google") {
      return res.status(400).json({
        success: false,
        message: "This account uses Google login. Password update is disabled.",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "No local password found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Prevent same password (optional but professional)
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update password",
    });
  }
};

/* =========================
   ✅ UPDATE MY AVATAR (PUT /api/users/profile/avatar)
   form-data: avatar (file)
========================= */
exports.updateMyAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Avatar image is required",
      });
    }

    const user = await User.findById(req.user.id).select(
      "_id fullName email role provider avatarUrl bio"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ remove old avatar file if it was local
    if (user.avatarUrl && user.avatarUrl.startsWith("/uploads/avatars/")) {
      const oldFile = path.join(
        process.cwd(),
        user.avatarUrl.replace(/^\//, "")
      );
      if (fs.existsSync(oldFile)) {
        try {
          fs.unlinkSync(oldFile);
        } catch {}
      }
    }

    user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
        bio: user.bio || "",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update avatar",
    });
  }
};

/* =========================
   CREATE USER
========================= */
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      provider: "local",
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL USERS
========================= */
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
};

/* =========================
   GET USER BY ID
========================= */
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ success: false, message: "Not found" });

  res.json({ success: true, data: user });
};

/* =========================
   UPDATE USER
========================= */
exports.updateUser = async (req, res) => {
  try {
    const allowedStatuses = ["PENDING", "APPROVED", "REJECTED", "DISABLED"];
    const { fullName, email, role, status } = req.body;

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status`,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(fullName !== undefined && { fullName }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
        ...(status !== undefined && { status }),
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   SOFT DELETE USER
========================= */
exports.deleteUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: "User deactivated" });
};

/* =========================
   PERMANENT DELETE
========================= */
exports.deleteUserPermanent = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User permanently deleted",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
