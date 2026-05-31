const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {connectDB} = require("./src/db/connection");

const app = express();  
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const profileRoutes = require("./src/routes/profileRoutes");
app.use("/api", profileRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Start server only after DB connects
connectDB()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });

  const errorHandler = require("./src/middleware/errorHandler");

// 404 handler — unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Global error handler — must be last
app.use(errorHandler);