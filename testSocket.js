const io = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join_channel", "general");

  socket.emit("send_message", {
    username: "shahd",
    channel: "general",
    text: "Hello from Git Bash!",
  });
});

socket.on("receive_message", (data) => {
  console.log("New Message:", data);
});