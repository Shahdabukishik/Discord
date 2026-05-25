const express = require("express");

const { getMessagesByChannel } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:channel", protect, getMessagesByChannel);

module.exports = router;
