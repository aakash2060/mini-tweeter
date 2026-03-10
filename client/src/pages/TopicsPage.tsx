import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTopics, subscribeTopic, unsubscribeTopic, createTopic } from '../services/api';
import { Plus, X, Eye, MessageSquare } from 'lucide-react';

interface Topic {
  _id: string;
  title: string;
  description: string;
  genre: string;
  viewCount: number;
  replyCount: number;
  isSubscribed: boolean;
}

const GENRES = ['Technology', 'Sports', 'Entertainment', 'Science', 'Politics', 'Health', 'Business', 'Education'];

const inputClass = "w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors";

export const TopicsPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', genre: 'Technology' });
  const [error, setError] = useState('');

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
    <div className="min-h-[calc(100vh-64px)] bg-[#09090b] px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Topics</h1>
            <p className="mt-1 text-sm text-zinc-500">{topics.length} communities to explore</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              showForm
                ? 'border border-zinc-700 text-zinc-400 hover:text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New Topic</>}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-5 text-base font-semibold text-zinc-100">Create a new topic</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                className={inputClass}
                placeholder="Topic title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                className={`${inputClass} min-h-[80px] resize-none`}
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
              <select
                className={inputClass}
                value={form.genre}
                onChange={e => setForm({ ...form, genre: e.target.value })}
              >
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {error && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
              )}
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Create Topic
              </button>
            </form>
          </div>
        )}

        {/* Topic grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map(topic => (
            <div
              key={topic._id}
              className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-colors"
            >
              <span className="inline-flex w-fit items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 mb-4">
                {topic.genre}
              </span>

              <h3 className="mb-3 text-lg font-semibold leading-snug">
                <Link to={`/topics/${topic._id}`} className="text-zinc-100 hover:text-white transition-colors">
                  {topic.title}
                </Link>
              </h3>

              <p className="mb-5 flex-1 text-sm leading-relaxed text-zinc-500 line-clamp-2">{topic.description}</p>

              <div className="mb-4 flex gap-4 text-xs text-zinc-600">
                <span className="flex items-center gap-1"><Eye size={12} />{topic.viewCount}</span>
                <span className="flex items-center gap-1"><MessageSquare size={12} />{topic.replyCount}</span>
              </div>

              <button
                onClick={() => handleSubscribe(topic._id, topic.isSubscribed)}
                className={`w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                  topic.isSubscribed
                    ? 'bg-zinc-200 text-zinc-900 hover:bg-white active:bg-zinc-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700'
                }`}
              >
                {topic.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
