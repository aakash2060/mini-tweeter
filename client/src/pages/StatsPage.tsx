import { useEffect, useState } from 'react';
import { getStats } from '../services/api';

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
    <div className="page-container">
      <h2>Statistics</h2>

      <section>
        <h3>Most Active Topics</h3>
        <table className="stats-table">
          <thead>
            <tr><th>Topic</th><th>Genre</th><th>Views</th><th>Replies</th></tr>
          </thead>
          <tbody>
            {topTopics.map((t, i) => (
              <tr key={t._id}>
                <td>#{i + 1} {t.title}</td>
                <td><span className="badge">{t.genre}</span></td>
                <td>{t.viewCount}</td>
                <td>{t.replyCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Most Active Users</h3>
        <table className="stats-table">
          <thead>
            <tr><th>User</th><th>Messages Posted</th></tr>
          </thead>
          <tbody>
            {topUsers.map((u, i) => (
              <tr key={u._id}>
                <td>#{i + 1} @{u.user.username}</td>
                <td>{u.messageCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
