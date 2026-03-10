import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations, getMutualSubscribers, subscribeTopic } from '../services/api';

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
    <div className="page-container">
      <h2>Graph Recommendations</h2>
      <p className="muted">Powered by Neo4j — based on what users with similar subscriptions follow.</p>

      <section>
        <h3>Recommended Topics</h3>
        {recommendations.length === 0
          ? <p className="muted">No recommendations yet — subscribe to more topics to get suggestions.</p>
          : (
            <div className="topic-grid">
              {recommendations.map(topic => (
                <div key={topic._id} className="card topic-card">
                  <span className="badge">{topic.genre}</span>
                  <h4><Link to={`/topics/${topic._id}`}>{topic.title}</Link></h4>
                  <button
                    className={subscribed.has(topic._id) ? 'btn-secondary' : 'btn-primary'}
                    onClick={() => handleSubscribe(topic._id)}
                    disabled={subscribed.has(topic._id)}
                  >
                    {subscribed.has(topic._id) ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </section>

      <section>
        <h3>Users Who Share Your Subscriptions</h3>
        {mutualUsers.length === 0
          ? <p className="muted">No mutual subscribers yet.</p>
          : (
            <div className="user-list">
              {mutualUsers.map(u => (
                <div key={u._id} className="card user-card">
                  <span className="msg-author">@{u.username}</span>
                  <span className="muted">{u.sharedCount} shared subscriptions</span>
                </div>
              ))}
            </div>
          )
        }
      </section>
    </div>
  );
};
