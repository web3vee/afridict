require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const marketRoutes = require("./routes/markets");
const userRoutes = require('./routes/auth');
const paymentRoutes = require("./routes/payments");
const betRoutes = require("./routes/bets");
const { initBlockchainListener } = require("./services/blockchain");

const app = express();
const server = http.createServer(app);

// Socket.io for real-time updates
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Make io accessible to routes
app.set("io", io);

// Webhook routes need raw body — mount BEFORE express.json()
app.use("/api/webhooks", paymentRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/markets", marketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/bets", betRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// WebSocket events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("subscribe:market", (marketId) => {
    socket.join(`market:${marketId}`);
    console.log(`Socket ${socket.id} subscribed to market ${marketId}`);
  });

  // User joins their own room to receive deposit-success events
  socket.on("subscribe:user", (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on("unsubscribe:market", (marketId) => {
    socket.leave(`market:${marketId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Connect MongoDB then start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/afridict")
  .then(() => {
    console.log("✅ MongoDB connected");
    initBlockchainListener(io).catch(console.error);
    server.listen(PORT, () => {
      console.log(`✅ AfriDict Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });