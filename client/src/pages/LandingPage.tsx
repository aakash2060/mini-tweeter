import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare, Bell, GitBranch, Zap,
  Users, LayoutDashboard, ArrowRight, ChevronRight, Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Topic Communities',
    description: 'Genre-based discussion threads built around what matters to you. Subscribe and jump straight into the conversation.',
    spot: 'from-blue-500/20 to-indigo-500/20',
    color: 'text-blue-400',
  },
  {
    icon: Bell,
    title: 'Live Notifications',
    description: 'Never miss a reply. Server-Sent Events push updates to your browser the instant someone posts in your thread.',
    spot: 'from-amber-500/20 to-orange-500/20',
    color: 'text-amber-400',
  },
  {
    icon: GitBranch,
    title: 'Graph Recommendations',
    description: 'Neo4j traverses your subscription graph to surface topics loved by people who share your exact interests.',
    spot: 'from-emerald-500/20 to-teal-500/20',
    color: 'text-emerald-400',
  },
  {
    icon: Zap,
    title: 'Instant Dashboard',
    description: 'Your subscribed topics and the two latest messages from each — surfaced at a single glance, zero noise.',
    spot: 'from-violet-500/20 to-purple-500/20',
    color: 'text-violet-400',
  },
  {
    icon: Users,
    title: 'Mutual Connections',
    description: 'Discover users who share two or more subscriptions with you. Real community built through shared passion.',
    spot: 'from-pink-500/20 to-rose-500/20',
    color: 'text-pink-400',
  },
  {
    icon: LayoutDashboard,
    title: 'Genre Discovery',
    description: 'Choose genres on signup and the platform immediately recommends topics you will love — no cold start.',
    spot: 'from-cyan-500/20 to-sky-500/20',
    color: 'text-cyan-400',
  },
];

const stats = [
  { value: '16+',   label: 'Active topics' },
  { value: '8',     label: 'Genres' },
  { value: 'Live',  label: 'Real-time SSE' },
  { value: 'Neo4j', label: 'Graph engine' },
];

const steps = [
  {
    n: '01',
    title: 'Create your account',
    body: 'Sign up in seconds, pick the genres you care about, and let the platform learn your taste from day one.',
  },
  {
    n: '02',
    title: 'Subscribe to topics',
    body: 'Browse the full topic directory, subscribe to anything that catches your eye, and your dashboard fills instantly.',
  },
  {
    n: '03',
    title: 'Talk & discover',
    body: 'Post messages, receive live replies, and let the graph engine surface communities you didn\'t know you needed.',
  },
];

export const LandingPage = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <span className="text-lg font-bold text-indigo-400 tracking-tight">Mini-Tweeter</span>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16 pb-24 text-center">
        {/* gradient orbs */}
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 bottom-0 h-56 w-96 -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl" />

        <div className="relative max-w-4xl">
          {/* eyebrow badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/80 px-4 py-1.5 text-sm text-zinc-400">
            <Sparkles size={13} className="text-indigo-400" />
            Powered by MongoDB + Neo4j dual-database
          </div>

          <h1 className="mb-6 text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[1.05] tracking-tight">
            Where great{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
              conversations
            </span>
            <br />find their community.
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Join genre-based discussion communities, receive live replies the moment
            they happen, and let our graph engine surface topics you will actually love.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all"
            >
              Start for free <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-8 py-3.5 text-base font-semibold text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-all"
            >
              Sign in <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <div className="border-y border-zinc-800/60 bg-zinc-900/40">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-y-8 px-6 py-10 sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-zinc-50">{value}</p>
              <p className="mt-1 text-sm text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Features</p>
          <h2 className="text-3xl font-bold sm:text-4xl">Everything your community needs</h2>
          <p className="mt-4 mx-auto max-w-xl text-zinc-400">
            A full-stack forum built with a real-time notification layer and a
            graph recommendation engine under the hood.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, spot, color }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900"
            >
              {/* colored glow spot */}
              <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${spot} blur-2xl opacity-60 transition-opacity group-hover:opacity-100`} />
              <div className="relative">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/80">
                  <Icon size={18} className={color} />
                </div>
                <h3 className="mb-2 font-semibold text-zinc-100">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="mx-auto max-w-4xl px-6 py-28">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Getting started</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Up and running in 60 seconds</h2>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {steps.map(({ n, title, body }) => (
              <div key={n} className="text-center">
                <p className="mb-4 text-6xl font-black text-zinc-800 select-none">{n}</p>
                <h3 className="mb-2 font-semibold text-zinc-100">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-950 px-8 py-20 text-center">
          {/* top edge highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to join the conversation?</h2>
            <p className="mx-auto mb-8 max-w-md text-zinc-400">
              Create a free account and start exploring communities built around what you care about.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              Create free account <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
          <span className="text-base font-bold text-indigo-400">Mini-Tweeter</span>
          <p className="text-sm text-zinc-500">Built with React, Express, MongoDB & Neo4j.</p>
        </div>
      </footer>

    </div>
  );
};
