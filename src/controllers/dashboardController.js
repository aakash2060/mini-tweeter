const Topic = require("../models/topic");
const Message = require("../models/message");
const User = require("../models/user");
const UserPreference = require("../models/userpreference");
const Subscription = require("../models/subscription");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const [user, userPrefs, subscriptions] = await Promise.all([
      User.findById(userId),
      UserPreference.findOne({ userId }),
      Subscription.find({ userId }),
    ]);
    if (!user) return res.status(401).json({ error: "User not found" });

    const subscribedTopicIds = subscriptions.map((s) => s.topicId);

    const subscribedTopicsWithMessages = (
      await Promise.all(
        subscribedTopicIds.map(async (topicId) => {
          const topic = await Topic.findById(topicId);
          if (!topic) return null;
          const messages = await Message.find({ topicId })
            .populate("authorId", "username")
            .sort({ createdAt: -1 })
            .limit(2);
          return { topic, messages };
        })
      )
    ).filter(Boolean);

    const preferredGenres = userPrefs ? userPrefs.genres : [];
    let recommendedTopics = [];
    if (preferredGenres.length > 0) {
      recommendedTopics = await Topic.find({
        genre: { $in: preferredGenres },
        _id: { $nin: subscribedTopicIds },
      }).limit(5);
    }

    res.json({
      user: { _id: user._id, username: user.username, email: user.email },
      subscribedTopicsWithMessages,
      recommendedTopics,
      preferredGenres,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};