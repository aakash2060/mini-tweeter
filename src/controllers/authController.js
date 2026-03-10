const jwt = require("jsonwebtoken");
const User = require("../models/user");
const UserPreference = require("../models/userpreference");
const graph = require("../models/graphModel");

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    await UserPreference.create({ userId: user._id, genres: [], firstLogin: true });
    const token = signToken(user._id);
    graph.createUser(user._id); // fire-and-forget
    res.status(201).json({ token, userId: user._id, username: user.username });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const ok = user && (await user.comparePassword(password));
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });
    const prefs = await UserPreference.findOne({ userId: user._id });
    const token = signToken(user._id);
    res.json({
      token,
      userId: user._id,
      username: user.username,
      firstLogin: prefs ? prefs.firstLogin : false,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};