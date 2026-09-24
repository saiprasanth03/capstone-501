const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const sportRoutes = require("./routes/sportRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const reportRoutes = require("./routes/reportRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      const allowed = [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://localhost:5178",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5178",
      ];
      if (allowed.includes(origin) || origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sports Scheduler API is running",
  });
});

const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});