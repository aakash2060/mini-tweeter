const UserPreference = require("../models/userpreference");

const AVAILABLE_GENRES = [
  "Technology", "Sports", "Entertainment", "Science",
  "Politics", "Health", "Business", "Education",
];

exports.getGenres = (_req, res) => {
  res.json(AVAILABLE_GENRES);
};

exports.getPreferences = async (req, res) => {
  try {
    const prefs = await UserPreference.findOne({ userId: req.userId });
    res.json({
      genres: prefs ? prefs.genres : [],
      firstLogin: prefs ? prefs.firstLogin : false,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.savePreferences = async (req, res) => {
  try {
    const genres = Array.isArray(req.body.genres) ? req.body.genres : [req.body.genres];
    await UserPreference.findOneAndUpdate(
      { userId: req.userId },
      { genres, firstLogin: false },
      { upsert: true }
    );
    res.json({ genres, firstLogin: false });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAvailableGenres = () => AVAILABLE_GENRES;