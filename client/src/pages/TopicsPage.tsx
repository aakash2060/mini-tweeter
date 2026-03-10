import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTopics, subscribeTopic, unsubscribeTopic, createTopic } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Topic {
  _id: string;
  title: string;
  description: string;
  genre: string;
  viewCount: number;
  replyCount: number;
  isSubscribed: boolean;
}

export const TopicsPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', genre: 'Technology' });
  const [error, setError] = useState('');
  const { user } = useAuth();

  const genres = ['Technology', 'Sports', 'Entertainment', 'Science', 'Politics', 'Health', 'Business', 'Education'];

  const fetchTopics = () => getTopics().then(res => setTopics(res.data));
  useEffect(() => { fetchTopics(); }, []);

  const handleSubscribe = async (id: string, subscribed: boolean) => {
    if (subscribed) await unsubscribeTopic(id);
    else await subscribeTopic(id);
    fetchTopics();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createTopic(form);
      setShowForm(false);
      setForm({ title: '', description: '', genre: 'Technology' });
      fetchTopics();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create topic');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Topics</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Topic'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Create a Topic</h3>
          <form onSubmit={handleCreate}>
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            <select value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}>
              {genres.map(g => <option key={g}>{g}</option>)}
            </select>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-primary">Create</button>
          </form>
        </div>
      )}

      <div className="topic-grid">
        {topics.map(topic => (
          <div key={topic._id} className="card topic-card">
            <div className="card-header">
              <span className="badge">{topic.genre}</span>
            </div>
            <h4><Link to={`/topics/${topic._id}`}>{topic.title}</Link></h4>
            <p className="muted">{topic.description}</p>
            <div className="topic-stats">
              <span>👁 {topic.viewCount}</span>
              <span>💬 {topic.replyCount}</span>
            </div>
            <button
              className={topic.isSubscribed ? 'btn-secondary' : 'btn-primary'}
              onClick={() => handleSubscribe(topic._id, topic.isSubscribed)}
            >
              {topic.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
