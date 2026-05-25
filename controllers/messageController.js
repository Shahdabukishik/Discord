const Message = require("../models/Message");
const asyncHandler = require("../middleware/asyncHandler");
const { CHANNELS } = require("../socket/channels");

const getMessagesByChannel = asyncHandler(async (req, res) => {
  const { channel } = req.params;

  if (!CHANNELS.includes(channel)) {
    res.status(400);
    throw new Error("Invalid channel");
  }

  const messages = await Message.find({ channel })
    .sort({ createdAt: 1 })
    .limit(100)
    .lean();

  res.json({ messages });
});

module.exports = { getMessagesByChannel };
