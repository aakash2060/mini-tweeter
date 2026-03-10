const db = require("../config/neo4j");

// Fire-and-forget wrapper — graph writes never block the HTTP response
const run = async (query, params = {}) => {
  const session = db.getSession();
  try {
    await session.run(query, params);
  } catch (err) {
    console.error("[Neo4j]", err.message);
  } finally {
    await session.close();
  }
};

// Read queries return results
const query = async (cypher, params = {}) => {
  const session = db.getSession();
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } catch (err) {
    console.error("[Neo4j]", err.message);
    return [];
  } finally {
    await session.close();
  }
};

const createUser = (userId) =>
  run("MERGE (u:User {id: $userId})", { userId: userId.toString() });

const createTopic = (topicId) =>
  run("MERGE (t:Topic {id: $topicId})", { topicId: topicId.toString() });

const subscribeUserToTopic = (userId, topicId) =>
  run(
    `MERGE (u:User {id: $userId})
     MERGE (t:Topic {id: $topicId})
     MERGE (u)-[:SUBSCRIBED_TO]->(t)`,
    { userId: userId.toString(), topicId: topicId.toString() }
  );

const unsubscribeUserFromTopic = (userId, topicId) =>
  run(
    `MATCH (u:User {id: $userId})-[r:SUBSCRIBED_TO]->(t:Topic {id: $topicId})
     DELETE r`,
    { userId: userId.toString(), topicId: topicId.toString() }
  );

const recordPost = (userId, topicId, messageId) =>
  run(
    `MERGE (u:User {id: $userId})
     MERGE (m:Message {id: $messageId})
     SET m.topicId = $topicId
     MERGE (u)-[:POSTED]->(m)
     WITH u, m
     MATCH (t:Topic {id: $topicId})
     MERGE (m)-[:IN_TOPIC]->(t)`,
    {
      userId: userId.toString(),
      topicId: topicId.toString(),
      messageId: messageId.toString(),
    }
  );

// Topics followed by users who share at least 1 subscription with me,
// that I haven't subscribed to yet — ordered by how many similar users follow them
const recommendTopics = async (userId) => {
  const records = await query(
    `MATCH (me:User {id: $userId})-[:SUBSCRIBED_TO]->(shared:Topic)<-[:SUBSCRIBED_TO]-(similar:User)
     WHERE similar <> me
     WITH similar, count(shared) AS overlap
     WHERE overlap >= 1
     MATCH (similar)-[:SUBSCRIBED_TO]->(rec:Topic)
     WHERE NOT (me)-[:SUBSCRIBED_TO]->(rec)
     RETURN rec.id AS topicId, count(*) AS score
     ORDER BY score DESC
     LIMIT 10`,
    { userId: userId.toString() }
  );
  return records.map((r) => r.get("topicId"));
};

// Users who share at least 2 subscriptions with me
const getMutualSubscribers = async (userId) => {
  const records = await query(
    `MATCH (me:User {id: $userId})-[:SUBSCRIBED_TO]->(t:Topic)<-[:SUBSCRIBED_TO]-(other:User)
     WHERE other <> me
     WITH other, count(t) AS sharedCount
     WHERE sharedCount >= 2
     RETURN other.id AS userId, sharedCount
     ORDER BY sharedCount DESC`,
    { userId: userId.toString() }
  );
  return records.map((r) => ({
    userId: r.get("userId"),
    sharedCount: r.get("sharedCount").toNumber(),
  }));
};

module.exports = {
  createUser,
  createTopic,
  subscribeUserToTopic,
  unsubscribeUserFromTopic,
  recordPost,
  recommendTopics,
  getMutualSubscribers,
};
