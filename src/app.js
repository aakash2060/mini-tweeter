require("dotenv").config();
require("./config/db");
require("./config/neo4j");

const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/topics", require("./routes/topic"));
app.use("/api/genres", require("./routes/genre"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/graph", require("./routes/graph"));
app.use("/api/notifications", require("./routes/notifications"));

/* observers */
require("./observers/notifySubscribers");
require("./observers/topicStats");

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Listening on ${PORT}`));