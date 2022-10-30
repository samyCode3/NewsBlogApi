const express = require("express");
const router = express();
const auth = require("../middleware/auth.middleware");
const User = require("../services/User");

router.post("/register", auth.upload.single("avater"), User.register);
router.post("/login", User.login);
router.put("/forgot", User.forgotPassword);
router.get("/welcome", auth.AuthenticateUser, User.userProfile);
router.get("/users-registered", auth.AuthenticateUser, User.GetAllUsers);
router.delete("/delete/:id", auth.AuthenticateUser, User.deleteUser);
router.put("/update/:id", auth.AuthenticateUser, User.updateUser);
router.get("/stats", auth.AuthenticateUser, User.GetStats);
router.post("/reset-password");

module.exports = router;
