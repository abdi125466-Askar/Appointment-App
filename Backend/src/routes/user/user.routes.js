// const express = require("express");
// const router = express.Router();

// const {
//   createUser,
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   loginUser,
//   deleteUserPermanent,
//   getMe,
//   updateMyProfile,
//   updateMyAvatar,
//   updateMyPassword,
// } = require("../../controller/User/user.controller");

// // ✅ matches your file: src/middlewares/auth.middleware.js
// const { authMiddleware, isAdmin } = require("../../middlewares/auth.middleware");

// // ✅ upload middleware
// const { uploadAvatar } = require("../../middlewares/uploadAvatar");

// /* -------------------------
//    AUTH + PROFILE
// -------------------------- */
// router.post("/login", loginUser);
// router.get("/me", authMiddleware, getMe);


// router.put("/profile", authMiddleware, updateMyProfile);
// router.put("/password", authMiddleware, updateMyPassword);

// router.put(
//   "/profile/avatar",
//   authMiddleware,
//   uploadAvatar.single("avatar"),
//   updateMyAvatar
// );

// /* -------------------------
//    USERS CRUD
// -------------------------- */
// router.post("/", createUser);
// router.get("/", getUsers);
// router.get("/:id", getUserById);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);

// /* -------------------------
//    PERMANENT DELETE (ADMIN ONLY)
//    ✅ final: /api/users/permanent/:id
// -------------------------- */
// router.delete("/permanent/:id", authMiddleware, isAdmin, deleteUserPermanent);

// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  deleteUserPermanent,
  getMe,
  updateMyProfile,
  updateMyAvatar,
  updateMyPassword,
} = require("../../controller/User/user.controller");

// middleware
const { authMiddleware, isAdmin } = require("../../middlewares/auth.middleware");
const { uploadAvatar } = require("../../middlewares/uploadAvatar");

//////////////////////////////////////////////////////
// AUTH + PROFILE
//////////////////////////////////////////////////////

router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);

router.put("/profile", authMiddleware, updateMyProfile);
router.put("/password", authMiddleware, updateMyPassword);

router.put(
  "/profile/avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  updateMyAvatar
);

//////////////////////////////////////////////////////
// USERS CRUD (STATIC ROUTES FIRST)
//////////////////////////////////////////////////////

router.post("/", createUser);
router.get("/", getUsers);

//////////////////////////////////////////////////////
// ADMIN ROUTES (before :id)
//////////////////////////////////////////////////////

router.delete(
  "/permanent/:id",
  authMiddleware,
  isAdmin,
  deleteUserPermanent
);

//////////////////////////////////////////////////////
// DYNAMIC ROUTES (MUST BE LAST)
//////////////////////////////////////////////////////

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;