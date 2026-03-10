import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopicById, getMessages, postMessage, subscribeTopic, unsubscribeTopic } from '../services/api';

interface Message {
  _id: string;
  body: string;
  createdAt: string;
  authorId: { username: string };
}

interface Topic {
  _id: string;
  title: string;
  description: string;
  genre: string;
  viewCount: number;
  replyCount: number;
  isSubscribed: boolean;
}

export const TopicDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const fetchTopic = () => getTopicById(id!).then(res => setTopic(res.data));
  const fetchMessages = (p = page) =>
    getMessages(id!, p).then(res => {
      setMessages(res.data.messages);
      setTotalPages(res.data.totalPages);
    });

  useEffect(() => { fetchTopic(); fetchMessages(1); }, [id]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await postMessage(id!, body);
      setBody('');
      fetchMessages(1);
      setPage(1);
      fetchTopic();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to post');
    }
  };

  const handleSubscribe = async () => {
    if (!topic) return;
    if (topic.isSubscribed) await unsubscribeTopic(id!);
    else await subscribeTopic(id!);
    fetchTopic();
  };

  const handlePage = (p: number) => {
    setPage(p);
    fetchMessages(p);
  };

  if (!topic) return <div className="page-container"><p>Loading...</p></div>;

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2>{topic.title}</h2>
            <span className="badge">{topic.genre}</span>
          </div>
          <button
            className={topic.isSubscribed ? 'btn-secondary' : 'btn-primary'}
            onClick={handleSubscribe}
          >
            {topic.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>
        </div>
        <p>{topic.description}</p>
        <div className="topic-stats">
          <span>👁 {topic.viewCount} views</span>
          <span>💬 {topic.replyCount} replies</span>
        </div>
      </div>

      {topic.isSubscribed && (
        <div className="card">
          <h4>Post a message</h4>
          <form onSubmit={handlePost}>
            <textarea
              placeholder="Write something..."
              value={body}
              onChange={e => setBody(e.target.value)}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-primary">Post</button>
          </form>
        </div>
      )}

      <section>
        <h3>Messages</h3>
        {messages.length === 0
          ? <p className="muted">No messages yet. Be the first!</p>
          : messages.map(msg => (
            <div key={msg._id} className="card message-card">
              <div className="msg-header">
                <span className="msg-author">@{msg.authorId.username}</span>
                <span className="msg-time">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <p>{msg.body}</p>
            </div>
          ))
        }

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={p === page ? 'btn-primary' : 'btn-secondary'}
                onClick={() => handlePage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
