require("dotenv").config();
require("./config/db");
require("./config/neo4j");

const mongoose = require("mongoose");
const User = require("./models/user");
const Topic = require("./models/topic");
const Message = require("./models/message");
const Subscription = require("./models/subscription");
const UserPreference = require("./models/userpreference");
const graph = require("./models/graphModel");

const AVAILABLE_GENRES = [
  "Technology", "Sports", "Entertainment", "Science",
  "Politics", "Health", "Business", "Education",
];

const SAMPLE_TOPICS = {
  Technology: ["The future of AI in everyday life", "Next.js vs. React — What to choose in 2025?"],
  Sports: ["Can Messi still dominate MLS?", "NBA playoffs: Who's taking the championship?"],
  Entertainment: ["Top 5 must-watch movies this summer", "Why K-pop is taking over the world"],
  Science: ["NASA's latest Mars mission updates", "How quantum computing will change the world"],
  Politics: ["What the 2024 elections mean for young voters", "Crypto regulations: A necessary evil?"],
  Health: ["Why sleep is your superpower", "The rise of mental health apps in Gen Z"],
  Business: ["How to pitch your startup in 60 seconds", "The freelance economy: Is it sustainable?"],
  Education: ["AI tutors: Should schools embrace them?", "Is college still worth it in 2025?"],
};

const SAMPLE_DESCRIPTIONS = {
  Technology: "Discussions on the latest innovations and trends in technology, including AI, software, and hardware.",
  Sports: "Explore the world of sports, including the latest news, match results, and analysis.",
  Entertainment: "Stay updated on the hottest movies, music, celebrities, and all things entertainment.",
  Science: "Insights into scientific discoveries, research, and the future of science and technology.",
  Politics: "Political debates, election updates, policy discussions, and analysis of current events.",
  Health: "Conversations about physical and mental well-being, fitness, healthcare, and medical advancements.",
  Business: "The latest trends in business, entrepreneurship, startups, and the economy.",
  Education: "A look at educational systems, online learning, and the future of education.",
};

