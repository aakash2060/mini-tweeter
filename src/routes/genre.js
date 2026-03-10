const router = require("express").Router();
const auth = require("../middleware/auth");
const { getGenres, getPreferences, savePreferences } = require("../controllers/genreController");

router.get("/", getGenres);
router.get("/preferences", auth, getPreferences);
router.post("/preferences", auth, savePreferences);

module.exports = router;