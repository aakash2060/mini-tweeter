const Topic = require("../models/topic");
const Message = require("../models/message");
const Subscription = require("../models/subscription");
const eventBus = require("../eventbus");
const graph = require("../models/graphModel");

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    const subs = await Subscription.find({ userId: req.userId });
    const subIds = new Set(subs.map((s) => s.topicId.toString()));
    res.json(topics.map((t) => ({ ...t.toObject(), isSubscribed: subIds.has(t._id.toString()) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const { title, description, genre } = req.body;
    const topic = await Topic.create({ title, description, genre, creatorId: req.userId });
    await Subscription.create({ userId: req.userId, topicId: topic._id });
    graph.createTopic(topic._id); // fire-and-forget
    graph.subscribeUserToTopic(req.userId, topic._id);
    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    // BUG-01 fix: observer is the sole viewCount incrementer — no direct write here
    eventBus.emit("topicViewed", topic._id.toString());

    const isSubscribed = !!(await Subscription.findOne({
      userId: req.userId,
      topicId: topic._id,
    }));
    res.json({ ...topic.toObject(), isSubscribed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const existing = await Subscription.findOne({ userId: req.userId, topicId: req.params.id });
    if (!existing) {
      await Subscription.create({ userId: req.userId, topicId: req.params.id });
      graph.subscribeUserToTopic(req.userId, req.params.id); // fire-and-forget
    }
    res.json({ subscribed: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    await Subscription.findOneAndDelete({ userId: req.userId, topicId: req.params.id });
    graph.unsubscribeUserFromTopic(req.userId, req.params.id); // fire-and-forget
    res.json({ subscribed: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.userId }).populate("topicId");
    res.json(subs.map((s) => s.topicId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};