// Conversational message pools — written as back-and-forth between genre subscribers
// Technology: admin(1,4,7,10) alice(2,5,8) bob(3,6,9)
// Sports: alice(1,3,5,7,9) carol(2,4,6,8,10)
// Entertainment: bob(1,3,5,7,9) admin(2,4,6,8,10)
// Science: admin(1,3,5,7,9) carol(2,4,6,8,10)
// Politics: bob(1,3,5,7,9) dave(2,4,6,8,10)
// Health: alice(1,4,7,10) carol(2,5,8) dave(3,6,9)
// Business: admin(1,4,7,10) bob(2,5,8) dave(3,6,9)
// Education: carol(1,3,5,7,9) dave(2,4,6,8,10)
const GENRE_MESSAGES = {
  Technology: [
    "AI is moving faster than any of us predicted. What felt like 5 years away is shipping today.",
    "True, but a lot of it is still impressive demos rather than reliable production systems.",
    "I've seen real gains in dev workflows though. Not theoretical — actual hours saved every week.",
    "The copilot stuff especially. I'm not writing boilerplate by hand anymore and I don't miss it.",
    "My issue is the confidence. It writes wrong code the same way it writes right code. No signal.",
    "Hence TypeScript. Pairing strong types with AI output catches most of the nonsense early.",
    "The deeper concern is junior devs. How do you build intuition if you skip the struggle entirely?",
    "Tooling that hides complexity might be creating a knowledge gap nobody sees until it's too late.",
    "Or it shifts what matters. Understanding systems might just matter more than syntax recall now.",
    "Either way the job has changed. Faster than any shift I've seen in the last decade.",
  ],
  Sports: [
    "That performance last night was something else. Did not expect them to dominate like that.",
    "The defensive setup was completely different from last season. New coordinator is making a difference.",
    "The stats back it up too. Top three in almost every meaningful category right now.",
    "What worries me is sustainability. Can they keep this up when the schedule gets brutal?",
    "Depth is the answer. Last year they had eight reliable guys. This squad goes fifteen deep.",
    "I'll believe it in a playoff environment. Regular season form means nothing if you fold then.",
    "Harsh but fair. It's a completely different sport in elimination games.",
    "Their best player has never been past the second round though. That has to change.",
    "He looked locked in last night. Different body language. Something has clicked.",
    "Cautiously optimistic. Which for me is basically screaming from the rooftops.",
  ],
  Entertainment: [
    "Finally finished the series everyone's been talking about. Three episodes to hook me then couldn't stop.",
    "The slow burn is intentional. The payoff in episodes six and seven makes every minute worth it.",
    "Episode six broke me. I was actively trying to predict it and still didn't see it coming.",
    "The writing this season is operating on another level. Every scene is doing three things at once.",
    "Casting is what gets me. Every single role feels lived-in. Nobody is just delivering lines.",
    "The lead especially. That's a career-defining performance. Awards conversation is fully justified.",
    "Soundtrack too — listened to the full score separately. Holds up completely on its own.",
    "They scored it before filming certain scenes apparently. You can feel that in how it lands.",
    "Ending split my friend group right down the middle. Half loved it, half felt genuinely cheated.",
    "The ambiguity is the point. Art that everyone immediately agrees on probably isn't doing its job.",
  ],
  Science: [
    "The paper out of MIT this week is hard to overstate. If it replicates it shifts the standard model.",
    "I read it. Methodology is solid but conditions are very specific. Real-world replication will be tough.",
    "That's always the problem with breakthrough claims. Effect is real in the lab and vanishes at scale.",
    "Not always. CRISPR faced the same criticism in 2019 and now it's entering clinical practice.",
    "Fair. I'm probably too sceptical but I've been burned by headlines that outran the actual findings.",
    "Science communication is broken. Media needs a result, papers need citations. Nobody wins.",
    "The preprint culture doesn't help either. Incomplete work gets treated as settled science overnight.",
    "Peer review is slow but it exists for a reason. The pace pressure is producing real sloppiness.",
    "Still, the question they're investigating is the right one. Even a flawed paper moves the field.",
    "Agreed. Progress is rarely linear. Sometimes a wrong paper asks exactly the right question.",
  ],
  Politics: [
    "The polling on this is all over the place. Hard to know what people think versus what they'll admit.",
    "Polling has been broken since 2016. I don't trust any number without full methodology shown.",
    "Even with methodology the shy voter problem is real. People don't always tell pollsters the truth.",
    "Local races are moving very differently from national ones right now. The map is genuinely shifting.",
    "Young voter registration is up significantly this cycle. That usually means something real is changing.",
    "Registration doesn't equal turnout though. That gap has burned optimists before and will again.",
    "True but the issues driving registration this time feel more immediate and personal than before.",
    "Economic anxiety is the through-line regardless of which side you're on. That part isn't new.",
    "The messaging still hasn't caught up with what people actually care about. Enormous disconnect.",
    "It never does. By the time campaigns figure it out the election is already over.",
  ],
  Health: [
    "Eight hours is the advice but quality matters far more than the number. I track both now.",
    "Started taking sleep seriously two years ago. The difference in focus, mood and recovery is real.",
    "The research backs this completely. Sleep debt compounds in ways most people don't realise.",
    "What shifted it for me was treating it like training. You wouldn't skip gym recovery days.",
    "The tracker apps are interesting. I've used three different ones and they each say something different.",
    "The data is noisy but the habits they enforce are what matter. Consistent schedule beats everything.",
    "Cutting screens an hour before bed changed more for me than any supplement or gadget I've tried.",
    "Hard to sustain but the weeks I actually manage it are noticeably better in every single way.",
    "Environment is underrated too. Temperature, darkness, sound. People skip basics and wonder why it fails.",
    "It all comes back to the same thing. Sleep is the foundation everything else is built on top of.",
  ],
  Business: [
    "The fundraising environment has completely shifted. What got a seed round two years ago gets nothing now.",
    "Probably healthy honestly. A lot of companies got funded on pure vibes and are quietly unwinding.",
    "The bar going up isn't bad news for founders showing real traction. Less noise to compete through.",
    "The bootstrapped path is deeply underrated right now. Keep the equity, the pressure sharpens you.",
    "Margin requirements are different though. You can't lose money for five years when bootstrapped.",
    "Which is a feature not a bug. Forces real discipline from day one instead of burning cash on growth.",
    "Every company surviving this environment knows their unit economics cold. That's the common thread.",
    "And their customers. Too many founders pitch beautifully but can't explain why customers churn.",
    "Retention is everything. Acquisition is glamorous but retention is what the actual model is built on.",
    "The fundamentals haven't changed. Everyone just forgot about them when capital was free.",
  ],
  Education: [
    "The AI in classrooms debate keeps missing the real question — what are we actually trying to teach?",
    "Exactly. If the goal is people who can think, banning tools is completely the wrong fight.",
    "The assessment model is what needs to change. Tests passable by AI aren't testing anything that matters.",
    "Project-based assessment is the answer but it's expensive. Requires small classes and great teachers.",
    "Good teachers are the single variable that actually moves outcomes. Everything else is secondary.",
    "And they're chronically underpaid. We know what works and collectively choose not to fund it.",
    "The access gap is what gets me. Quality education is still almost entirely determined by your postcode.",
    "Online learning was supposed to fix that. Democratised access but credentialing hasn't followed.",
    "Same knowledge from MIT OpenCourseWare versus a local college. Wildly different outcomes.",
    "The signal problem. Until credentials reform, access reform only ever goes halfway.",
  ],
};

