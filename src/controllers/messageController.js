const Message = require("../models/message");
const Subscription = require("../models/subscription");
const eventBus = require("../eventbus");
const graph = require("../models/graphModel");

exports.getMessagesByTopic = async (req, res) => {
  try {
    const topicId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ topicId })
        .populate("authorId", "username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments({ topicId }),
    ]);

    res.json({ messages, page, totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const topicId = req.params.id;
    const subscription = await Subscription.findOne({ userId: req.userId, topicId });
    if (!subscription) {
      return res.status(403).json({ error: "Must be subscribed to post in this topic" });
    }
    const message = await Message.create({ body: req.body.body, topicId, authorId: req.userId });
    await message.populate("authorId", "username");
    eventBus.emit("newMessage", message);
    graph.recordPost(req.userId, topicId, message._id); // fire-and-forget
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};