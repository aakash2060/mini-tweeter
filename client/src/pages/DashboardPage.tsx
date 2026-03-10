import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, subscribeTopic } from '../services/api';

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

  if (!data) return <div className="page-container"><p>Loading...</p></div>;

  return (
    <div className="page-container">
      <h2>Welcome back, @{data.user.username}</h2>

      <section>
        <h3>Your Subscribed Topics</h3>
        {data.subscribedTopicsWithMessages.length === 0
          ? <p className="muted">You haven't subscribed to any topics yet. <Link to="/topics">Browse topics</Link></p>
          : data.subscribedTopicsWithMessages.map(({ topic, messages }) => (
            <div key={topic._id} className="card">
              <div className="card-header">
                <Link to={`/topics/${topic._id}`}><h4>{topic.title}</h4></Link>
                <span className="badge">{topic.genre}</span>
              </div>
              {messages.length === 0
                ? <p className="muted">No messages yet.</p>
                : messages.map(msg => (
                  <div key={msg._id} className="message-preview">
                    <span className="msg-author">@{msg.authorId.username}</span>
                    <span className="msg-body">{msg.body}</span>
                    <span className="msg-time">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              }
            </div>
          ))
        }
      </section>

      {data.recommendedTopics.length > 0 && (
        <section>
          <h3>Recommended for You</h3>
          <div className="topic-grid">
            {data.recommendedTopics.map(topic => (
              <div key={topic._id} className="card topic-card">
                <span className="badge">{topic.genre}</span>
                <h4>{topic.title}</h4>
                <div className="card-actions">
                  <Link to={`/topics/${topic._id}`} className="btn-secondary">View</Link>
                  <button className="btn-primary" onClick={() => handleSubscribe(topic._id)}>Subscribe</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
