const eventBus = require("../eventbus");
const Subscription = require("../models/subscription");
const User = require("../models/user");
const Topic = require("../models/topic");
const hub = require("../notificationHub"); // ★ NEW

/* Notify & push SSE when someone posts a new message */
eventBus.subscribe("newMessage", async (message) => {
  try {
    const topic = await Topic.findById(message.topicId);
    if (!topic) return;

    const subs = await Subscription.find({ topicId: message.topicId });

    for (const sub of subs) {
      const authorId = message.authorId._id ?? message.authorId;
      if (sub.userId.toString() === authorId.toString()) continue; // skip author
      const user = await User.findById(sub.userId);
      if (!user) continue;

      /* Console log for devs */
      console.log(
        `[Notification] @${user.username} → new message in "${topic.title}"`
      );

      /* Push toast notification via SSE */
      hub.publish(user._id.toString(), {
        type: "newMessage",
        topicId: topic._id,
        topicTitle: topic.title,
      });
    }
  } catch (err) {
    console.error("notifySubscribers error:", err);
  }
});
