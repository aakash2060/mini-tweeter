import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, subscribeTopic } from '../services/api';
import { MessageSquare, Eye, ArrowRight, Sparkles } from 'lucide-react';

interface Message {
  _id: string;
  body: string;
  createdAt: string;
  authorId: { username: string };
}

interface TopicWithMessages {
  topic: { _id: string; title: string; genre: string };
  messages: Message[];
}

interface RecommendedTopic {
  _id: string;
  title: string;
  genre: string;
}

export const DashboardPage = () => {
  const [data, setData] = useState<{
    user: { username: string };
    subscribedTopicsWithMessages: TopicWithMessages[];
    recommendedTopics: RecommendedTopic[];
  } | null>(null);

  const fetchDashboard = () =>
    getDashboard().then(res => setData(res.data)).catch(console.error);

  useEffect(() => { fetchDashboard(); }, []);

  const handleSubscribe = async (topicId: string) => {
    await subscribeTopic(topicId);
    fetchDashboard();
  };

  if (!data) return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#09090b]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500" />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#09090b] px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-zinc-100">
            Welcome back, <span className="text-indigo-400">@{data.user.username}</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Here's what's happening in your communities.</p>
        </div>

        {/* Subscribed topics */}
        <section className="mb-12">
          <h2 className="mb-5 text-lg font-semibold text-zinc-200">Your Topics</h2>
          {data.subscribedTopicsWithMessages.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
              <p className="text-zinc-500">You haven't subscribed to any topics yet.</p>
              <Link
                to="/topics"
                className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Browse topics <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {data.subscribedTopicsWithMessages.map(({ topic, messages }) => (
                <div key={topic._id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <Link
                        to={`/topics/${topic._id}`}
                        className="font-semibold text-zinc-100 hover:text-white transition-colors"
                      >
                        {topic.title}
                      </Link>
                      <span className="ml-2 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                        {topic.genre}
                      </span>
                    </div>
                    <Link
                      to={`/topics/${topic._id}`}
                      className="shrink-0 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      View all →
                    </Link>
                  </div>

                  {messages.length === 0 ? (
                    <p className="text-sm text-zinc-600">No messages yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {messages.map(msg => (
                        <div key={msg._id} className="flex items-baseline gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5">
                          <span className="shrink-0 text-xs font-semibold text-indigo-400">@{msg.authorId.username}</span>
                          <span className="flex-1 truncate text-sm text-zinc-300">{msg.body}</span>
                          <span className="shrink-0 text-xs text-zinc-600">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommendations */}
        {data.recommendedTopics.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <h2 className="text-lg font-semibold text-zinc-200">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.recommendedTopics.map(topic => (
                <div key={topic._id} className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
                  <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                    {topic.genre}
                  </span>
                  <h3 className="mt-3 mb-4 text-sm font-medium text-zinc-200 leading-snug">{topic.title}</h3>
                  <div className="flex gap-2">
                    <Link
                      to={`/topics/${topic._id}`}
                      className="flex-1 rounded-lg border border-zinc-700 py-1.5 text-center text-xs font-medium text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleSubscribe(topic._id)}
                      className="flex-1 rounded-lg bg-indigo-600 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
