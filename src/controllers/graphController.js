const graph = require("../models/graphModel");
const Topic = require("../models/topic");
const User = require("../models/user");

exports.getRecommendations = async (req, res) => {
  try {
    const topicIds = await graph.recommendTopics(req.userId);
    const topics = await Topic.find({ _id: { $in: topicIds } });
    // Preserve the Neo4j score order
    const ordered = topicIds
      .map((id) => topics.find((t) => t._id.toString() === id))
      .filter(Boolean);
    res.json(ordered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMutualSubscribers = async (req, res) => {
  try {
    const results = await graph.getMutualSubscribers(req.userId);
    const userIds = results.map((r) => r.userId);
    const users = await User.find({ _id: { $in: userIds } }, "username email");
    // Attach sharedCount to each user
    const enriched = results.map((r) => ({
      ...users.find((u) => u._id.toString() === r.userId)?.toObject(),
      sharedCount: r.sharedCount,
    })).filter((u) => u._id);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
