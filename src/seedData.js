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

// Realistic, genre-specific message pools — 10 per genre
const GENRE_MESSAGES = {
  Technology: [
    "This is exactly why I switched to TypeScript last year. No going back.",
    "The benchmarks are impressive but I want to see this at production scale before I buy in.",
    "Hot take: most devs don't need half the complexity they introduce themselves.",
    "Been following this space for a while — the pace of change is genuinely hard to keep up with.",
    "Anyone tried integrating this with a monorepo setup? Curious how it holds up under pressure.",
    "Documentation is rough but the core concept is solid. Give it six months.",
    "I built something similar two years ago and wish this existed back then. Would have saved weeks.",
    "Interesting but the vendor lock-in risk is very real. Proceed with caution.",
    "The community around this is what makes it worth adopting. Ecosystem matters.",
    "This will be the industry default in five years. Calling it now.",
  ],
  Sports: [
    "That last quarter was something else. I couldn't look away for a second.",
    "Stats don't lie — this guy is playing at a completely different level right now.",
    "Honestly thought they'd blow it in the final minutes. Proved me wrong for once.",
    "The coaching decision in the second half was questionable at best. Cost them momentum.",
    "Dynasty incoming. You heard it here first. This team is built different.",
    "As a fan for 15 years, this season has been the most unpredictable I can remember.",
    "Trade rumors are flying already. Front office needs to move fast before the window closes.",
    "Injuries are destroying their depth. Can't keep this up if two more go down.",
    "Best matchup I've watched all season. Genuinely entertaining from tip-off.",
    "Controversial call but honestly it didn't change the result. Better team won.",
  ],
  Entertainment: [
    "Third episode dragged but the finale absolutely made up for it. Stick with it.",
    "The soundtrack alone is worth the watch. Production quality is on another level.",
    "Did not expect to cry during a film like this. And yet, here we are.",
    "Overhyped in my opinion. The original handled the material with so much more care.",
    "Casting choices were inspired across the board. Every single performance landed.",
    "Watched it twice already and caught so many details I missed the first time.",
    "Slow first half but elite second half. Definitely worth sticking through.",
    "The director really committed to the visual style this time around. Refreshing.",
    "My whole friend group got obsessed with this over the weekend. We can't stop talking about it.",
    "Divisive ending but I actually loved what they were going for. Respects the audience.",
  ],
  Science: [
    "The methodology section is where most people miss all the important nuance.",
    "Replication will be the real test here. Exciting result but let's not get ahead of ourselves.",
    "If this holds up under scrutiny the implications for the field are massive.",
    "I work in this area and this paper genuinely shifted how I think about the problem.",
    "Sample size is small but the effect size is notable enough to pay attention to.",
    "Classic case of science media overhyping a very preliminary finding. Happens every time.",
    "Been waiting for a breakthrough in this specific area for years. Finally.",
    "The potential applications in medicine alone could be transformative if this scales.",
    "Peer review is going to be brutal on the methodology. Rightfully so.",
    "Science is moving fast this year across every field. Hard to keep up.",
  ],
  Politics: [
    "Policy details matter a hundred times more than the headlines. Always read past the lede.",
    "Both sides are using this to score points while completely missing the actual human impact.",
    "Young voter engagement is at a level I have not seen before. Something has genuinely shifted.",
    "The economic angle is being almost entirely ignored in the mainstream coverage of this.",
    "Local politics affects your daily life more than federal ever will. Worth paying attention.",
    "Tired of the performative outrage cycle. What is the actual concrete plan being proposed?",
    "Historical context is essential here and almost nobody in the discourse is providing it.",
    "This decision is going to be relitigated and debated for decades regardless of outcome.",
    "The real story is always buried in paragraph twelve. Media literacy is survival now.",
    "Wherever you stand on this, the turnout numbers represent something meaningful.",
  ],
  Health: [
    "Small consistent habits will beat intense bursts every single time. Compounding is real.",
    "Sleep is always the most underrated variable in any health or performance conversation.",
    "Tried this specific approach for three months. Noticed a real difference by week six.",
    "Worked with a coach on exactly this last year. The accountability element is everything.",
    "The research on this has genuinely reversed course in the last five years. Wild.",
    "Mental and physical health are so deeply intertwined. You cannot optimize one while ignoring the other.",
    "Recovery matters just as much as effort. Most people skip it and wonder why they plateau.",
    "The app recommendations in this thread are actually solid. Already using two of them.",
    "Quality over quantity here without question. Took me way too long to internalize that.",
    "Everyone's baseline is different. What transforms one person's health might do nothing for yours.",
  ],
  Business: [
    "The unit economics here do not add up long term. Burn rate like that is not sustainable.",
    "Bootstrapped is deeply underrated. Not every business needs or benefits from VC capital.",
    "Culture eats strategy for breakfast every time. I have seen it destroy great ideas firsthand.",
    "This market is crowded but there is still clear room for a genuinely differentiated product.",
    "Pitch was strong but the execution questions are the ones that actually matter at this stage.",
    "Focus is the unlock almost every time. Every distraction kills compounding momentum.",
    "Raising on story before traction is a brave move in this environment. Respect the conviction.",
    "The freelance model scales very differently. It is a lifestyle business and that is completely valid.",
    "Boring fundamentals still win in the end. Cash flow is king regardless of what era you are in.",
    "Advisory boards are massively underutilized by most early stage founders. Big missed opportunity.",
  ],
  Education: [
    "The shift to project-based learning cannot come fast enough. Theory without application is hollow.",
    "Good teachers are the single variable that matters most. Every dollar should go there first.",
    "Online learning democratized access to knowledge. The credentialing side is just catching up.",
    "Some semesters I spent more on textbooks than food. The system is genuinely broken.",
    "The ROI conversation around degrees is more nuanced than most hot takes on either side.",
    "Critical thinking over content consumption. That is the entire goal and we keep losing sight of it.",
    "AI in the classroom is inevitable at this point. Better to prepare educators than resist the tide.",
    "Class sizes remain the most consistently under-discussed problem in education policy.",
    "Learned more from personal side projects than from any formal course I completed.",
    "Access is still the core issue. Quality education remains a privilege far more than a right.",
  ],
};

// Each seed user subscribes to these genres — creates overlap for graph recommendations
const SEED_USERS = [
  { username: "admin", email: "admin@example.com", password: "admin123", genres: ["Technology", "Science", "Business"] },
  { username: "alice", email: "alice@example.com", password: "alice123", genres: ["Technology", "Sports", "Health"] },
  { username: "bob",   email: "bob@example.com",   password: "bob123",   genres: ["Technology", "Entertainment", "Business"] },
  { username: "carol", email: "carol@example.com", password: "carol123", genres: ["Sports", "Science", "Education"] },
  { username: "dave",  email: "dave@example.com",  password: "dave123",  genres: ["Health", "Business", "Politics"] },
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

        // Rotate through genre subscribers so each message has a different author
        for (let i = 0; i < messages.length; i++) {
          const author = authors[i % authors.length];
          const msg = await Message.create({
            topicId: topic._id,
            authorId: author._id,
            body: messages[i],
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
