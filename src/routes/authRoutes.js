const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Google
router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);

// GitHub
router.get("/github", authController.githubLogin);
router.get("/github/callback", authController.githubCallback);

// Utilisateur et déconnexion
router.get("/user", authController.getUser);
router.get("/logout", authController.logout);

module.exports = router;
