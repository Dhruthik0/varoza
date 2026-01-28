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
app.use(
  cors({
    origin: [
      "http://localhost:5173",      // local frontend
      "https://varoza.vercel.app"   // production frontend (later)
    ],
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
