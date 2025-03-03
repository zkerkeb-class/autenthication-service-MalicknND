const passport = require("passport");
const OpenIDConnectStrategy = require("passport-openidconnect");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

require("dotenv").config();

const setupPassport = () => {
  // Google OAuth Strategy
  passport.use(
    "google",
    new OpenIDConnectStrategy(
      {
        issuer: "https://accounts.google.com",
        authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenURL: "https://oauth2.googleapis.com/token",
        userInfoURL: "https://openidconnect.googleapis.com/v1/userinfo",
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
        scope: ["openid", "profile", "email"],
      },
      async (
        issuer,
        profile,
        context,
        idToken,
        accessToken,
        refreshToken,
        done
      ) => {
        try {
          // Extraire l'email du profil
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(new Error("Email non fourni par Google"), null);
          }

          // Rechercher l'utilisateur ou le créer s'il n'existe pas
          let user = await User.findOne({
            providerId: profile.id,
            provider: "google",
          });

          if (!user) {
            // Créer un nouvel utilisateur
            user = await User.create({
              provider: "google",
              providerId: profile.id,
              email: email,
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            });
          } else {
            // Mettre à jour les informations de l'utilisateur
            user = await User.findOneAndUpdate(
              { providerId: profile.id, provider: "google" },
              {
                name: profile.displayName,
                email: email,
                avatar: profile.photos?.[0]?.value,
              },
              { new: true }
            );
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // GitHub OAuth Strategy
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
        scope: ["user", "user:email"],
        prompt: "consent",
        accessType: "offline",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = profile.emails?.[0]?.value;

          // Si email non trouvé, récupérer via API GitHub
          if (!email) {
            const response = await fetch("https://api.github.com/user/emails", {
              headers: { Authorization: `token ${accessToken}` },
            });
            const emails = await response.json();
            email = emails.find((e) => e.primary && e.verified)?.email;
          }

          if (!email) {
            return done(new Error("Impossible de récupérer l'email"), null);
          }

          let user = await User.findOne({
            providerId: profile.id,
            provider: "github",
          });

          if (!user) {
            user = await User.create({
              provider: "github",
              providerId: profile.id,
              email: email,
              name: profile.displayName || profile.username,
              avatar: profile.photos?.[0]?.value,
            });
          } else {
            user = await User.findOneAndUpdate(
              { providerId: profile.id, provider: "github" },
              { name: profile.displayName || profile.username, email: email },
              { new: true }
            );
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Sérialisation de l'utilisateur - stocker uniquement l'ID dans la session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Désérialisation - récupérer l'utilisateur complet à partir de l'ID
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

module.exports = setupPassport;
