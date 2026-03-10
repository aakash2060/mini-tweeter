const router = require("express").Router();
const auth = require("../middleware/auth");
const { getStats } = require("../controllers/statsController");

router.get(["", "/"], auth, getStats);

module.exports = router;