const passport = require("passport");
const User = require("../models/User");
// Démarrer l'authentification Google
exports.googleLogin = (req, res, next) => {
  const { remember } = req.query;

  // Configuration de la session selon le choix de l'utilisateur
  if (req.session) {
    req.session.cookie.maxAge =
      remember === "true"
        ? 30 * 24 * 60 * 60 * 1000 // 30 jours
        : 24 * 60 * 60 * 1000; // 24 heures
  }

  passport.authenticate("google", {
    scope: ["openid", "profile", "email"],
  })(req, res, next);
};

// Callback de Google
exports.googleCallback = passport.authenticate("google", {
  failureRedirect: process.env.FRONTEND_URL,
  successRedirect: process.env.FRONTEND_URL + "/dashboard",
});

// Démarrer l'authentification GitHub
exports.githubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});

// Callback de GitHub
exports.githubCallback = passport.authenticate("github", {
  failureRedirect: process.env.FRONTEND_URL,
  successRedirect: process.env.FRONTEND_URL + "/dashboard",
});

// Vérifier si l'utilisateur est connecté
exports.getUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Non authentifié" });
  }
};

// Déconnexion
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Erreur de déconnexion" });

    req.session.destroy((error) => {
      if (error)
        return res
          .status(500)
          .json({ message: "Erreur de suppression de session" });

      res.clearCookie("sessionId", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
      });

      // Renvoyer une réponse JSON au lieu d'une redirection
      res.json({ message: "Déconnexion réussie" });
    });
  });
};
