import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopicById, getMessages, postMessage, subscribeTopic, unsubscribeTopic } from '../services/api';
import { Eye, MessageSquare, Send } from 'lucide-react';

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
  const [posting, setPosting] = useState(false);

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
    setPosting(true);
    try {
      await postMessage(id!, body);
      setBody('');
      fetchMessages(1);
      setPage(1);
      fetchTopic();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  const handleSubscribe = async () => {
    if (!topic) return;
    if (topic.isSubscribed) await unsubscribeTopic(id!);
    else await subscribeTopic(id!);
    fetchTopic();
  };

  const handlePage = (p: number) => { setPage(p); fetchMessages(p); };

  if (!topic) return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#09090b]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500" />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#09090b] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">

        {/* Topic header */}
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex-1">
              <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400">
                {topic.genre}
              </span>
              <h1 className="mt-2 text-xl font-bold text-zinc-100">{topic.title}</h1>
            </div>
            <button
              onClick={handleSubscribe}
              className={`self-start sm:shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                topic.isSubscribed
                  ? 'bg-zinc-200 text-zinc-900 hover:bg-white active:bg-zinc-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700'
              }`}
            >
              {topic.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-zinc-400">{topic.description}</p>
          <div className="flex gap-5 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5"><Eye size={12} />{topic.viewCount} views</span>
            <span className="flex items-center gap-1.5"><MessageSquare size={12} />{topic.replyCount} replies</span>
          </div>
        </div>

        {/* Post form */}
        {topic.isSubscribed && (
          <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <form onSubmit={handlePost}>
              <textarea
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Write something…"
                rows={3}
                value={body}
                onChange={e => setBody(e.target.value)}
                required
              />
              {error && (
                <p className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
              )}
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={posting || !body.trim()}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                >
                  <Send size={13} />
                  {posting ? 'Posting…' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Messages */}
        <section>
          <h2 className="mb-4 text-base font-semibold text-zinc-300">
            Messages
            {messages.length > 0 && <span className="ml-2 text-sm font-normal text-zinc-600">· page {page} of {totalPages}</span>}
          </h2>

          {messages.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
              <p className="text-sm text-zinc-600">No messages yet. {topic.isSubscribed ? 'Be the first to post!' : 'Subscribe to join the conversation.'}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800">
              {messages.map(msg => {
                const initials = msg.authorId.username.slice(0, 2).toUpperCase();
                const hue = msg.authorId.username.charCodeAt(0) % 4;
                const avatarColor = ['bg-indigo-600','bg-violet-600','bg-emerald-600','bg-amber-600'][hue];
                return (
                  <div key={msg._id} className="flex gap-4 px-5 py-4 hover:bg-zinc-800/30 transition-colors">
                    {/* Avatar */}
                    <div className={`shrink-0 mt-0.5 h-8 w-8 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold text-white`}>
                      {initials}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-semibold text-zinc-100">@{msg.authorId.username}</span>
                        <span className="text-xs text-zinc-600">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-300">{msg.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-indigo-600 text-white'
                      : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
