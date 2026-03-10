require("dotenv").config();
require("./config/db");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Topic = require("./models/topic");
const Message = require("./models/message");

/* ----- sample data placeholders ----- */
const AVAILABLE_GENRES = [
  "Technology",
  "Sports",
  "Entertainment",
  "Science",
  "Politics",
  "Health",
  "Business",
  "Education",
];

const SAMPLE_TOPICS = {
  Technology: [
    "The future of AI in everyday life",
    "Next.js vs. React — What to choose in 2025?",
  ],
  Sports: [
    "Can Messi still dominate MLS?",
    "NBA playoffs: Who’s taking the championship?",
  ],
  Entertainment: [
    "Top 5 must-watch movies this summer",
    "Why K-pop is taking over the world",
  ],
  Science: [
    "NASA’s latest Mars mission updates",
    "How quantum computing will change the world",
  ],
  Politics: [
    "What the 2024 elections mean for young voters",
    "Crypto regulations: A necessary evil?",
  ],
  Health: [
    "Why sleep is your superpower",
    "The rise of mental health apps in Gen Z",
  ],
  Business: [
    "How to pitch your startup in 60 seconds",
    "The freelance economy: Is it sustainable?",
  ],
  Education: [
    "AI tutors: Should schools embrace them?",
    "Is college still worth it in 2025?",
  ],
};

const SAMPLE_MESSAGES = [
  "Absolutely agree with this 💯",
  "Interesting take. I never thought of it that way!",
  "Anyone else following this? It's getting wild.",
  "I've been saying this for years!",
  "This aged well 😂",
  "Love how this thread explains it so simply.",
  "Bookmarking this for later 🔖",
  "Can someone explain this to me like I'm five?",
  "Y'all really need to read more before posting 😅",
  "This is the best thing I’ve read today 👏",
];

const SAMPLE_DESCRIPTIONS = {
  Technology:
    "Discussions on the latest innovations and trends in technology, including AI, software, and hardware.",
  Sports:
    "Explore the world of sports, including the latest news, match results, and analysis.",
  Entertainment:
    "Stay updated on the hottest movies, music, celebrities, and all things entertainment.",
  Science:
    "Insights into scientific discoveries, research, and the future of science and technology.",
  Politics:
    "Political debates, election updates, policy discussions, and analysis of current events.",
  Health:
    "Conversations about physical and mental well-being, fitness, healthcare, and medical advancements.",
  Business:
    "The latest trends in business, entrepreneurship, startups, and the economy.",
  Education:
    "A look at educational systems, online learning, and the future of education.",
};

async function seedData() {
  try {
    await User.deleteMany({});
    await Topic.deleteMany({});
    await Message.deleteMany({});
    console.log("Cleared existing data");

    const admin = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 12),
    });

    const createdTopics = [];
    for (const genre of AVAILABLE_GENRES) {
      for (const title of SAMPLE_TOPICS[genre]) {
        const topic = await Topic.create({
          title,
          genre,
          creatorId: admin._id,
          description: SAMPLE_DESCRIPTIONS[genre],
          viewCount: Math.floor(Math.random() * 50),
          replyCount: SAMPLE_MESSAGES.length,
        });
        createdTopics.push(topic);

        for (const body of SAMPLE_MESSAGES) {
          await Message.create({
            topicId: topic._id,
            authorId: admin._id,
            body,
          });
        }
      }
    }
    console.log(`Created ${createdTopics.length} topics with sample messages`);
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedData();
