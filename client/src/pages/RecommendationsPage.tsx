import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations, getMutualSubscribers, subscribeTopic } from '../services/api';
import { GitBranch, Users, Sparkles } from 'lucide-react';

interface Topic {
  _id: string;
  title: string;
  genre: string;
}

interface MutualUser {
  _id: string;
  username: string;
  sharedCount: number;
}

export const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState<Topic[]>([]);
  const [mutualUsers, setMutualUsers] = useState<MutualUser[]>([]);
  const [subscribed, setSubscribed] = useState<Set<string>>(new Set());

  useEffect(() => {
    getRecommendations().then(res => setRecommendations(res.data));
    getMutualSubscribers().then(res => setMutualUsers(res.data));
  }, []);

  const handleSubscribe = async (id: string) => {
    await subscribeTopic(id);
    setSubscribed(prev => new Set([...prev, id]));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#09090b] px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <GitBranch size={18} className="text-indigo-400" />
            <h1 className="text-2xl font-bold text-zinc-100">Graph Recommendations</h1>
          </div>
          <p className="text-sm text-zinc-500">
            Powered by Neo4j — based on what users with overlapping subscriptions follow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

          {/* Recommended topics — takes 2/3 width */}
          <section className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={15} className="text-indigo-400" />
              <h2 className="text-base font-semibold text-zinc-200">Topics You Might Like</h2>
            </div>

            {recommendations.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
                <p className="text-sm text-zinc-600">No recommendations yet.</p>
                <p className="mt-1 text-xs text-zinc-700">Subscribe to more topics to get suggestions.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recommendations.map(topic => (
                  <div
                    key={topic._id}
                    className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors"
                  >
                    <span className="inline-flex w-fit items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400">
                      {topic.genre}
                    </span>
                    <h3 className="mt-3 mb-4 flex-1 text-sm font-medium leading-snug text-zinc-200">
                      <Link to={`/topics/${topic._id}`} className="text-zinc-100 hover:text-white transition-colors">
                        {topic.title}
                      </Link>
                    </h3>
                    <button
                      onClick={() => handleSubscribe(topic._id)}
                      disabled={subscribed.has(topic._id)}
                      className={`w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                        subscribed.has(topic._id)
                          ? 'border border-zinc-700 text-zinc-600 cursor-default'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      {subscribed.has(topic._id) ? 'Subscribed' : 'Subscribe'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Mutual users — takes 1/3 width */}
          <section>
            <div className="mb-5 flex items-center gap-2">
              <Users size={15} className="text-indigo-400" />
              <h2 className="text-base font-semibold text-zinc-200">People Like You</h2>
            </div>

            {mutualUsers.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
                <p className="text-sm text-zinc-600">No mutual subscribers yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mutualUsers.map(u => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:border-zinc-700 transition-colors"
                  >
                    <span className="text-sm font-semibold text-indigo-400">@{u.username}</span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
                      {u.sharedCount} shared
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};
