const router = require("express").Router();
const auth = require("../middleware/auth");
const { getRecommendations, getMutualSubscribers } = require("../controllers/graphController");

router.get("/recommendations", auth, getRecommendations);
router.get("/mutual-subscribers", auth, getMutualSubscribers);

module.exports = router;
