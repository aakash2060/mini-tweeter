const router = require("express").Router();
const jwt = require("jsonwebtoken");
const hub = require("../notificationHub");

// EventSource (browser) can't set Authorization headers, so JWT is accepted
// via query param (?token=) as a fallback in addition to the Bearer header.
router.get("/events", (req, res) => {
  const raw =
    req.query.token ||
    (req.headers.authorization || "").replace(/^Bearer\s+/, "");

  if (!raw) return res.sendStatus(401);

  let userId;
  try {
    userId = jwt.verify(raw, process.env.JWT_SECRET).userId;
  } catch {
    return res.sendStatus(401);
  }

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  res.write("retry: 3000\n\n");

  hub.addClient(userId.toString(), res);

  const ping = setInterval(() => res.write(":\n\n"), 25_000);
  res.on("close", () => clearInterval(ping));
});

module.exports = router;