// Every genre has at least 2 subscribers so threads look like real conversations
const SEED_USERS = [
  { username: "admin", email: "admin@example.com", password: "admin123", genres: ["Technology", "Science", "Business", "Entertainment"] },
  { username: "alice", email: "alice@example.com", password: "alice123", genres: ["Technology", "Sports", "Health"] },
  { username: "bob",   email: "bob@example.com",   password: "bob123",   genres: ["Technology", "Entertainment", "Business", "Politics"] },
  { username: "carol", email: "carol@example.com", password: "carol123", genres: ["Sports", "Science", "Education", "Health"] },
  { username: "dave",  email: "dave@example.com",  password: "dave123",  genres: ["Health", "Business", "Politics", "Education"] },
];

async function clearNeo4j() {
  const session = require("./config/neo4j").getSession();
  try {
    await session.run("MATCH (n) DETACH DELETE n");
    console.log("Cleared Neo4j graph");
  } finally {
    await session.close();
  }
}

async function seedData() {
  try {
    // Clear MongoDB
    await Promise.all([
      User.deleteMany({}),
      Topic.deleteMany({}),
      Message.deleteMany({}),
      Subscription.deleteMany({}),
      UserPreference.deleteMany({}),
    ]);
    console.log("Cleared MongoDB collections");

    await clearNeo4j();

    // Create users
    const users = [];
    for (const u of SEED_USERS) {
      const user = await User.create({ username: u.username, email: u.email, password: u.password });
      await UserPreference.create({ userId: user._id, genres: u.genres, firstLogin: false });
      await graph.createUser(user._id);
      users.push({ ...u, _id: user._id });
    }
    console.log(`Created ${users.length} users`);

    // Create topics (all owned by admin) and messages from genre subscribers
    const createdTopics = [];
    const admin = users[0];

    for (const genre of AVAILABLE_GENRES) {
      // Users who subscribe to this genre — they will be the message authors
      const genreUsers = users.filter(u => u.genres.includes(genre));
      // Fall back to admin if nobody subscribes to this genre
      const authors = genreUsers.length > 0 ? genreUsers : [admin];
      const messages = GENRE_MESSAGES[genre];

      for (const title of SAMPLE_TOPICS[genre]) {
        const topic = await Topic.create({
          title,
          genre,
          creatorId: admin._id,
          description: SAMPLE_DESCRIPTIONS[genre],
          viewCount: 20 + Math.floor(Math.random() * 180),
          replyCount: messages.length,
        });
        await graph.createTopic(topic._id);
        createdTopics.push(topic);

        // Rotate through genre subscribers so each message has a different author.
        // Spread timestamps over the past 30 days so the thread looks like a real conversation.
        const now = Date.now();
        const threadStart = now - 30 * 24 * 60 * 60 * 1000;
        const interval = (now - threadStart) / (messages.length - 1 || 1);

        for (let i = 0; i < messages.length; i++) {
          const author = authors[i % authors.length];
          const createdAt = new Date(threadStart + interval * i + Math.floor(Math.random() * 3_600_000));
          const msg = await Message.create({
            topicId: topic._id,
            authorId: author._id,
            body: messages[i],
            createdAt,
          });
          await graph.recordPost(author._id, topic._id, msg._id);
        }
      }
    }
    console.log(`Created ${createdTopics.length} topics with messages`);

    // Subscribe each user to topics matching their preferred genres
    for (const user of users) {
      const topicsForUser = createdTopics.filter(t => user.genres.includes(t.genre));
      for (const topic of topicsForUser) {
        await Subscription.create({ userId: user._id, topicId: topic._id });
        await graph.subscribeUserToTopic(user._id, topic._id);
      }
    }
    console.log("Created subscriptions and Neo4j relationships");

    console.log("\nSeed complete. Login with any of:");
    SEED_USERS.forEach(u => console.log(`  ${u.email} / ${u.password}`));

  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedData();
