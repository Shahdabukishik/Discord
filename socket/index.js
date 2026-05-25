const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const Message = require("../models/Message");
const User = require("../models/User");
const { CHANNELS } = require("./channels");

const initializeSocket = (httpServer) => {
  const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigin,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("username email");

      if (!user) {
        return next(new Error("Authenticated user not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.user.username} (${socket.id})`);

    socket.on("join_channel", (channel, callback) => {
      if (!CHANNELS.includes(channel)) {
        callback?.({ ok: false, message: "Invalid channel" });
        return;
      }

      CHANNELS.forEach((room) => socket.leave(room));
      socket.join(channel);
      callback?.({ ok: true, channel });
    });

    socket.on("typing", ({ channel, username }) => {
      if (!CHANNELS.includes(channel)) return;
      socket.to(channel).emit("typing", { channel, username: socket.user.username });
    });

    socket.on("send_message", async (payload, callback) => {
      try {
        const channel = payload?.channel;
        const text = payload?.text?.trim();

        if (!text || !CHANNELS.includes(channel)) {
          callback?.({ ok: false, message: "Invalid message payload" });
          return;
        }

        const message = await Message.create({
          username: socket.user.username,
          channel,
          text,
        });
        io.to(channel).emit("receive_message", message);
        callback?.({ ok: true });
      } catch (error) {
        console.error(`Socket message failed: ${error.message}`);
        callback?.({ ok: false, message: "Message could not be sent" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.user.username} (${socket.id})`);
    });
  });

  return io;
};

module.exports = initializeSocket;
