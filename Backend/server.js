


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./src/config/passport");
const path = require("path");

const connectDB = require("./src/config/db");

// ROUTES
const userRoutes = require("./src/routes/user/user.routes");
const authRoutes = require("./src/routes/user/auth.routes");
const customerRoutes = require("./src/routes/customerRoutes/customerRoutes");
const serviceRoutes = require("./src/routes/customerRoutes/serviceRoutes");
const appointmentRoutes = require("./src/routes/appointment.routes");
const publicAppionts= require("./src/routes/Public/public.routes");

// ✅ dashboard routes (counts + updates)
const dashboardRoutes = require("./src/routes/dashboard/dashboardRoutes");

const app = express();
app.set("trust proxy", 1);

/* =========================
   CORS CONFIG
========================= */
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Vite frontend
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "https://motivated-amazement-production.up.railway.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


/* =========================
   BODY PARSER
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ✅ STATIC FILES (uploads)
========================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================
   CONNECT DATABASE
========================= */
connectDB();

/* =========================
   SESSION (passport)
========================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "google-oauth-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // production -> true (HTTPS)
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

/* =========================
   PASSPORT
========================= */
app.use(passport.initialize());
app.use(passport.session());

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => res.send("API Running ✅"));
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/public", publicAppionts);

// ✅ dashboard endpoints
app.use("/api/dashboard", dashboardRoutes);

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
