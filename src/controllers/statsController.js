const Topic = require("../models/topic");
const Message = require("../models/message");

exports.getStats = async (req, res) => {
  try {
    const [topTopics, topUsers] = await Promise.all([
      Topic.find().sort({ viewCount: -1, replyCount: -1 }).limit(10),
      Message.aggregate([
        { $group: { _id: "$authorId", messageCount: { $sum: 1 } } },
        { $sort: { messageCount: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $project: { messageCount: 1, "user.username": 1, "user._id": 1 } },
      ]),
    ]);

    res.json({ topTopics, topUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};