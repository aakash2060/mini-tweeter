# Mini-Tweeter

A full-stack MERN social platform with a dual-database architecture — MongoDB Atlas for document storage and Neo4j AuraDB for graph-based recommendations.

**Live Demo:** https://mini-tweeter-chi.vercel.app
**Backend API:** https://mini-tweeter-production.up.railway.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express 5 |
| Primary DB | MongoDB Atlas (Mongoose) |
| Graph DB | Neo4j AuraDB (Cypher) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Real-time | Server-Sent Events (SSE) |
| Deployment | Railway (backend) + Vercel (frontend) |

---

## Why Two Databases?

MongoDB handles all document storage — users, topics, messages, subscriptions. Neo4j handles the social graph. Relationship traversal queries like *"find topics followed by users who share my subscriptions"* are graph problems — they require multi-hop traversal that would be slow and complex in MongoDB but are a single Cypher query in Neo4j.

```cypher
MATCH (me:User)-[:SUBSCRIBED_TO]->(shared:Topic)<-[:SUBSCRIBED_TO]-(similar:User)
WITH me, similar
MATCH (similar)-[:SUBSCRIBED_TO]->(rec:Topic)
WHERE NOT (me)-[:SUBSCRIBED_TO]->(rec)
RETURN rec.id, count(*) AS score ORDER BY score DESC
```

---

## Architecture

- **MVC** — `src/models/`, `src/controllers/`, `src/routes/`
- **Observer Pattern** — `src/eventbus.js` decouples message posting from stat tracking and notifications
- **Singleton Pattern** — `src/config/db.js` and `src/config/neo4j.js` maintain single DB instances
- **SSE Notifications** — `src/notificationHub.js` pushes real-time events to subscribed users

---

## Features

- JWT authentication with genre-based onboarding on first login
- Topic communities — create, browse, subscribe/unsubscribe
- Paginated message threads (10 per page)
- Real-time notifications via SSE when new messages are posted
- Neo4j-powered topic recommendations and mutual subscriber discovery
- Platform statistics — most active topics and users

---

## Local Setup

**Backend:**
```bash
npm install
# create .env with MONGO_URI, JWT_SECRET, NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, NEO4J_DATABASE, CLIENT_URL
npm run dev        # http://localhost:3000
npm run seed       # seed sample data
```

**Frontend:**
```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

---

## Demo Accounts

After running `npm run seed`:

| Email | Password |
|---|---|
| admin@example.com | admin123 |
| alice@example.com | alice123 |
| bob@example.com | bob123 |
| carol@example.com | carol123 |
| dave@example.com | dave123 |
