const MongoStore = require("connect-mongo");
const session = require("express-session");

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 24 * 60 * 60, // 24 heures
    autoRemove: "interval",
    autoRemoveInterval: 10, // Vérifie les sessions expirées toutes les 10 minutes
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000, // 24 heures
  },
  name: "sessionId", // Change le nom par défaut 'connect.sid'
  rolling: true, // Renouvelle le cookie à chaque requête
};

module.exports = sessionConfig;
