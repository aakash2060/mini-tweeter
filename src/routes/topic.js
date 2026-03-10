const router = require("express").Router();
const auth = require("../middleware/auth");
const topic = require("../controllers/topicController");
const message = require("../controllers/messageController");

router.get("/", auth, topic.getAllTopics);
router.post("/", auth, topic.createTopic);
router.get("/subscriptions", auth, topic.getSubscriptions);
router.get("/:id", auth, topic.getTopicById);
router.post("/:id/subscribe", auth, topic.subscribe);
router.delete("/:id/unsubscribe", auth, topic.unsubscribe);
router.get("/:id/messages", auth, message.getMessagesByTopic);
router.post("/:id/messages", auth, message.createMessage);

module.exports = router;