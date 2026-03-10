import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/api';
import { ArrowRight } from 'lucide-react';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await register(form);
        loginUser({ ...res.data, firstLogin: true });
        navigate('/genre-selection');
      } else {
        const res = await login({ email: form.email, password: form.password });
        loginUser(res.data);
        navigate(res.data.firstLogin ? '/genre-selection' : '/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative w-full max-w-sm">

        {/* Brand */}
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold text-indigo-400">Mini-Tweeter</Link>
          <h1 className="mt-3 text-xl font-semibold text-zinc-100">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {mode === 'login' ? 'Sign in to continue' : 'Join the conversation today'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl shadow-black/40 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Username</label>
                <input
                  className={inputClass}
                  placeholder="yourname"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
              <input
                className={inputClass}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Password</label>
              <input
                className={inputClass}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        </div>

        {/* Demo credentials */}
        {mode === 'login' && (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-zinc-500">Demo accounts</p>
            <div className="space-y-1 text-xs text-zinc-400">
              <p>admin@example.com · <span className="text-zinc-500">admin123</span></p>
              <p>alice@example.com · <span className="text-zinc-500">alice123</span></p>
              <p>bob@example.com · <span className="text-zinc-500">bob123</span></p>
            </div>
          </div>
        )}

        {/* Toggle */}
        <p className="mt-5 text-center text-sm text-zinc-500">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  );
};
