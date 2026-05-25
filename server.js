const http = require("http");
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const initializeSocket = require("./socket");

connectDB();

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
