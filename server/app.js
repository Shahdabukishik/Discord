const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Discord Clone API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
