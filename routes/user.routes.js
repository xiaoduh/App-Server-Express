const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");
const multer = require("multer");
const upload = multer();

// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logOut);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:id/:token", authController.resetPassword);

// user DB
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUserBio);
router.put("/edit-user/:id", userController.updateUser);
router.put("/upgrade/:id", userController.upgradeUserToSuperAdmin);
router.delete("/:id", userController.deleteUser);

// upload pp
router.post("/upload", upload.single("file"), uploadController.uploadProfil);

module.exports = router;
