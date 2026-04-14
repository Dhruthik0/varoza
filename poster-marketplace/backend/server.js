// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Poster Marketplace API running");
// });

// const PORT = process.env.PORT || 5000;
// const authRoutes = require("./routes/authRoutes");

// app.use("/api/auth", authRoutes);
// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/admin", adminRoutes);
// const sellerRoutes = require("./routes/sellerRoutes");
// app.use("/api/seller", sellerRoutes);
// const buyerRoutes = require("./routes/buyerRoutes");
// app.use("/api/buyer", buyerRoutes);
// app.use("/api/posters", require("./routes/posterRoutes"));
// const orderRoutes = require("./routes/orderRoutes");
// app.use("/api/orders", orderRoutes);


// app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// );
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* ======================
   🔐 CORS CONFIG
====================== */
const STATIC_ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "https://varoza.vercel.app",
  "https://varoza.in",
  "https://www.varoza.in"
]);

const isAllowedOrigin = (origin = "") => {
  if (STATIC_ALLOWED_ORIGINS.has(origin)) return true;

  // Allow Vercel preview URLs like:
  // https://branch-name-project-name.vercel.app
  // https://project-name-git-main-user.vercel.app
  return /^https:\/\/([a-z0-9-]+\.)*vercel\.app$/i.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools or same-origin requests with no Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);

app.use(express.json());

/* ======================
   🧪 HEALTH CHECK
====================== */
app.get("/", (req, res) => {
  res.send("Poster Marketplace API running");
});

/* ======================
   📦 ROUTES
====================== */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/seller", require("./routes/sellerRoutes"));
app.use("/api/buyer", require("./routes/buyerRoutes"));
app.use("/api/posters", require("./routes/posterRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

/* ======================
   🚀 START SERVER
====================== */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
const multer = require("multer");

app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err.message) {
    return res.status(500).json({ message: err.message });
  }

  res.status(500).json({ message: "Server error" });
});
