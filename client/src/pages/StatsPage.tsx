import { useEffect, useState } from 'react';
import { getStats } from '../services/api';
import { TrendingUp, Users } from 'lucide-react';

interface TopTopic {
  _id: string;
  title: string;
  genre: string;
  viewCount: number;
  replyCount: number;
}

interface TopUser {
  _id: string;
  messageCount: number;
  user: { _id: string; username: string };
}

export const StatsPage = () => {
  const [topTopics, setTopTopics] = useState<TopTopic[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  useEffect(() => {
    getStats().then(res => {
      setTopTopics(res.data.topTopics);
      setTopUsers(res.data.topUsers);
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#09090b] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <h1 className="text-2xl font-bold text-zinc-100">Statistics</h1>
          <p className="mt-1 text-sm text-zinc-500">Activity across the platform.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* Most active topics */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-400" />
              <h2 className="text-base font-semibold text-zinc-200">Most Active Topics</h2>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[360px] text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">#</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Topic</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Views</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Replies</th>
                  </tr>
                </thead>
                <tbody>
                  {topTopics.map((t, i) => (
                    <tr key={t._id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors">
                      <td className="px-5 py-3.5 text-zinc-600">#{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-zinc-200 leading-snug">{t.title}</p>
                        <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400 mt-1">
                          {t.genre}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-zinc-400">{t.viewCount}</td>
                      <td className="px-5 py-3.5 text-right text-zinc-400">{t.replyCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Most active users */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Users size={16} className="text-indigo-400" />
              <h2 className="text-base font-semibold text-zinc-200">Most Active Users</h2>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[360px] text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">#</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">User</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Messages</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((u, i) => (
                    <tr key={u._id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors">
                      <td className="px-5 py-3.5 text-zinc-600">#{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-indigo-400">@{u.user.username}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-zinc-400">{u.messageCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
