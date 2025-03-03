require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const setupPassport = require("./config/passport");
const connectDB = require("./config/database");
const helmet = require("helmet");
const sessionConfig = require("./config/session");

const app = express();

connectDB(); // Initialisation de la base de données
setupPassport(); // Initialisation de Passport

// Middleware

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet());

// Configuration des sessions
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

// Middleware de rafraîchissement de session
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    const twelveHours = 12 * 60 * 60 * 1000;
    const expiresIn = req.session.cookie.maxAge;

    if (expiresIn < twelveHours) {
      const originalMaxAge =
        req.session.cookie.originalMaxAge || 24 * 60 * 60 * 1000;
      req.session.cookie.maxAge = originalMaxAge;
    }
  }
  next();
});

// Serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
